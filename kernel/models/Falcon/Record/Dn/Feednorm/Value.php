<?php

/**
 * Table "dn_feednorm_value" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Record_Dn_Feednorm_Value extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_feednorm',
        'id_product',
        'amount',
        'sdt'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_product';
}
