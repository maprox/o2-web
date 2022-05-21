<?php

/**
 * Class for working with devices
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Device extends Falcon_Action_Abstract
{
    /*
     * Выполняет обновление настроек портов/хостов трекеров
     * @param {stdClass} $data
     * return Falcon_Message
     */
    public static function configure($data)
    {
        $answer = new Falcon_Message();

        // ID check
        if (!isset($data->id)) {
            return $answer->error(4042);
        }

        $device = new Falcon_Model_Device($data->id);
        $answer->append($device->setFields($data));
        $answer->append(Falcon_Action_Device_Configure::sms($device));

        if ($answer->isSuccess()) {
            Falcon_Action_Device_Configure::setStatus($device,
                Falcon_Action_Device_Configure::STATUS_SMS_SENT);
        }

        return $answer;
    }

    /*
     * Сохраняет полученные настройки в mon_device_settings
     * @param {Falcon_Model_Device} $device
     * @param {Integer} $idProtocol
     * @param {String[]} $config
     */
    public static function setSettings($device, $config, $idProtocol = 0)
    {
        $record = $device->getRecord();
        $answer = new Falcon_Message_Pipe();
        $db = Zend_Db_Table::getDefaultAdapter();
        $db->beginTransaction();
        try {
            foreach ($config as $type => $values) {
                if ($type == 'sos_phone') {
                    $values = explode(',', $values);
                    $values = array_filter($values);
                } else {
                    $values = [$values];
                }

                foreach ($values as $value) {
                    $record->setOption($type, $value, $idProtocol);
                }
            }

            $answer->setSuccess(true);
            $db->commit();
        } catch (Zend_Db_Exception $e) {
            Falcon_Logger::getInstance()->log('tracker',
                'settings_set_failure', $e);
            $answer->setSuccess(false);
            $db->rollBack();
        }

        return $answer;
    }

    /*
     * Формирует команду на чтение настроек
     * @param {Falcon_Model_Device} $device
     * @param {Falcon_Record_Mon_Device_Action} $action
     * @param {Falcon_Message_Pipe} $answer
     */
    public static function readSettings(Falcon_Model_Device $device,
                                        Falcon_Record_Mon_Device_Action $action, Falcon_Message_Pipe $answer)
    {
        $action->set('edt', $action->dbDate())->update();
        $answer->addCommand('read');
    }

    /*
     * Формирует команду на установку настройки
     * @param {Falcon_Model_Device} $device
     * @param {Falcon_Record_Mon_Device_Action} $action
     * @param {Falcon_Message_Pipe} $answer
     */
    public static function setOption(Falcon_Model_Device $device,
                                     Falcon_Record_Mon_Device_Action $action, Falcon_Message_Pipe $answer)
    {
        $action->set('edt', $action->dbDate())->update();

        $option = $action->getValue('option');
        $value = $action->getValue('value');

        $answer->addCommand('set', [$option => $value]);
    }

    /*
     * Sends the specified command to the tracker
     * @param {Falcon_Model_Device} $device
     * @param {Falcon_Record_Mon_Device_Action} $action
     * @param {Falcon_Message_Pipe} $answer
     */
    public static function execute(Falcon_Model_Device $device,
                                   Falcon_Record_Mon_Device_Action $action, Falcon_Message_Pipe $answer)
    {
        $action->set('edt', $action->dbDate())->update();
        $answer->addCommand('execute', [
            'command' => $action->get('value')]);
    }
}
