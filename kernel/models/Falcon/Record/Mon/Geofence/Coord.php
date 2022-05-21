<?php

/**
 * Table "mon_geofence_coord" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Geofence_Coord extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_geofence',
        'num',
        'latitude',
        'longitude'
    ];
}
