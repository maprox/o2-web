<?php

/**
 * dn_requiredvolume table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Dn_Requiredvolume extends Falcon_Table_Common
{
    /**
     * Last num for firm getting query
     * @var String
     */
    private $sqlLastNum = "
		SELECT MAX(CAST(num AS INTEGER)) AS lastnum
		FROM dn_offer
		WHERE id_firm = ?
	";

    /**
     * Get last num for firm by identifier
     * @param Integer $firmId Firm identifier
     * @return Mixed[] Result data
     */
    public function queryLastNum($firmId)
    {
        return $this->queryCell($this->sqlLastNum, $firmId);
    }
}
