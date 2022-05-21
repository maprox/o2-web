<?php

/**
 * Class of account tariff mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Billing_Account_Tariff extends Falcon_Mapper_Common
{
    /**
     * Returns name corresponding with id_tariff
     * @param {Integer} $tariffId
     * @return String
     */
    public function getTariffName($tariffId)
    {
        return $this->getTable()->getTariffName($tariffId);
    }
}
