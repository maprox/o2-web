<?php

/**
 * Table "mon_device_command_template" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command_Template extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'name',
        'id_command_type',
        'transport',
        'params',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Use another entity for access check
     * $checkAccessField should be specified
     * @var String
     */
    public static $checkAccessAlias = 'mon_device';

    /**
     * Field of record contains reference on another record
     * @var String
     */
    public static $checkAccessField = 'id_device';

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_command_type' => [
            // access mapper config
            'mon_device_command_type' => 'id',
            'fields' => [
                'name'
            ]
        ]
    ];
}
