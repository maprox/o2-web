<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 */
class Falcon_Action_Rest_Group extends Falcon_Action_Rest_Common
{
    /**
     * Group items ids before update
     * @var type
     */
    protected $itemsBeforeUpdate;

    /**
     * Returns ids of group items
     * @param integer $groupId
     * @return Array $ids
     */
    protected function getGroupItemsIds($groupId)
    {
        $m = Falcon_Mapper_X_Group_Item_Link::getInstance();
        $items = $m->loadBy(function ($sql) use ($groupId) {
            $sql->where('id_group = ?', $groupId);
        });

        $ids = [];
        foreach ($items as $item) {
            $ids[] = $item['id_item'];
        }

        return $ids;
    }

    /**
     * Returns entity name for group item
     * @return string
     */
    protected function getItemEntityName()
    {
        return str_replace(
            'x_group_', '', strtolower($this->getEntityName())
        );
    }

    /**
     * Actions to perform before updating instance
     * @param Falcon_Record_Abstract $c
     * @return boolean
     */
    protected function onBeforeUpdate($c)
    {
        parent::onBeforeUpdate($c);
        $params = $this->getParams();

        $this->itemsBeforeUpdate = $this->getGroupItemsIds($c->getId());

        if (isset($params['$accessGroupGrant'])) {
            $grant = json_decode($params['$accessGroupGrant'], true);
            if (!empty($grant)) {
                $this->accessGroupGrant($c, $grant);
                $this->accessActions[] = 'groupgrant';
            }
        }

        if (isset($params['$accessGroupRevoke'])) {
            $revoke = json_decode($params['$accessGroupRevoke'], true);
            if (!empty($revoke)) {
                $this->accessGroupRevoke($c, $revoke);
                $this->accessActions[] = 'grouprevoke';
            }
        }

        return true;
    }

    /**
     * Actions to perform after updating instance
     * @param Falcon_Record_Abstract $c
     * @return boolean
     */
    protected function onAfterUpdate($c)
    {
        parent::onAfterUpdate($c);
        $params = $this->getParams();

        // If state has been changed somehow
        // Let's write all items updates for all users
        if (isset($params['state'])) {
            // Write updates
            $this->writeAllItemsUpdates($c);
        }

        // If group items changed
        if (!isset($params['items_removed'])) {
            return true;
        }
        if (!isset($params['items_added'])) {
            return true;
        }

        $changed = array_merge(
            json_decode($params['items_removed'], true),
            json_decode($params['items_added'], true)
        );

        // Write update table for each user have access to the group
        $table = new Falcon_Table_X_Access();
        foreach ($table->getUsersByObject($c) as $userId) {
            foreach ($changed as $changedId) {
                Falcon_Action_Update::add([
                    'alias' => $this->getItemEntityName(),
                    'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                    'id_entity' => $changedId,
                    'id_user' => $userId
                ]);
            }
            // If update was not written as a part of instanceUpdate function
            // (because of not changing any actual fields of x_group_table, for example)
            // We will write update manually for these users
            if (!$c->getChangesForUpdate()) {
                Falcon_Action_Update::add([
                    'alias' => strtolower($this->getEntityName()),
                    'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                    'id_entity' => $c->getId(),
                    'id_user' => $userId
                ]);
            }
        }

        return true;
    }

    /**
     * Actions to perform before creating instance
     * @param Falcon_Record_Abstract $c
     * @return boolean
     */
    protected function onBeforeCreate($c)
    {
        parent::onBeforeCreate($c);
        // Set creator id
        $c->set('id_creator', $this->getUserId());
        return true;
    }

    /**
     * Grants access on given group
     * @param Falcon_Record_Abstract $c
     * @param type $grant
     */
    protected function accessGroupGrant($c, $grant)
    {
        // Grant access
        $this->accessGrant($c, $grant);

        // Add updates entries
        $this->writeAccessUpdates($grant, $this->itemsBeforeUpdate);
    }

    /**
     * Revokes access on given group
     * @param Falcon_Record_Abstract $c
     * @param type $revoke
     */
    protected function accessGroupRevoke($c, $revoke)
    {
        // Revoke access
        $this->accessRevoke($c, $revoke);

        // Add updates entries
        $this->writeAccessUpdates($revoke, $this->itemsBeforeUpdate);
    }

    /**
     * For each access entry writes updates entries for each item
     * @param Falcon_Record_Abstract $access
     * @param type $items
     */
    protected function writeAccessUpdates($access, $items)
    {
        $alias = str_replace(
            'x_group_', '', strtolower($this->getEntityName())
        );

        // Add updates entries
        foreach ($access as $accessItem) {
            foreach ($items as $id) {
                Falcon_Action_Update::add([
                    'alias' => $alias,
                    'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                    'id_entity' => $id,
                    'id_user' => $accessItem['id_user'],
                ]);
            }
        }
    }

    /**
     * Writes updates for all users and all group items
     * @param Falcon_Record_Abstract $c
     */
    protected function writeAllItemsUpdates($c)
    {
        $table = new Falcon_Table_X_Access();
        foreach ($table->getUsersByObject($c) as $userId) {
            foreach ($this->getGroupItemsIds($c->getId()) as $itemId) {
                Falcon_Action_Update::add([
                    'alias' => $this->getItemEntityName(),
                    'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                    'id_entity' => $itemId,
                    'id_user' => $userId
                ]);
            }
        }
    }

    /**
     * Actions to perform after deleting instance
     * @param Falcon_Record_Abstract $c
     * @return bool
     */
    protected function onAfterDelete($c)
    {
        parent::onAfterDelete($c);

        // Write updates
        $this->writeAllItemsUpdates($c);

        return true;
    }

    /**
     * Actions to perform before getting list of instance
     * @return bool
     */
    protected function onBeforeGetList()
    {
        parent::onBeforeGetList();

        $this->excludeStates = [
            Falcon_Record_Abstract::STATE_DELETED
        ];

        // Hide inactive groups if user don't have write right
        if (!$this->getAccessHelper()->checkGlobalWrite()) {
            $this->excludeStates[] =
                Falcon_Record_Abstract::STATE_INACTIVE;
        }

        return true;
    }
}