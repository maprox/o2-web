<?php

/**
 * Class of requiredvolume value table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_Dn_Requiredvolume_Value extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_offer',
        'id_warehouse',
        'id_region',
        'id_product',
        'amount',
        'state'
    ];
}