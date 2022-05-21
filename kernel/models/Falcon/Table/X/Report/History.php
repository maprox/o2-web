<?php

/**
 * Class of report history table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_X_Report_History extends Falcon_Table_Common
{
    private $sqlLoadHistory = "
		SELECT * FROM x_report_history WHERE id_report = ? AND id_firm = ?";
    private $sqlAddHistory = "INSERT INTO x_report_history VALUES(%s)";

    /**
     *
     * @param type $reportId
     * @param type $firmId
     * @return type
     */
    public function loadHistory($reportId, $firmId)
    {
        return $this->query($this->sqlLoadHistory, [$reportId, $firmId]);
    }

    /**
     *
     * @param type $values
     * @return type
     */
    public function addHistory($values)
    {
        return $this->query(sprintf($this->sqlAddHistory, $values));
    }
}
