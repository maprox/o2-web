<?php

/**
 * Class of offer value table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Record_Dn_Offer_Value extends Falcon_Record_Abstract
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
        'price',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_offer', 'id_warehouse',
        'id_region', 'id_product'];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_product' => [
            'dn_product' => 'id',
            'fields' => ['name', 'id_measure']
        ],
        'id_warehouse' => [
            'dn_warehouse' => 'id',
            'fields' => ['name', 'address']
        ],
        'id_region' => [
            'dn_region' => 'id',
            'fields' => ['name']
        ],
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'dn_measure',
            'alias' => 'measure',
            'key' => 'id_product$id_measure',
            'fields' => ['name']
        ],
        [
            'table' => 'dn_article',
            'alias' => 'code',
            'key' => 'id_product',
            'fields' => ['code']
        ],
        [
            'table' => 'dn_feednorm_count',
            'alias' => 'feednorm_count',
            'key' => 'id_region',
            'fields' => ['count']
        ],
        [
            'table' => 'dn_feednorm_value',
            'alias' => 'feednorm_value',
            'key' => 'id_product',
            'fields' => ['amount']
        ],
    ];
}