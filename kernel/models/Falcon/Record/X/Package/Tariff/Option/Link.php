<?php

/**
 * Class of package table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_X_Package_Tariff_Option_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_package',
        'id_tariff_option'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_package',
        'id_tariff_option'
    ];

    public static $parentFieldLink = 'id_package';
}
