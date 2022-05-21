<?php

/**
 * Table "mon_call" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Call extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'time',
        'phone',
        'duration',
        'id_packet',
        'call_type',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

}
