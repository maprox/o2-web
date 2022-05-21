<?php

/**
 * Class of "mon_waylist" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Waylist extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $joinedFn = function ($sql) use ($queryFn) {
            call_user_func($queryFn, $sql);

            $joinWaylistCondition = 'mon_waylist_route.id_waylist = t.id' .
                ' and t.status = ' . Falcon_Record_Mon_Waylist::STATUS_CLOSED .
                ' and mon_waylist_route.enter_dt is null';

            $sql->joinLeft('mon_waylist_route', $joinWaylistCondition, [
                '(mon_waylist_route.id is not null) as failed']);
        };

        return parent::loadBy($joinedFn, $queryParams, $addLinkedJoined, $addLinked);
    }

    /**
     * Loads all active waylists for device
     * @param integer $idDevice
     * @param bool $activeOnly
     * @return {Falcon_Record_Mon_Waylist[]}
     */
    public function loadByDevice($idDevice, $activeOnly = false)
    {
        $lists = $this->loadBy(function ($sql) use ($idDevice, $activeOnly) {
            $sql->join('mon_vehicle', 'mon_vehicle.id = t.id_vehicle', []);
            $sql->where('id_device = ?', $idDevice);
            $sql->where('t.state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            if ($activeOnly) {
                $sql->where('t."status" = ?',
                    Falcon_Record_Mon_Waylist::STATUS_STARTED);
            }
        });

        foreach ($lists as &$list) {
            $list = $this->newRecord($list);
        }

        return $lists;
    }

    /**
     * Calculates distance based on routes
     * @param {Integer} $id
     * @return {Float}
     */
    public function calculateDistance($id)
    {
        return $this->getTable()->calculateDistance($id);
    }

    /**
     * Updates waylist statuses
     */
    public function updateStatuses()
    {
        $waylists = $this->load([
            'status = ?' => Falcon_Record_Mon_Waylist::STATUS_CREATED,
            'sdt < current_timestamp' => null,
            'edt > current_timestamp' => null
        ]);

        $affected = [];
        foreach ($waylists as $waylist) {
            $affected[] = $waylist->get('id_firm');
            $waylist->set('status', Falcon_Record_Mon_Waylist::STATUS_STARTED);
            $waylist->update();
        }

        $affected = array_unique($affected);

        foreach ($affected as $firm) {
            Falcon_Action_Update::addToFirm(
                ['alias' => 'mon_device'],
                $firm
            );
        }
    }
}