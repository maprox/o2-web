<?php

/**
 * Class of history detail record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Record_Billing_History_Detail extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_history',
        'feeid',
        'feecount',
        'payedcount',
        'cost',
        'note',
        'id_package',
        'id_tariff'
    ];
}