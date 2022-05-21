<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Rest controller
 */
class Mon_Device_CommandController extends Falcon_Controller_Action_Rest
{
    /**
     * Sends command
     */
    public function sendAction()
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();
        $params = $this->getParams();

        if (!$this->getParam('id_device')) {
            throw new Falcon_Exception('Command send: No id device');
        }

        $idDevice = $this->getParam('id_device');
        // Check device access
        Falcon_Access::checkWrite('mon_device', $idDevice);

        // Get device uid
        $device = new Falcon_Record_Mon_Device($idDevice);
        $uid = $device->getOption('identifier');

        if (!$uid) {
            throw new Falcon_Exception('Command send: No device UID');
        }

        // Check command_template access
        $commandTemplateId = $this->getParam('id_command_template');
        if ($commandTemplateId) {
            Falcon_Access::checkWrite(
                'mon_device_command_template', $commandTemplateId);
        }

        $transport = $params['transport'];
        $commandData = [
            'command' => $params['command'],
            'transport' => $transport,
            'id_command_template' => $commandTemplateId,
            'params' => json_decode($params['params'], true),
            'uid' => $uid
        ];

        if ($transport == 'sms') {
            // Let's fill in config section of command
            $config = Zend_Registry::get('config');
            $from = Falcon_Util_Phone::normalize($config->sms->serverPhone);
            $commandData['config'] = [
                'from' => $from,
                'address' => $device->getOption('phone'),
                'id_object' => $device->getId(),
                'id_firm' => $device->get('id_firm')
            ];
        }

        // Send command
        Falcon_Amqp::sendTo('mon.device', 'command.create', $commandData);

        return $answer;
    }
}