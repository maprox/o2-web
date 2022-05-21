<?php

/**
 * Doc controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Dn_DocController extends Falcon_Controller_Action
{
    /**
     * Получение списка складов
     */
    public function get()
    {
        $m = new Falcon_Model_Manager();
        return $m->loadDnDoc();
    }

    /**
     * upload
     */
    public function uploadAction()
    {
        $config = Zend_Registry::get('config');
        $path = $config->path->uploaded;
        $answer = new Falcon_Message();
        if (empty($_FILES['file'])) {
            return $this->sendAnswer($answer->error(4042));
        }

        $t = Zend_Registry::get('translator');
        $msgFileIsTooBig = $t['zt']->_('File too big');

        // Checking file size
        $maxFileSize = $config->upload_constraints->dn_doc->max_file_size;
        $fileSize = $_FILES['file']['size'];
        if ($fileSize > $maxFileSize) {
            // Using die() because of hidden iframe method
            die(json_encode([
                'success' => false,
                'message' => $msgFileIsTooBig
            ]));
        }

        do {
            $hash = Falcon_Util::genHash();
        } while (is_file($path . $hash));

        if (!$_FILES['file']['tmp_name']) {
            // here we are if file was not created while
            // access violation, or file was too big
            // Using die() because of hidden iframe method
            die(json_encode([
                'success' => false,
                'message' => $msgFileIsTooBig
            ]));
        }
        copy($_FILES['file']['tmp_name'], $path . $hash);

        // Saving doc to database
        $recordArray = [
            'name' => addslashes($_POST['name']),
            'file' => $_FILES['file']['name'],
            'hash' => $hash,
            'id_firm_for' => (int)$_POST['id_firm_for'],
            'id_firm' => $this->getUserFirmId(),
            'dt' => date(DB_DATE_FORMAT)
        ];

        $record = new Falcon_Record_Dn_Doc($recordArray);
        $record->insert();

        $answer['data'] = $record->toArray();

        // TODO: refactoring
        Falcon_Action_Update::addToFirm(
            ['alias' => 'dn_doc'], (int)$_POST['id_firm_for']);
        Falcon_Action_Update::addToFirm(
            ['alias' => 'dn_doc'], $this->getUserFirmId());

        // только так
        die(json_encode($answer->toArray()));
    }

    /**
     * download
     */
    public function downloadAction()
    {
        $id = (int)$this->_getParam('id');
        $answer = new Falcon_Message();
        if (!$id) {
            return $this->sendAnswer($answer->error(4042));
        }
        $record = new Falcon_Record_Dn_Doc($id);
        $path = Zend_Registry::get('config')
                ->path->uploaded . $record->get('hash');
        $firmId = $this->getUserFirmId();
        if ($firmId != $record->get('id_firm')
            && $firmId != $record->get('id_firm_for')
        ) {
            header("HTTP/1.0 404 Not Found");
            die();
        }
        if (!is_file($path)) {
            header("HTTP/1.0 404 Not Found");
            die();
        }

        $useragent = $this->getRequest()->getServer('HTTP_USER_AGENT');
        $filename = $record->get('file');
        $filenameHeader = 'filename="' . rawurlencode($filename) . '"';
        if (strpos(strtolower($useragent), 'firefox'))
            $filenameHeader = 'filename*="utf8\'\'' . rawurlencode($filename) . '"';

        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; ' . $filenameHeader);
        readfile($path);
        die;
    }

    /**
     * set
     */
    public function setAction()
    {
        $data = $this->getJsonData();
        $answer = new Falcon_Message();
        // ID check
        if (!isset($data->id)) {
            return $this->sendAnswer($answer->error(4042));
        }
        $id = $data->id;
        $record = new Falcon_Record_Dn_Doc($id);
        // data change
        if (isset($data->state) && $data->state == 3) {
            $path = Zend_Registry::get('config')
                    ->path->uploaded . $record->get('hash');
            if (file_exists($path)) {
                unlink($path);
            }
            Falcon_Mapper_Dn_Doc::getInstance()
                ->delete(['id = ?' => $id]);

            // TODO: refactoring
            Falcon_Action_Update::addToFirm(
                ['alias' => 'dn_doc'], $data->id_firm_for);
            Falcon_Action_Update::addToFirm(
                ['alias' => 'dn_doc'], $this->getUserFirmId());
        }
        $this->sendAnswer($answer);
    }
}
