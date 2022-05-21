<?php

/**
 * Table "mon_device_protocol_sensor_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Protocol_Sensor_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_protocol',
        'id_sensor'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_protocol', 'id_sensor'];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_protocol';

    /**
     * TODO: COMMENT THIS!
     * @var type
     */
    public static $foreignKeys = [
        'id_sensor' => [
            // access mapper config
            'mon_sensor' => 'id',
            // joined view config
            'fields' => [
                '*',
                //'name'
            ]
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

}
