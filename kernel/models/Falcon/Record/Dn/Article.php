<?php

/**
 * Table "dn_article" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
class Falcon_Record_Dn_Article extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_group',
        'id_product',
        'code',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_group',
        'id_product'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_product';
}
