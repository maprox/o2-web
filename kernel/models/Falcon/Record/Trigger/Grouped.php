<?php

/**
 * Grouped record trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Grouped extends Falcon_Record_Trigger_Abstract
{
    /**
     * If defined, overrides class name in curator name
     * @var String
     */
    protected $alias = false;

    /**
     * What access actions should be checked
     * If access has been removed complitely
     * @var type
     */
    protected $checkAccessActions = [];

    /**
     * Add access actions
     */
    public function addAccessActions($actions)
    {
        $this->checkAccessActions[] = $actions;
    }

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doAfterTrash($record)
    {
        $this->removeFromGroups($record);
    }

    protected function doAfterUpdate($record)
    {
        $logger = Falcon_Logger::getInstance();
        $mxa = Falcon_Mapper_X_Access::getInstance();
        $mxu = Falcon_Mapper_X_User::getInstance();
        $groupTableName = 'x_group_' . $record->getTableName();
        $id = $record->getId();
        if (!empty($this->checkAccessActions)) {
            foreach ($this->checkAccessActions as $action) {
                foreach ($action as $item) {
                    $accessRecord = new Falcon_Record_X_Access($item['id']);
                    $idFirm = $accessRecord->get('id_firm');

                    // Get firm users with right x_group_table_name
                    $users = $mxu->getFirmUsersByRight(
                        $idFirm,
                        $groupTableName,
                        Falcon_Access_Abstract::ACCESS_WRITE
                    );

                    $usersIds = [];
                    foreach ($users as $user) {
                        $usersIds[] = $user['id'];
                    }

                    // Check if firm finally lost access
                    // If so remove grouped item from all firm's groups

                    // Check for firm
                    $firmShare
                        = $mxa->loadBy(function ($sql) use ($idFirm, $record) {
                        $sql->where('id_object = ?', $record->getId())
                            ->where('"right" = ?', $record->getTableName())
                            ->where('id_firm = ?', $idFirm)
                            ->where('sdt <= current_timestamp')
                            ->where('edt > current_timestamp OR edt IS NULL')
                            ->where('status = ?',
                                Falcon_Record_X_Access::STATUS_ACTIVE)
                            ->where('writeable = ?', 1);
                    });

                    if (!empty($firmShare)) {
                        continue;
                    }

                    if (!empty($usersIds)) {
                        // Check for users
                        $usersShare
                            = $mxa->loadBy(function ($sql) use (
                            $idFirm, $record,
                            $usersIds
                        ) {
                            $sql->where('id_object = ?', $record->getId())
                                ->where('"right" = ?', $record->getTableName())
                                ->where('id_user IN (?)', $usersIds)
                                ->where('sdt <= current_timestamp')
                                ->where(
                                    'edt > current_timestamp OR edt IS NULL'
                                )
                                ->where('status = ?',
                                    Falcon_Record_X_Access::STATUS_ACTIVE)
                                ->where('writeable = ?', 1);
                        });

                        if (!empty($usersShare)) {
                            continue;
                        }
                    }

                    $this->removeFromGroups($record, $idFirm);
                }
            }
        }
    }

    /**
     * Removes record from all groups
     * @param type $record
     * @param type $firmId
     */
    protected function removeFromGroups($record, $firmId = null)
    {
        $logger = Falcon_Logger::getInstance();
        $groupTableName = 'x_group_' . $record->getTableName();
        // Get all groups that have given device
        $mapperName = 'Falcon_Mapper_' . ucwords_custom($groupTableName);
        $recordName = 'Falcon_Record_' . ucwords_custom($groupTableName);
        $m = $mapperName::getInstance();
        $groups = $m->getGroupsForItem($record->getId(), $firmId);

        $table = new Falcon_Table_X_Group_Item_Link();
        if (!empty($groups)) {
            $table->removeItemFromGroups($record->getId(), $groups);

            // Write updates
            foreach ($groups as $groupId) {
                $group = new $recordName($groupId);
                $groupUsers = $m->getUsersByObject($group);
                foreach ($groupUsers as $userId) {
                    Falcon_Action_Update::add([
                        'id_user' => $userId,
                        'alias' => $groupTableName,
                        'id_entity' => $groupId,
                        'id_operation'
                        => Falcon_Record_X_History::OPERATION_EDIT
                    ]);
                }
            }
        }

    }
}