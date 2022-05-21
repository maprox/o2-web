<?php

/**
 * Class of "mon_geofence_coord" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Geofence_Coord extends Falcon_Mapper_Common
{
    /**
     * Udates coordinates for specified geofence
     * @param int $geofenceId
     * @param array $coordinates
     */
    public function updateByGeofenceId($geofenceId, $coordinates)
    {
        $this->getTable()->updateByGeofenceId($geofenceId, $coordinates);
    }
}