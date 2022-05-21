<?php

/**
 * Class for working with right levels
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Right_Level extends Falcon_Action_Rest_Common
{
    /**
     * Actions to perform after creating instance
     * @param type $c
     */
    protected function onAfterCreate($c)
    {
        // Create right
        $r = new Falcon_Record_X_Right([
            'name' => 'Can assign right level ' . $c->get('name'),
            'alias' => 'can_assign_' . $c->get('name')
        ]);

        $r->insert();

        // link right level
        $c->set('id_right', $r->get('id'));
        $c->update();


        // Add entry to x_history
        $history = new Falcon_Record_X_History([
            'id_operation'
            => Falcon_Record_X_History::OPERATION_CREATE,
            'entity_table' => 'x_right',
            'id_entity' => $r->get('id')
        ]);
        $history->insert();

        $user = Falcon_Model_User::getInstance();
        // Add entry to updates for current user
        Falcon_Action_Update::add([
            'alias' => 'x_right',
            'id_user' => $user->getId()
        ]);
    }

    /**
     * Actions to perform after deleting instance
     * @param type $c
     */
    protected function onAfterDelete($c)
    {
        $user = Falcon_Model_User::getInstance();
        Falcon_Action_Update::add([
            'alias' => 'x_right',
            'id_user' => $user->getId()
        ]);
        return true;
    }

    /**
     * On state update
     * @param type $c
     * @param type $param
     */
    protected function onUpdateState($c, $param)
    {
        $user = Falcon_Model_User::getInstance();
        Falcon_Action_Update::add([
            'alias' => 'x_right',
            'id_user' => $user->getId()
        ]);
    }
}
