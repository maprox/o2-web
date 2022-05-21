<?php

/**
 * Table "dn_act" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Act extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'dt',
        'num',
        'id_firm',
        'id_firm_executor',
        'id_firm_client',
        'state'
    ];

    /**
     * Table fields
     * @var String[]
     */
    public static $fieldsInfo = [
        'num' => [
            'type' => Falcon_Table_Field_Type::TEXT
        ]
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'dn_act_item',
            'alias' => 'items'
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

}
