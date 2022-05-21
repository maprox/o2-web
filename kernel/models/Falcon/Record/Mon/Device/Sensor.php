<?php

/**
 * Table "mon_device_sensor" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Sensor extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Updatable
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'param',
        'name',
        'id_prop',
        'convert',
        'smoothing',
        'manual',
        'val',
        'val_max',
        'val_min',
        'state',
        'display',
        'unit',
        'precision'
    ];

    public static $parentFieldLink = 'id_device';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_device_sensor_conversion',
            'alias' => 'conversion',
            'fields' => ['*']
        ]
    ];
}
