<?php

/**
 * Class of request table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Dn_Request extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_user',
        'num',
        'description',
        'sdt',
        'edt',
        'state',
        'status'
    ];
}