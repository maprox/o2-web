<?php

/**
 * Table "mon_sensor" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Sensor extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];
}
