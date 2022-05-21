<?php

/**
 * Class of account limit record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Record_Billing_Account_Limit extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_account',
        'id_user',
        'sdt',
        'edt',
        'limitvalue',
        'note'
    ];
}