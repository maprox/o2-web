<?php

/**
 * Action "mon_device_sensor_history_setting"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Device_Sensor_History_Setting extends Falcon_Action_Rest_Common
{
    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryListSql($sql, $data)
    {
        $this->applyUserRestriction($sql);
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryItemSql($sql, $data)
    {
        $this->applyUserRestriction($sql);
    }

    /**
     * Applies user restriction to query
     * @param type $sql
     */
    protected function applyUserRestriction($sql)
    {
        $user = Falcon_Model_User::getInstance();
        $userId = $user->getId();
        $sql->where('t.id_user =?', $userId);
    }

    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeCreate($c)
    {
        parent::onBeforeCreate($c);
        $user = Falcon_Model_User::getInstance();
        $c->set('id_user', $user->getId());

        return true;
    }

    /**
     * Actions to perform after creating instance
     * @param type $c
     */
    protected function onAfterCreate($c)
    {
        parent::onAfterCreate($c);

        $this->writeUserUpdate($c);
    }

    /**
     * Actions to perform after updating instance
     * @param type $c
     */
    protected function onAfterUpdate($c)
    {
        parent::onAfterUpdate($c);

        $this->writeUserUpdate($c);
    }

    /**
     * Write updates for current user
     * @param type $c
     */
    protected function writeUserUpdate($c)
    {
        Falcon_Action_Update::add([
            'alias' => 'mon_device_sensor_history_setting',
            'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
            'id_entity' => $c->getId(),
            'id_user' => $c->get('id_user')
        ]);
    }
}
