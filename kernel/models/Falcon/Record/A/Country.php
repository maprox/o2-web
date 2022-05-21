<?php

/**
 * Class of address country table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: $
 * @link       $HeadURL: $
 */
class Falcon_Record_A_Country extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_country',
        'id_lang',
        'id_city',
        'name',
        'state',
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_country',
        'id_lang'
    ];
}
