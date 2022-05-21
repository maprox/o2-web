<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Includes methods for attachment management
 */
class Falcon_Controller_Attachment extends Falcon_Controller_Action_Rest
{

    /**
     * Allowed mime type of uloaded file
     * @var type
     */
    protected $allowedMime = [
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    /**
     * Upload attachment
     * Request params should include parent entity alias and id
     */
    public function uploadAction()
    {
        $logger = Falcon_Logger::getInstance();

        $entity = $this->getClassAlias(true);
        $answer = new Falcon_Message();

        // Get id_entity
        if (!$this->getParam('id_entity')) {
            return $this->sendAnswer($answer->error(4042));
        }
        $entityId = $this->getParam('id_entity');

        // Check write right on entity
        Falcon_Access::checkWrite($entity, $entityId);

        $config = Zend_Registry::get('config');
        $path = $config->path->uploaded;

        if (empty($_FILES['file'])) {
            return $this->sendAnswer($answer->error(4042));
        }

        $t = Zend_Registry::get('translator');
        $msgFileIsTooBig = $t['zt']->_('File too big');

        // Checking file size
        // Get upload constraints
        $uploadConstraints = $config->upload_constraints;
        if (isset($uploadConstraints->$entity)) {
            $constraints = $uploadConstraints->$entity;
        } else {
            $constraints = $uploadConstraints->common;
        }

        $maxFileSize = $constraints->max_file_size;
        $fileSize = $_FILES['file']['size'];
        if ($fileSize > $maxFileSize) {
            // Using die() because of hidden iframe method
            die(json_encode([
                'success' => false,
                'message' => $msgFileIsTooBig
            ]));
        }

        // Checking file type
        if (!in_array($_FILES['file']['type'], $this->allowedMime)) {
            // Using die() because of hidden iframe method
            die(json_encode([
                'success' => false,
                'message' => $t['zt']->_('The file type is not allowed')
            ]));
        }

        do {
            $hash = uniqid($entity . '_attachment', true);
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

        // Save file on disk
        $this->saveFile($_FILES['file']['tmp_name'], $path . $hash);

        // Actions before insert attachment record
        $this->onBeforeInsertAttachment();

        // Insert x_attachment record
        $attachment = new Falcon_Record_X_Attachment([
            'name' => addslashes($this->getParam('name')),
            'file' => $_FILES['file']['name'],
            'mime' => $_FILES['file']['type'],
            'size' => $_FILES['file']['size'],
            'hash' => $hash,
            'dt' => date(DB_DATE_FORMAT)
        ]);
        $attachment->insert();

        // Create attachment link
        $this->createAttachmentLink($attachment);

        // Add updates for entity
        $this->addEntityUpdates();

        // Create thumb file
        // If thumb will be generated via amqp message
        // we will need an additional update send
        // TODO: create only if content-type allows creation
        $imagePath = $path . $hash;
        $this->createImageThumb($imagePath);

        // important
        die(json_encode($answer->toArray()));
    }

    /**
     * Add entity updates
     */
    protected function addEntityUpdates()
    {
        $entity = $this->getClassAlias(true);
        $entityId = $this->getParam('id_entity');

        // Write update for entity and id_entity
        // X_access table
        $accessTable = new Falcon_Table_X_Access();

        $objectRecordName = 'Falcon_Record_' . ucwords_custom($entity);
        $object = new $objectRecordName($entityId);
        $objectUsers = $accessTable->getUsersByObject($object);

        Falcon_Action_Update::add([
            'alias' => $entity,
            'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
            'id_entity' => $entityId,
            'id_user' => $objectUsers
        ]);
    }

    /**
     * Save file on disk
     * @param type $tmpName
     */
    protected function saveFile($tmpName, $newName)
    {
        copy($tmpName, $newName);
    }

    /**
     * Actions before attacment insert
     */
    protected function onBeforeInsertAttachment()
    {
        return;
    }

    /**
     * Creates image thumb
     * @param String $imagePath Image path
     */
    protected function createImageThumb($imagePath)
    {
        $resized = $this->longSideResize($imagePath);
        $resized->writeImage($imagePath . '.thumb');
        $resized->destroy();
    }

    /**
     * Links attachment with entity
     * @param Array[] $files
     */
    protected function createAttachmentLink($attachment)
    {
        $entity = $this->getClassAlias(true);
        $entityId = $this->getParam('id_entity');

        // Insert link record
        $linkRecordName = 'Falcon_Record_' . ucwords_custom(
                $entity . '_attachment_link'
            );
        $linkRecord = new $linkRecordName([
            'id_x_attachment' => $attachment->get('id'),
            'id_' . $entity => $entityId
        ]);
        $linkRecord->insert();
    }

    /**
     * Resizes the image
     * @param String $file Path to file
     * @param Integer $size Long side size
     */
    protected function longSideResize($file, $size = 160)
    {
        $img = new Imagick($file);
        $img->thumbnailImage($size, $size, true);

        return $img;
    }

    /**
     * Returns requested attachment
     * Only images now
     */
    public function attachmentAction()
    {
        $option = $this->getParam('option');
        $id = $this->getParam('id');

        // Check read
        $this->checkAttachmentRight($id, 'read');

        // get attachment record
        $attachment = new Falcon_Record_X_Attachment($id);

        $path = Zend_Registry::get('config')->path->uploaded;
        $filename = $attachment->get('hash');
        // TODO: abstract options
        if (strtolower($option) === 'thumb') {
            $filename .= '.thumb';
        }

        header('Content-Type: ' . $attachment->get('mime'));
        header('Expires:');
        header('Pragma:');
        header('Cache-Control: public');
        header('Cache-Control: max-age=2592000');
        readfile($path . $filename);
        die();
    }

    /**
     * Edit attachment action
     */
    public function editattachmentAction()
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();

        $config = Zend_Registry::get('config');
        $path = $config->path->uploaded;

        // Get record data
        $data = json_decode($this->getParam('data'), true);

        // Check access
        if (empty($data['id'])) {
            $answer->setSuccess(false);
            return $answer;
        }
        // Check rights
        $entityId = $this->checkAttachmentRight($data['id'], 'write');
        $entityAlias = $this->getClassAlias(true);

        // Attachment record
        $record = new Falcon_Record_X_Attachment($data['id']);
        // Fields that user can edit
        $allowEdit = ['name', 'state'];
        // Set fields
        $deleted = false;
        foreach ($data as $field => $value) {
            if ($field == 'state' &&
                $value == Falcon_Record_Abstract::STATE_DELETED
            ) {
                // If we are deleteting attachment
                $deleted = true;

                break;
            }

            if (in_array($field, $allowEdit)) {
                $record->set($field, $value);
            }
        }

        // If attachment has been deleted
        if ($deleted) {
            // Delete attachment file
            $hash = $record->get('hash');

            // Delete attachment row
            $record->delete();

            // Delete related files
            if (!$hash) {
                return;
            }
            $filePath = $path . $hash;
            if (!preg_match('/' . $entityAlias . '_attachment/i', $filePath)) {
                $logger->log('error', 'The attachment you are trying to delete'
                    . ' has wrong name: ' . $filePath
                );
                return;
            }
            // Delete main file
            unlink($filePath);
            // Delete thumb
            // TODO: delete thumb if only exists
            unlink($filePath . '.thumb');
        } else {
            // Update record if not deleting
            $record->update();
        }

        // Write updates
        // X_access table
        $accessTable = new Falcon_Table_X_Access();

        $entityRecordName = 'Falcon_Record_' . ucwords_custom($entityAlias);
        $entityObject = new $entityRecordName($entityId);
        $entityUsers = $accessTable->getUsersByObject($entityObject);

        Falcon_Action_Update::add([
            'alias' => $entityAlias,
            'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
            'id_entity' => $entityId,
            'id_user' => $entityUsers
        ]);
    }

    /**
     * Deleted file by hash
     * TODO: use this function in editattachment
     * @param type $hash
     */
    protected function deleteFileByHash($hash)
    {
        $logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');
        $path = $config->path->uploaded;
        $entityAlias = $this->getClassAlias(true);

        $filePath = $path . $hash;

        // Prevent accidentally deleting wrong files
        if (!preg_match('/' . $entityAlias . '_attachment/i', $filePath)) {
            $logger->log('error', 'The attachment you are trying to delete'
                . ' has wrong name: ' . $filePath
            );
            return;
        }

        // Delete main file
        unlink($filePath);
    }

    /**
     * Checks attachment right
     * @param type $id
     * @param type $type
     * @return Integer Returns object id attachment belongs to
     */
    protected function checkAttachmentRight($id, $type = 'read')
    {
        $entityAlias = $this->getClassAlias(true);

        $linkMapperName = 'Falcon_Mapper_' . ucwords_custom(
                $entityAlias . '_attachment_link'
            );

        $linkMapper = $linkMapperName::getInstance();

        $links = $linkMapper->load([
            'id_x_attachment = ?' => $id
        ]);

        if (!count($links)) {
            throw new Falcon_Exception('',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        $link = $links[0];

        $objectId = $link->get('id_' . $entityAlias);

        $checkMethodName = 'check' . ucfirst($type);

        Falcon_Access::$checkMethodName($entityAlias, $objectId);

        return $objectId;
    }
}
