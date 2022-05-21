<?php

/**
 * Billing package abstract class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Billing_Package_Abstract extends Falcon_Singleton
{
    /**
     * Calculates billing for specified account package
     * @param int $accountId
     * @param int $packageId
     * @param string $dt
     */
    public function calculate($accountId, $packageId, $dt)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }
}