<?php

/**
 * Class of warehouse table record
 *
 * @project    Maprox <http://www,maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Dn_Warehouse extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_region',
        'id_warehouse_type',
        'name',
        'address',
        'note',
        'lat',
        'lon',
        'distributed',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];
}