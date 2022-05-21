<?php

/**
 * Class of history mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Billing_History extends Falcon_Mapper_Common
{
    /**
     * Load history records by an account identifier
     * @param int $accountId
     * @param array $params Sort and paging params
     * @return Mixed[]
     */
    public function loadByAccountId($accountId, $params)
    {
        return $this->getTable()->loadByAccountId($accountId, $params);
    }

    /**
     * Returns count of history record in database by account identifier
     * @param {Integer} $accountId
     * @return {Integer}
     */
    public function getCountByAccountId($accountId)
    {
        return $this->getTable()->getCountByAccountId($accountId);
    }
}