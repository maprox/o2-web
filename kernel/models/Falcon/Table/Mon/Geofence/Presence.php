<?php

/**
 * Table "mon_geofence_presence"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Geofence_Presence extends Falcon_Table_Common
{
    /**
     * Checks which devices are present in geofence
     * @param Integer $geofenceId Geofence id
     * @param Array $devices Array of devices id
     */
    public function devicesInside($geofenceId, $devices = [])
    {
        $db = $this->_db;
        if (!is_array($geofenceId)) {
            $geofenceId = [$geofenceId];
        }

        $query = $db
            ->select()
            ->from(['p' => 'mon_geofence_presence'])
            ->where('p.id_geofence IN (?)', $geofenceId)
            ->where('p.id_device IN (?)', $devices)
            ->where('p.state = 1')
            ->where('not exists (select * from mon_geofence_presence p2
				where p2.id_geofence = p.id_geofence
				  and p2.id_device = p.id_device
				  and p2.sdt > p.sdt)');
        $rows = $db->query($query);
        $result = $rows->fetchAll();
        //echo $query->assemble();
        return $result;
    }
}