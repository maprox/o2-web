<?php

/**
 * Table "mon_device_command_type_transport_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command_Type_Transport_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_mon_device_command_type',
        'id_transport'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_mon_device_command_type',
        'id_transport'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_mon_device_command_type';

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

    /**
     * TODO: COMMENT THIS!
     * @var type
     */
    public static $foreignKeys = [
        'id_transport' => [
            // access mapper config
            'x_transport' => 'id',
            // joined view config
            'fields' => [
                '*',
            ]
        ]
    ];
}
