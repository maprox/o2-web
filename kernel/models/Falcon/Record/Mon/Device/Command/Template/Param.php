<?php

/**
 * Table "mon_device_command_template_param" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 * @deprecated
 */
class Falcon_Record_Mon_Device_Command_Template_Param extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device_command_template',
        'id_device_command_type_param',
        'value'
    ];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_device_command_type_param' => [
            'mon_device_command_type_param' => 'id',
            'fields' => [
                'name' => 'name'
            ]
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

    public static $parentFieldLink = 'id_device_command_template';
}
