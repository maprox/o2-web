<?php

/**
 * Class of account tariff record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Billing_Account_Tariff extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_account',
        'id_tariff',
        'sdt',
        'edt',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * Actually, a lie. 'sdt' is also part of primary key, but we can't use it here yet.
     * Abstract Record and Abstract Mapper aren't ready for this.
     * @var String[]
     */
    public static $primaryKey = [
        'id_account',
        'id_tariff',
        'sdt'
    ];

    /**
     * Returns name corresponding with current id_tariff
     * @return String
     */
    public function getTariffName()
    {
        return $this->getMapper()->getTariffName($this->get('id_tariff'));
    }
}
