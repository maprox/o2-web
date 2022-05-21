<?php

/**
 * Table "mon_geofence_presence" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Geofence_Presence extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_geofence',
        'id_device',
        'sdt',
        'state'
    ];
}
