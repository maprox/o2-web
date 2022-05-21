<?php

/**
 * Class of account tariff table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Billing_Account_Tariff extends Falcon_Table_Common
{
    /**
     * Returns name corresponding with id_tariff
     * @param {Integer} $tariffId
     * @return String
     */
    public function getTariffName($tariffId)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('x_tariff', 'name')
            ->where('id = ?', $tariffId);
        $name = $db->fetchOne($sql);
        return (string)$name;
    }
}
