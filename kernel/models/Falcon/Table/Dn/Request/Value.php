<?php

/**
 * Table "dn_request_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Dn_Request_Value extends Falcon_Table_Common
{
    private $sqlGetRequest = "SELECT
			v.id as id,
			r.id as id_request,
			p.id as id_product,
			v.amount as amount
		FROM
			dn_product as p
				INNER JOIN
			dn_request as r
				ON r.id = ?
				LEFT JOIN
			dn_request_value as v
				ON v.id_place = ?
				AND v.id_product = p.id
				AND v.id_request = r.id
		WHERE
			p.state = 1 AND (v.state IS NULL OR v.state = 1)";

    private $sqlGetRequestFull = "SELECT
			v.id as id,
			r.id as id_request,
			p.id as id_product,
			a.code as article,
			p.name as product_name,
			p.fullname as product_fullname,
			m.name as measure,
			v.amount as amount
		FROM
			dn_product as p
				INNER JOIN
			dn_article as a
				ON a.id_product = p.id
				AND a.id_group = 1000 -- TEMP
				INNER JOIN
			dn_measure as m
				ON m.id = p.id_measure
				INNER JOIN
			dn_request as r
				ON r.id = ?
				LEFT JOIN
			dn_request_value as v
				ON v.id_place = ?
				AND v.id_product = p.id
				AND v.id_request = r.id
				AND p.state = 1
				AND v.state = 1";

    private $sqlGetPlaceList = "SELECT
			id_place
		FROM
			dn_request_value
		WHERE
			id_request = ?
			AND state = 1
			AND amount > 0
		GROUP BY
			id_place";

    /**
     * Get request
     * @param Integer $requestId Request identifier
     * @param Integer $placeId Warehouse identifier
     * @param Boolean $loadEmpty Load empty items (default = true)
     * @return Array
     */
    public function queryGetRequest($requestId, $placeId, $loadEmpty = true)
    {
        $query = $this->sqlGetRequest;
        if (!$loadEmpty) {
            $query .= "
				WHERE coalesce(v.amount, 0) > 0
			";
        }
        return $this->query($query, [$requestId, $placeId]);
    }

    /**
     * Get request with detailed info on product name, article, measure
     * @param Integer $requestId Request identifier
     * @param Integer $placeId Warehouse identifier
     * @param Boolean $loadEmpty Load empty items (default = true)
     * @return Array
     */
    public function queryGetRequestFull($requestId, $placeId, $loadEmpty = true)
    {
        $query = $this->sqlGetRequestFull;
        if (!$loadEmpty) {
            $query .= "
				WHERE coalesce(v.amount, 0) > 0
			";
        }
        return $this->query($query, [$requestId, $placeId]);
    }

    /**
     * TODO COMMENT THIS!
     * @param type $requestId
     * @return type
     */
    public function queryGetPlaceList($requestId)
    {
        return $this->query($this->sqlGetPlaceList,
            [$requestId]);
    }
}
