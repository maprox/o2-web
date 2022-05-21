<?php

/**
 * Class of requiredvolume table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_Dn_Requiredvolume extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_user',
        'sdt',
        'edt',
        'num',
        'state'
    ];
}