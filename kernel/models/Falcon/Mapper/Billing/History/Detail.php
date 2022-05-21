<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Class of history detail mapper
 */
class Falcon_Mapper_Billing_History_Detail extends Falcon_Mapper_Common
{
    /**
     * Load history detail records by a billing history identifier
     * @param {Integer} $historyId
     * @return Mixed[]
     */
    public function loadByHistoryId($historyId)
    {
        return $this->getTable()->loadByHistoryId($historyId);
    }
}