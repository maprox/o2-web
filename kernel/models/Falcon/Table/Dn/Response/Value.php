<?php

/**
 * Table "dn_response_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Table_Dn_Response_Value extends Falcon_Table_Common
{
    private $sqlGetAll = "SELECT
			val.id as id,
			val.id_response as id_response,
			req.id as id_request_value,
			req.id_request as id_request,
			req.id_place as id_place,
			req.id_product as id_product,
			req.amount as amount,
			val.price as price
		FROM
		dn_request_value as req
			LEFT JOIN
		dn_response as resp
			ON resp.id_firm = ?
			AND resp.id_request = req.id_request
			LEFT JOIN
		dn_response_value as val
			ON val.id_request_value = req.id
			AND val.id_response = resp.id
			JOIN
		dn_product as p ON p.id = req.id_product
			AND p.state != 3
		WHERE
			req.id_request = ?
			AND req.id_place = ?
			AND req.amount > 0;";

    private $sqlGetResponse = "SELECT
			val.id as id,
			val.id_response as id_response,
			req.id as id_request_value,
			req.id_request as id_request,
			req.id_place as id_place,
			req.id_product as id_product,
			req.amount as amount,
			val.price as price
		FROM
		dn_request_value as req
			LEFT JOIN
		dn_response as resp
			ON resp.id_request = req.id_request
			LEFT JOIN
		dn_response_value as val
			ON val.id_request_value = req.id
			AND val.id_response = resp.id
			JOIN
		dn_product as p ON p.id = req.id_product
			AND p.state != 3
		WHERE
			resp.id = ?
			AND req.amount > 0
			AND val.price > 0
			AND req.id_place = ?;";

    /**
     * Get all lines for response
     * @param Integer $requestId Request identifier
     * @param Integer $firmId firm of Id of responding user
     * @return Mixed[]
     */
    public function queryGetAll($requestId, $firmId, $placeId)
    {
        return $this->query($this->sqlGetAll, [$firmId, $requestId, $placeId]);
    }

    public function queryGetResponse($responseId, $placeId)
    {
        return $this->query($this->sqlGetResponse, [$responseId, $placeId]);
    }
}
