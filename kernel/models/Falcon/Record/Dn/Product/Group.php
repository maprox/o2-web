<?php

/**
 * Table "dn_product_group" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
class Falcon_Record_Dn_Product_Group extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_parent',
        'name',
        'fullname',
        'code'
    ];
}