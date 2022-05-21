<?php

/**
 * Table "mon_device_sensor_convertion" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Sensor_Conversion extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Multiple
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_sensor',
        'x',
        'y'
    ];

    public static $parentFieldLink = 'id_sensor';
}
