<?php

/**
 * Table "dn_account" record class
 *
 * @project    Maprox Observer <http://maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Record_Dn_Account extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_firm_client',
        'id_package',
        'dt_request',
        'state'
    ];

    /**
     * Table fields that should not leave Back-end.
     * When toArray is called, they are removed
     * @var String[]
     */
    public static $privateFields = ['id_package', 'dt_request'];

    /**
     * Returns true if account is activated
     * @return Boolean
     */
    public function isActivated()
    {
        return ($this->get('state') === 1);
    }
}