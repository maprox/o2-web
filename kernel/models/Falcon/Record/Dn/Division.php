<?php

/**
 * Table "dn_division" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Division extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
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
