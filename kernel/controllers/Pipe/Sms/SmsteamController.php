<?php

/**
 * Pipe smsteam receiver controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Pipe_Sms_SmsteamController extends Falcon_Controller_Action
{
    // Skip user access check for this controller
    protected $_skipAccessCheck = true;

    /**
     * smsteam.ru
     */
    public function indexAction()
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('pipe_sms', vdv($this->getParams()));
        if (!$this->isCorrectKey()) {
            $answer = new Falcon_Message();
            return $this->sendAnswer($answer->error(
                Falcon_Exception::ACCESS_VIOLATION));
        }
        $this->processMessage([
            'phone' => $this->getParam('phone'),
            'messageText' => $this->getParam('mes')
        ]);
        $this->sendAnswer();
    }

    /**
     * Checks if supplied secret_key is correct
     * @return boolean
     */
    public function isCorrectKey()
    {
        foreach (['md5', 'sha1', 'crc32'] as $type) {
            $value = $this->getParam($type);
            if ($value) {
                return ($value === $this->getSecretKeyString($type));
            }
        }
        return false;
    }

    /**
     * Returns secretKey value
     * @param type $type
     * @return type
     */
    public function getSecretKeyString($type = 'md5')
    {
        $config = Zend_Registry::get('config');
        $secretKey = $config->sms->SmsTeamRu->secret_key->$type;
        $message = '';
        if ($this->getParam('mes') !== null) {
            // message
            $message =
                $this->getParam('phone') . ':' .
                $this->getParam('mes') . ':' .
                $this->getParam('to') . ':' .
                $secretKey;
        } else {
            // status
            $message =
                $this->getParam('id') . ':' .
                $this->getParam('phone') . ':' .
                $this->getParam('status') . ':' .
                $secretKey;
        }
        if ($type == 'md5') {
            return md5($message);
        } elseif ($type == 'sha1') {
            return sha1($message);
        } elseif ($type == 'crc32') {
            return crc32($message);
        }
        return 'UnknownEncodingType';
    }

    /**
     * Process message
     * @param array $data
     */
    public function processMessage($data)
    {
        $logger = Falcon_Logger::getInstance();
        $m = Falcon_Mapper_Mon_Device::getInstance();
        $device = $m->loadByPhone($data['phone'], true);
        if ($device && $device->isActive()) {
            // Let's create a request to the pipe-server
            $identifier = $device->getOption('identifier');
            $commandData = [
                'uid' => $identifier,
                'command' => 'incoming_sms',
                'transport' => 'sms',
                'params' => [
                    'messageText' => $data['messageText']
                ]
            ];
            Falcon_Amqp::sendTo('mon.device', 'command.create', $commandData);
        } else {
            $logger->log('pipe_sms', $data, 'Device not found or inactive');
        }
    }
}