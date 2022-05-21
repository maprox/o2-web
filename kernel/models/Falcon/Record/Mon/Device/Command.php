<?php

/**
 * Table "mon_device_command" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command extends Falcon_Record_Abstract
{
    // State values
    const
        STATUS_SENT = 1,
        STATUS_DELIVERED = 2,
        STATUS_ERROR = 3;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'id_command_type',
        'id_transport',
        'id_command_template',
        'status',
        'dt',
        'edt', // ?
        'answer',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['guid', /*'logged',*/
        'journaled'];

    /**
     * Parent field link
     * @var type
     */
    //public static $parentFieldLink = 'id_command_template';

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_command_template' => [
            'mon_device_command_template' => 'id',
            'fields' => [
                'template_name' => 'name'
            ]
        ]
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_device_command_param',
            'key' => 'id',
            'alias' => 'params'
        ],
        [
            'table' => 'x_transport',
            'key' => 'id_transport',
            'alias' => 'transport',
            'fields' => ['*']
        ],
        [
            'table' => 'mon_device_command_type',
            'key' => 'id_command_type',
            'alias' => 'command_type',
            'fields' => ['description']
        ]
    ];
}
