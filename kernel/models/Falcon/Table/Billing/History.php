<?php

/**
 * Class of history table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox Ltd
 */
class Falcon_Table_Billing_History extends Falcon_Table_Common
{
    /**
     * SQL queries
     */
    private $sqlGetCountByAccountId = '
		select count(*) from billing_history
		where id_account = ?
		  and state = 1';

    /**
     * Load history records by an account identifier
     * @param int $accountId
     * @param array $params Sort and paging params
     * @return Mixed[]
     */
    public function loadByAccountId($accountId, $params)
    {
        $db = $this->_db;
        // compile base sql
        $sql = $db->select()->from('billing_history')
            ->where('id_account = ?', $accountId)
            ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
        // prepare query
        $this->prepareQuery($sql, $params);
        // execute query
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Returns count of history record in database by account identifier
     * @param {Integer} $accountId
     * @return {Integer}
     */
    public function getCountByAccountId($accountId)
    {
        return $this->queryCell($this->sqlGetCountByAccountId, [
            $accountId]);
    }
}
