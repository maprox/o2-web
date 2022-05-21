<?php

/**
 * Class of history detail table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Billing_History_Detail extends Falcon_Table_Common
{
    /**
     * SQL queries
     * @var String
     */
    private $sqlLoadByHistoryId = '
		select coalesce(f.name, \'License fee\') as feename, d.*
		from billing_history_detail d
		left join x_fee f on f.id = d.feeId
		where d.id_history = ?
	';

    /**
     * Load history detail records by a billing history identifier
     * @param {Integer} $historyId
     * @return Mixed[]
     */
    public function loadByHistoryId($historyId)
    {
        return $this->query($this->sqlLoadByHistoryId, [$historyId]);
    }
}
