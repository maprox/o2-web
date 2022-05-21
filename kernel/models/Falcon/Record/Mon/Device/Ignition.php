<?php

/**
 * Table "mon_device_ignition" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Ignition extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'type',
        'sdt',
        'edt',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

}
