<?php

/**
 * Table "sdesk_priority" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Priority extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'position',
        'id_firm',
        'name',
        'isdefault',
        'state'
    ];
}
