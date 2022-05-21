<?php

/**
 * Class of request table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Dn_Request extends Falcon_Table_Common
{
    private $sqlLoadWarehouseWithAmount = "
		SELECT
			war.*, SUM(val.amount) as amount, req.id as id_request
		FROM
			dn_request as req
		LEFT JOIN
			dn_warehouse as war
		ON
			war.id_firm = req.id_firm
		LEFT JOIN
			dn_request_value as val
		ON
				val.id_request = req.id
			AND
				val.id_place = war.id
		WHERE
				req.id = ?
			AND
				req.state = 1
			AND
				war.state = 1
		GROUP BY req.id, war.id";

    /**
     * Load warehouses by request identifier
     * @param Integer $requestId Request identifier
     * @param Boolean $loadEmpty Load warehouses without data (default = true)
     * @return Array[]
     */
    public function loadWarehouseWithAmount($requestId, $loadEmpty = true)
    {
        $query = $this->sqlLoadWarehouseWithAmount;
        if (!$loadEmpty) {
            $query .= "
				HAVING SUM(val.amount) is not null and SUM(val.amount) > 0
			";
        }
        return $this->query($query, $requestId);
    }
}
