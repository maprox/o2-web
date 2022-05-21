<?php

/**
 * Table "x_group_mon_device" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Group_Mon_Device extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_creator',
        'name',
        'state'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_group_item_link',
            'key' => 'id',
            'alias' => 'items',
            'fields' => ['id_item'],

            'simple' => true,

            // Check access when updating linked records
            'check_access' => true,
            'check_access_table' => 'mon_device'
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged'];

}
