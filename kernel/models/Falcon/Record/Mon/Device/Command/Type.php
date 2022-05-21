<?php

/**
 * Table "mon_device_command_type" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Command_Type extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'description',
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
    public static $parentFieldLink = 'id';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_device_command_type_protocol_link',
            'key' => 'id',
            'alias' => 'protocols',
            'simple' => true
        ],
        [
            'table' => 'mon_device_command_type_param',
            'key' => 'id',
            'alias' => 'params',
            'fields' => ['*']
        ],
        [
            'table' => 'mon_device_command_type_transport_link',
            'key' => 'id',
            'alias' => 'transports',
            'fields' => ['*']
        ]
    ];
}
