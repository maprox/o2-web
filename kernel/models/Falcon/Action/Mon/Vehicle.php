<?php

/**
 * Vehicle rest action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012-2013, Maprox LLC
 */
class Falcon_Action_Mon_Vehicle extends Falcon_Action_Rest_Common
{
    /**
     * Processes read records before giving them away
     * @param {Mixed[]} $records
     */
    protected function processRecords($records)
    {
        $vehicles = parent::processRecords($records);
        if (empty($vehicles)) {
            return $vehicles;
        }

        $user = Falcon_Model_User::getInstance();
        if (!$user->hasRight('mon_vehicle_driver')) {
            return $vehicles;
        }

        // get current drivers for all of vehicles
        // let's get vehicles' identifiers
        $ids = [];
        foreach ($vehicles as $record) {
            $ids[] = $record['id'];
        }

        $m = Falcon_Mapper_Mon_Vehicle_Driver::getInstance();
        $drivers = $m->loadBy(function ($sql) use ($ids) {
            $sql
                ->where('id_vehicle in (?)', $ids)
                ->where('sdt < current_timestamp')
                ->where('edt is null or edt > current_timestamp')
                ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
        });

        $driversTree = [];
        foreach ($drivers as $record) {
            $vehicleId = $record['id_vehicle'];
            if (!isset($driversTree[$vehicleId])) {
                $driversTree[$vehicleId] = [];
            }
            $driversTree[$vehicleId][] = $record;
        }

        foreach ($vehicles as &$record) {
            $vehicleId = $record['id'];
            if (isset($driversTree[$vehicleId])) {
                $record['drivers'] = $driversTree[$vehicleId];
            } else {
                $record['drivers'] = [];
            }
        }

        return $vehicles;
    }

}
