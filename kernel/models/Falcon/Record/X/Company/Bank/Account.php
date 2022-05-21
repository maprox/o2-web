<?php

/**
 * Table "x_company_bank_account" record class
 *
 * @project    Maprox Observer <http://maprox.net/observer>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Company_Bank_Account extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_company',
        'bank_name',
        'bank_bik',
        'correspondent_account',
        'payment_account',
        'isprimary',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_company'];

    public static $parentFieldLink = 'id_company';
}
