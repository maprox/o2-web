<?php

/**
 * Class of tariff option table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_X_Fee_Value extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_tariff',
        'id_fee',
        'amount',
        'no_fee_count',
        'is_monthly',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_tariff',
        'id_fee'
    ];

    public static $parentFieldLink = 'id_tariff';
}
