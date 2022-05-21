<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Packet extends Falcon_Action_Rest_Common
{
    /**
     * If given, limits number of records in list, despite user requests
     * @var Integer
     */
    protected $upperLimit = 1000;

    /*
    * Возвращает переведенный массив свойств объекта packet
    * return Falcon_Message
    */
    public static function getProps()
    {
        $t = Zend_Registry::get('translator');
        $packet = new Falcon_Record_Mon_Packet();
        $answer = $packet->getProps();
        foreach ($answer as $id => $record) {
            // Запоминаем имя поля, которое будет в JS
            $record['field'] = strtolower($record['name']);
            $record['name'] = $t['zt']->translate($record['name']);
            $answer[$id] = $record;
        }
        return $answer;
    }

    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeCreate($c)
    {
        if (!parent::onBeforeCreate($c)) {
            return false;
        }

        $params = $this->getParams();

        if (!isset($params['id_device'])) {
            return false;
        }

        $idDevice = $params['id_device'];

        // Check device access
        Falcon_Access::checkWrite('mon_device', $idDevice);
    }

    /**
     * Actions to perform after creating instance
     * @param type $c
     */
    protected function onAfterCreate($c)
    {
        parent::onAfterCreate($c);

        // Create updates
        $device = new Falcon_Record_Mon_Device($c->get('id_device'));
        $table = new Falcon_Table_X_Access();
        $users = $table->getUsersByObject($device);

        Falcon_Action_Update::add([
            'alias' => $c->getTableName(),
            'id_operation' => Falcon_Record_X_History::OPERATION_CREATE,
            'id_entity' => $c->getId(),
            'id_user' => $users
        ]);
    }
}
