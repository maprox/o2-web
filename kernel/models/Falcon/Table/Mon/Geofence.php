<?php

/**
 * Table "mon_geofence"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Geofence extends Falcon_Table_Common
{
    public function getPrevPresencesForDevice($ids, $device, $time)
    {
        $query = 'select id_geofence, state, id from mon_geofence_presence where id in(
			select distinct on (id_geofence) id
			from mon_geofence_presence
			where
				id_device = ?
				and id_geofence in (' . implode(',', $ids) . ')
				and sdt <= ?
			order by id_geofence, sdt desc)';

        return $this->query($query, [$device, $time]);
    }

    public function getNextPresencesForDevice($ids, $device, $time)
    {
        $query = 'select id_geofence, state, id from mon_geofence_presence where id in(
			select distinct on (id_geofence) id
			from mon_geofence_presence
			where
				id_device = ?
				and id_geofence in (' . implode(',', $ids) . ')
				and sdt > ?
			order by id_geofence, sdt asc)';

        return $this->query($query, [$device, $time]);
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
        $logger = Falcon_Logger::getInstance();
        $query = "select g.* from mon_geofence g"
            . " where g.id IN (" . implode(',', $zones) . ")"
            . " and g.max_lat IS NOT NULL"
            . " and
				not exists(
					select * from mon_geofence_presence mgp
					where mgp.id_geofence = g.id
					and mgp.id_device = " . $deviceId
            . " and mgp.sdt <= '" . $sdt . "'"
            . " and mgp.sdt != '2000-01-01 00:00:00'
				)";

        //$logger->log('zend', $query);
        return $this->query($query);
    }
}