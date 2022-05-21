<?php

/**
 * Common group operations notification class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Group_Common
    extends Falcon_Notification_Abstract
{

    /**
     * Executes an action
     * @return {Falcon_Sender_Response}
     */
    public function execute()
    {
        $logger = Falcon_Logger::getInstance();

        // Get work
        $work = $this->getWork();

        // Get work params
        $params = $work->get('params');
        $params = json_decode($params, true);

        $deviceId = $params['device'];
        $groups = $params['groups'];

        // X_access table
        $accessTable = new Falcon_Table_X_Access();

        // Get device users
        $device = new Falcon_Record_Mon_Device($deviceId);
        $deviceUsers = $accessTable->getUsersByObject($device);

        $m = Falcon_Mapper_X_Group_Mon_Device::getInstance();

        // Something was modified flag
        $modified = false;
        foreach ($groups as $groupId) {
            // Get group users
            $group = new Falcon_Record_X_Group_Mon_Device($groupId);
            $groupUsers = $accessTable->getUsersByObject($group);


            if (!count($groupUsers)) {
                $logger->log('notif_group',
                    'No one could access group: ' . $groupId);
                continue;
            }

            // Add device to this group if not presents
            $r = new Falcon_Record_X_Group_Item_Link([
                'id_group' => $groupId,
                'id_item' => $deviceId
            ]);

            // Check if we could call $this->method on link record
            if ($this->checkLinkRecord($r)) {

                $method = $this->method;
                $r->$method();

                // Add access for group
                Falcon_Action_Update::add([
                    'alias' => 'x_group_mon_device',
                    'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                    'id_entity' => $groupId,
                    'id_user' => $groupUsers
                ]);

                $modified = true;
            }
        }

        if ($modified) {
            // Add update for device
            Falcon_Action_Update::add([
                'alias' => 'mon_device',
                'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                'id_entity' => $deviceId,
                'id_user' => $deviceUsers
            ]);
        }

        return new Falcon_Sender_Response();
    }
}