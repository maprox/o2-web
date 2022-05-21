<?php

/**
 * Table "mon_geofence_coord"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Geofence_Coord extends Falcon_Table_Common
{
    /**
     * SQL requests
     * @var array
     */
    private $sql = [
        'clear' => 'delete from mon_geofence_coord where id_geofence = ?',
        'update' => 'select mon_geofence_cache_update(?)'
    ];

    /**
     * Udates coordinates for specified geofence
     * @param int $geofenceId
     * @param array $coordinates
     */
    public function updateByGeofenceId($geofenceId, $coordinates)
    {
        if ($coordinates && is_array($coordinates)) {
            $num = 1;
            $this->query($this->sql['clear'], $geofenceId);
            foreach ($coordinates as $coordinate) {
                $this->insert([
                    'id_geofence' => $geofenceId,
                    'num' => $num++,
                    'latitude' => $coordinate->latitude,
                    'longitude' => $coordinate->longitude
                ]);
            }
            $this->query($this->sql['update'], $geofenceId);
        }
    }
}