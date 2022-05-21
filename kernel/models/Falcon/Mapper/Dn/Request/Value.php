<?php

/**
 * Mapper for table "dn_request_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Request_Value extends Falcon_Mapper_Common
{
    /**
     * Load all lines of chosen price request
     * @param Integer $requestId request Id
     * @param Integer $placeId warehouse Id
     * @param Boolean $loadEmpty Load empty items (default = true)
     * @return Array request data
     */
    public function loadRequest($requestId, $placeId, $loadEmpty = true)
    {
        $table = $this->getTable();
        $return = $table->queryGetRequest($requestId, $placeId, $loadEmpty);
        $records = [];
        foreach ($return as $key => $value) {
            if ($value['id'] == null) {
                $records[$value['id_product']] =
                    new Falcon_Record_Dn_Request_Value([
                        'id_request' => $requestId,
                        'id_place' => $placeId,
                        'id_product' => $value['id_product'],
                        'amount' => 0,
                        'state' => 1
                    ]);
            }
        }

        if (!empty($records)) {
            $this->insert($records);
            $return = $table->queryGetRequest($requestId, $placeId, $loadEmpty);
        }

        foreach ($return as &$value) {
            $value['id_place'] = $placeId;
        }

        return $return;
    }

    /**
     * Load all lines of chosen price request with detailed information
     * @param Integer $requestId request Id
     * @param Integer $placeId warehouse Id
     * @param Boolean $loadEmpty Load empty items (default = true)
     * @return Array request data
     */
    public function loadRequestFull($requestId, $placeId, $loadEmpty = true)
    {
        $table = $this->getTable();
        $return = $table->queryGetRequestFull($requestId, $placeId, $loadEmpty);
        foreach ($return as &$value) {
            $value['id_place'] = $placeId;
        }

        return $return;
    }

    /**
     * Thrashes all lines of chosen price request
     * @param Integer $requestId request Id
     */
    public function trashAllInRequest($requestId)
    {
        $where = ['"id_request" = ?' => $requestId];
        $this->trash($where);
    }

    /**
     * TODO COMMENT THIS!
     * @param type $requestId
     * @param type $responseId
     * @return type
     */
    public function loadPlaceList($requestId, $responseId)
    {
        $return = $this->getTable()->queryGetPlaceList($requestId);

        foreach ($return as &$value) {
            $value['id_response'] = $responseId;
            $value['id_request'] = $requestId;
        }

        return $return;
    }
}
