<?php

/**
 * Table "x_transport" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Transport extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name'
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
}
