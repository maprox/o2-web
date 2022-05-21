<?php

/**
 * Table "mon_device_command_type_param" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command_Type_Param extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device_command_type',
        'name',
        'description',
        'info',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');


    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_device_command_type';
}
