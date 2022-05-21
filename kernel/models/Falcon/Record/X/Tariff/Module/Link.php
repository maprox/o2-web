<?php

/**
 * Table "x_tariff_module_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Tariff_Module_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_tariff',
        'id_module'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_tariff',
        'id_module'
    ];

    public static $parentFieldLink = 'id_tariff';
}
