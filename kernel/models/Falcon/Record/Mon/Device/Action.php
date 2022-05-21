<?php

/**
 * Table "mon_device_action" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Action extends Falcon_Record_Abstract
{
    const
        SET_SETTING = 'setOption',
        READ_SETTINGS = 'readSettings',
        EXECUTE = 'execute',
        PROCESS_SMS = 'processSms',
        FORMAT = 'format';

    /**
     * Actions that should be cent to controller
     * @var String[]
     */
    protected static $controllerActions = [
        self::FORMAT,
        self::PROCESS_SMS
    ];

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'id_protocol',
        'action',
        'value',
        'sdt',
        'edt',
        'state',
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {

        $this->set('sdt', $this->dbDate());
        $this->set('state', Falcon_Record_Abstract::STATE_ACTIVE);

        $value = $this->get('value');
        if (!empty($value)) {
            $this->set('value', json_encode($value));
        }

        $return = parent::insert();
        $this->updateCache();

        return $return;
    }

    /**
     * Remove record from the table
     * @return Falcon_Record_Abstract
     */
    public function delete()
    {
        $return = parent::delete();
        $this->updateCache();
        return $return;
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $return = parent::update();
        $this->updateCache();
        return $return;
    }

    /**
     * Returns array of controller actions
     * @return String[]
     */
    public static function getControllerActions()
    {
        return self::$controllerActions;
    }

    /**
     * Updates shared cache
     */
    protected function updateCache()
    {
        $this->getMapper()->writeSharedCache($this->get('id_device'));
        if (in_array($this->get('action'), self::getControllerActions())) {
            $this->getMapper()->writeControllerCache();
        }
    }

    /**
     * Sets action result and edt
     */
    public function finalize($data = false)
    {
        $logger = Falcon_Logger::getInstance();
        $success = true;
        if ($this->get('action') == self::SET_SETTING) {
            foreach ($this->getValues() as $item) {
                $correct = Falcon_Mapper_Mon_Device_Setting::getInstance()
                    ->getCount([
                        'option = ?' => $item['option'],
                        'value = ?' => (string)$item['value'],
                        'id_device = ?' => $this->get('id_device'),
                    ]);
                if (empty($correct)) {
                    $success = false;
                    break;
                }
            }
        }
        /*
        if ($this->get('action') == self::FORMAT) {
            if ($this->get('id_device')) {
                Falcon_Action_Device_Configure::send(
                    $this->get('id_device'), $data);
            } else {
                // Configuring by sim card data
                // No actual device exists
                Falcon_Action_Device_Configure::sendSim(
                    json_decode($this->get('value'), true), $data);
            }
        }
        */

        $this->set('edt', $this->dbDate());
        $this->set('state', $success ?
            self::STATE_DELETED :
            self::STATE_INCORRECT);
        $this->update();
    }

    /**
     * Returns value part by name
     * @param {String} $name
     * @return Mixed
     */
    public function getValues()
    {
        return $this->get('value') ?
            json_decode($this->get('value'), true) : [];
    }
}
