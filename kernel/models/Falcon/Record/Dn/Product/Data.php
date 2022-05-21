<?php

/**
 * Table "dn_product_data" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
class Falcon_Record_Dn_Product_Data extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_product',
        'id_firm',
        'ntd',
        'shipmenttime',
        'shelflife',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_product',
        'id_firm'
    ];
}
