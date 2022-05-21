<?php

/**
 * Class of response table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Table_Dn_Response extends Falcon_Table_Common
{
    private $sqlLoadRequests = "SELECT
			resp.id as id,
			req.id as id_request,
			req.num as num,
			req.sdt as sdt,
			req.edt as edt,
			resp.status as status
		FROM
			dn_response as resp
				INNER JOIN
			dn_request as req
				ON req.id = resp.id_request
				AND resp.id_firm = ?
		WHERE
			edt > ?;";

    private $sqlByRequest = "SELECT DISTINCT
			resp.id as id_response,
			resp.id_request as id_request,
			resp.dt as dt,
			firm.id as id_firm,
			company.name as firm,
			req.id_place as id_place
		FROM
			dn_response as resp
				LEFT JOIN
			x_firm as firm
				ON resp.id_firm = firm.id
				LEFT JOIN
			x_company as company
				ON firm.id_company = company.id
				LEFT JOIN
			dn_response_value as val
				ON resp.id = val.id_response
				LEFT JOIN
			dn_request_value as req
				ON req.id = val.id_request_value
		WHERE resp.id_request = ?
		  AND status = 3";

    /**
     * Get request
     * @param Integer $firmId identifier of users firm
     * @return Mixed[]
     */
    public function loadRequests($firmId)
    {
        return $this->query($this->sqlLoadRequests,
            [$firmId, $this->dbDate()]);
    }

    public function loadByRequest($requestId)
    {
        return $this->query($this->sqlByRequest, $requestId);
    }
}
