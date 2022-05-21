<?php

/**
 * Registration controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class RegisterController extends Falcon_Controller_Action
{
    protected $_defaultAction = 'monitoring';
    protected $_skipAccessCheck = true;
    protected $_noCheckActions = ['index', 'monitoring',
        'supply', 'submit', 'confirm', 'finish'];

    /*
     * Действие по умолчанию, на случай если вторую часть урла не завезли
     */
    public function indexAction()
    {
        $function = $this->_defaultAction . 'Action';
        $this->$function();
    }

    /**
     * Регистрация в систему мониторинга транспорта
     */
    public function monitoringAction()
    {
    }

    /**
     * Регистрация в систему поставок продовольствия
     */
    public function supplyAction()
    {
    }

    /**
     * Отправка заявки на регистрацию
     */
    public function submitAction()
    {
        $params = $this->_getAllParams();
        try {
            $worker = new Falcon_Action_Register();
            $worker->addPending($params);
        } catch (Falcon_Exception $e) {
            $this->_processException($e);
            return;
        }
        $this->sendAnswer();
    }

    /**
     * Подтверждение регистрации
     */
    public function confirmAction()
    {
        $hash = $this->_getParam('id');
        if (!empty($hash)) {
            $worker = new Falcon_Action_Register();
            $this->view->valid = $worker->isValidHash($hash);
        }
        $this->view->hash = $hash;
    }

    /**
     * Завершение регистрации
     */
    public function finishAction()
    {
        $params = $this->_getAllParams();

        try {
            $worker = new Falcon_Action_Register();
            $worker->finishObserver($params);
        } catch (Falcon_Exception $e) {
            $this->_processException($e);
            return;
        }

        $this->sendAnswer();
    }

    /**
     * Обработка пойманного эксепшена
     * @param {Falcon_Exception} $e
     */
    protected function _processException($e)
    {
        $answer = new Falcon_Message();
        $code = $e->getCode();
        if ($code == Falcon_Exception::ALREADY_EXISTS) {
            $answer->addParam('error', true);
        } else {
            $answer->error($e->getCode(), (array)$e->getMessage());
        }
        $this->sendAnswer($answer);
    }

    public function uploadAction()
    {
        $path = Zend_Registry::get('config')->path->uploaded;
        $answer = new Falcon_Message();
        if (empty($_FILES['file'])) {
            return $this->sendAnswer($answer->error(4042));
        }

        do {
            $hash = Falcon_Util::genHash();
        } while (is_file($path . $hash));

        copy($_FILES['file']['tmp_name'], $path . $hash);
        $answer->addParam('hash', $hash);

        $parts = explode('.', $_FILES['file']['name']);
        $extension = count($parts > 1) ? array_pop($parts) : '';
        $answer->addParam('extension', $extension);

        die(json_encode($answer->toArray()));
    }
}
