<?php

/**
 * Class of package table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_X_Package_Fee_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_package',
        'id_fee'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_package',
        'id_fee'
    ];

    public static $parentFieldLink = 'id_package';
}
