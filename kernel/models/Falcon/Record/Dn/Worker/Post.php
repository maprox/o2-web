<?php

/**
 * Table "dn_worker_post" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Worker_Post extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_superior',
        'name',
        'state'
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = [
        'name'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

}
