<?php

/**
 * Class for working with devices
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Action_Device_Configure extends Falcon_Action_Abstract
{
    // Device configuration statuses
    const
        STATUS_SMS_SENT = 1,
        STATUS_SMS_RECIEVED = 2,
        STATUS_SMS_FAILED = 3,
        STATUS_PACKET_RECIEVED = 4,
        STATUS_PACKET_FAILED = 5;

    /**
     * Создает задачу по конфигурированию через смс
     * @param {Falcon_Record_Mon_Device} $device
     * return Falcon_Message
     */
    public static function start($device)
    {
        //$logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');
        $answer = new Falcon_Message();

        $data = $device->toArray();

        // Get protocol alias
        $protocol = new Falcon_Record_Mon_Device_Protocol($data['protocol']);
        $alias = $protocol->get('alias');
        if (!$alias) {
            return $answer->error(4042, 'Incorrect device protocol');
        }

        // Get settings
        $settings = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
            'id_device = ?' => $data['id'],
            'id_protocol = ?' => $data['protocol']
        ], true);

        // Get current protocol settings
        if (empty($settings)) {
            return $answer->error(4042, 'No device settings');
        }

        $phone = ''; // Phone
        $apn = ''; // Apn
        $login = ''; // Username (login)
        $password = ''; // Password
        $identifier = ''; // Identifier

        foreach ($settings as $setting) {
            switch ($setting['option']) {
                case 'phone':
                    $phone = $setting['value'];
                    break;
                case 'apn':
                    $apn = $setting['value'];
                    break;
                case 'login':
                    $login = $setting['value'];
                    break;
                case 'password':
                    $password = $setting['value'];
                    break;
                case 'identifier':
                    $identifier = $setting['value'];
                    break;
                default:
                    break;
            }
        }

        if (empty($phone)) {
            return $answer->error(4042, 'Incorrect device phone');
        }

        if (empty($identifier)) {
            return $answer->error(4042, 'Incorrect device identifier');
        }

        // Get apn, login and password
        $newSettings = json_decode($data['settings'], true);
        if (isset($newSettings[$alias])) {
            if (isset($newSettings[$alias]['apn'])) {
                $apn = $newSettings[$alias]['apn'];
            }
            if (isset($newSettings[$alias]['login'])) {
                $login = $newSettings[$alias]['login'];
            }
            if (isset($newSettings[$alias]['password'])) {
                $password = $newSettings[$alias]['password'];
            }
        }

        // Let's create a request to the pipe-server
        $sendFrom = Falcon_Util_Phone::normalize($config->sms->serverPhone);
        $commandData = [
            'uid' => $identifier,
            'command' => 'configure',
            'transport' => 'sms',
            'config' => [
                'from' => $sendFrom,
                'address' => $phone,
                'id_object' => $data['id'],
                'id_firm' => $data['id_firm']
            ],
            'params' => [
                'identifier' => $identifier,
                'gprs' => [
                    'apn' => $apn,
                    'username' => $login,
                    'password' => $password
                ]
            ]
        ];
        Falcon_Amqp::sendTo('mon.device', 'command.create', $commandData);

        Falcon_Action_Device_Configure::setStatus($device,
            Falcon_Action_Device_Configure::STATUS_SMS_SENT);

        return $answer;
    }

    /**
     * Start configuration task for sim card data
     * @param type $data
     */
    public static function startSim($data)
    {
        //$logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');
        $answer = new Falcon_Message();

        // Get protocol alias
        $protocol = new Falcon_Record_Mon_Device_Protocol($data['protocol']);
        $alias = $protocol->get('alias');
        if (!$alias) {
            return $answer->error(4042, 'Incorrect device protocol');
        }

        // Let's create a request to the pipe-server
        $sendFrom = Falcon_Util_Phone::normalize($config->sms->serverPhone);
        $commandData = [
            'uid' => $data['identifier'],
            'command' => 'configure',
            'transport' => 'sms',
            'config' => [
                'from' => $sendFrom,
                'address' => $data['phone'],
                'id_protocol' => $data['protocol']
            ],
            'params' => [
                'identifier' => $data['identifier'],
                'gprs' => [
                    'apn' => $data['apn'],
                    'username' => $data['login'],
                    'password' => $data['password']
                ]
            ]
        ];
        Falcon_Amqp::sendTo('mon.device', 'command.create', $commandData);

        return $answer;
    }

    /**
     * Устанавливает статус настроек устройства
     * @param {Falcon_Record_Mon_Device} $device
     * @param {Integer} $status
     * @param {Boolean} $doNotUpdate
     */

    public static function setStatus(/*Falcon_Model_Device*/
        $device,
        $status, $doNotUpdate = false)
    {
        // TEMP FIX
        if ($device instanceof Falcon_Model_Device) {
            $record = $device->getRecord();
        } else {
            $record = $device;
        }

        $record->setProps([
            'configured' => $status,
            'last_configured_change' => $record->dbDate()
        ]);

        if (!$doNotUpdate) {
            $record->update();
        }
    }
}
