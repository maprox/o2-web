<?php

/**
 * Table "mon_fuel" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Fuel extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
        'code',
        'state'
    ];

    /**
     * Required fields
     * @var String[]
     */
    public static $requiredFields = ['name'];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

}
