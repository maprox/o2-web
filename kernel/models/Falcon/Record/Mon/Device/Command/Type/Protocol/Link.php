<?php

/**
 * Table "mon_device_command_type_protocol_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command_Type_Protocol_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_mon_device_command_type',
        'id_mon_device_protocol'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');


    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_mon_device_command_type',
        'id_mon_device_protocol'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_mon_device_command_type';
}
