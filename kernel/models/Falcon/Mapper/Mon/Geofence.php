<?php

/**
 * Class of "mon_geofence" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Geofence extends Falcon_Mapper_Common
{
    /**
     * Returns devices ids that inside geofence
     * @param integer geofenceId
     * @return type
     */
    protected function devicesInside($geofenceId)
    {
        $devices = Falcon_Mapper_Mon_Device::getInstance()
            ->loadByAccess(['fields' => ['id', 'state']]);
        $devicesIds = [];
        foreach ($devices as $device) {
            if ($device['state'] != Falcon_Record_Abstract::STATE_ACTIVE) {
                continue;
            }
            $devicesIds[] = $device['id'];
        }

        // if no devices specified
        if (empty($devicesIds)) {
            return [];
        }

        $m = Falcon_Mapper_Mon_Geofence_Presence::getInstance();
        $t = $m->getTable();

        $result = [];
        $devicesInside = $t->devicesInside($geofenceId, $devicesIds);
        foreach ($devicesInside as $device) {
            if (!isset($result[$device['id_geofence']])) {
                $result[$device['id_geofence']] = [];
            }
            $result[$device['id_geofence']][] = $device['id_device'];
        }

        return $result;
    }

    /**
     * Load records by a supplied query function
     * @param function $queryFn
     * @param array $params Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $records = parent::loadBy($queryFn, $queryParams, $addLinkedJoined,
            $addLinked);

        // Get ids
        $ids = [];
        foreach ($records as $record) {
            $ids[] = $record['id'];
        }

        if (empty($ids)) {
            return $records;
        }

        // Devices inside
        $inside = [];
        if (!$this->getParam('$hideinside')) {
            $inside = $this->devicesInside($ids);
        }

        // Coords
        $coords = $this->massLoadCoordinates($ids);
        $coordMap = [];
        foreach ($coords as $coord) {
            if (!isset($coordMap[$coord['id_geofence']])) {
                $coordMap[$coord['id_geofence']] = [];
            }
            $idGeofence = $coord['id_geofence'];
            unset($coord['id_geofence']);
            $coordMap[$idGeofence][] = $coord;
        }

        foreach ($records as &$record) {
            // Devices inside
            if (!$this->getParam('$hideinside')) {
                if (isset($inside[$record['id']])) {
                    $record['inside'] = $inside[$record['id']];
                } else {
                    $record['inside'] = [];
                }
            }
            // Coords
            if (isset($coordMap[$record['id']])) {
                $record['coords'] = $coordMap[$record['id']];
            } else {
                $record['coords'] = [];
            }
        }
        return $records;
    }

    /**
     * Load coordinates of a geofence
     * @param int $geofenceId Geofence identifier
     * @return array
     */
    public function loadCoordinates($geofenceId)
    {
        $m = Falcon_Mapper_Mon_Geofence_Coord::getInstance();
        return $m->loadBy(function ($sql) use ($geofenceId) {
            $sql
                ->where('id_geofence = ?', $geofenceId)
                ->order('num');
        }, ['fields' => ['latitude', 'longitude']]);
    }

    /**
     * Load coordinates for given geofences ids
     * @param int $geofenceId Geofence identifier
     * @return array
     */
    public function massLoadCoordinates($ids)
    {
        if (!is_array($ids)) {
            $ids = [$ids];
        }
        $m = Falcon_Mapper_Mon_Geofence_Coord::getInstance();
        return $m->loadBy(function ($sql) use ($ids) {
            $sql
                ->where('id_geofence IN (?)', $ids)
                ->order('num');
        }, ['fields' => ['id_geofence', 'latitude', 'longitude']]);
    }

    /**
     * Sets the coordinates for a geofence
     * @param int $geofenceId Geofence identifier
     * @param array $coordinates
     */
    public function setCoordinates($geofenceId, $coordinates)
    {
        $m = Falcon_Mapper_Mon_Geofence_Coord::getInstance();
        $m->updateByGeofenceId($geofenceId, $coordinates);
        $record = new Falcon_Record_Mon_Geofence($geofenceId);
        $record->updateBounds();
    }

    /**
     * Check if geofence has specified point
     * @param int $geofenceId
     * @param float $latitude
     * @param float $longitude
     */
    public function hasPoint($geofenceId, $latitude, $longitude)
    {
        $result = $this->getTable()->query(
            'select mon_geofence_has_point(?, ?, ?) as code',
            [$geofenceId, $latitude, $longitude]);
        return $result[0]['code'];
    }

    /**
     * Checks if device was located in specified geofence at specified time
     * @param int $deviceId
     * @param int $geofenceId
     * @param string $time
     * @return bool
     */
    public function isDeviceInGeofence($geofenceId, $deviceId, $time = null)
    {
        return Falcon_Mapper_Mon_Geofence_Presence::getInstance()
            ->isDeviceInGeofence($geofenceId, $deviceId, $time);
    }

    public function getPrevPresencesForDevice($ids, $device, $time)
    {
        $data = $this->getTable()
            ->getPrevPresencesForDevice($ids, $device, $time);
        $return = [];
        foreach ($data as $item) {
            $return[$item['id_geofence']] = $item;
        }
        return $return;
    }

    public function getNextPresencesForDevice($ids, $device, $time)
    {
        $data = $this->getTable()
            ->getNextPresencesForDevice($ids, $device, $time);
        $return = [];
        foreach ($data as $item) {
            $return[$item['id_geofence']] = $item;
        }
        return $return;
    }

    /**
     * For what geofences for given deviceId
     * and sdt presence should be recalculated
     * @param type $deviceId
     * @param type $zones
     * @param type $sdt
     * @return type
     */
    public function needPresenceCalc($deviceId, $zones, $sdt)
    {
        return $this->getTable()->needPresenceCalc($deviceId, $zones, $sdt);
    }
}
