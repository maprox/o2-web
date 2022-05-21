<?php

/**
 * Mapper for table "dn_response_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Dn_Response_Value extends Falcon_Mapper_Common
{
    /**
     * Load all lines of chosen price response
     * @param Integer $requestId request Id
     * @param Integer $firmId responding firm Id
     * @return Array request data
     */
    public function loadRequest($requestId, $firmId, $placeId)
    {
        $return = $this->getTable()->queryGetAll($requestId, $firmId, $placeId);

        return $return;
    }

    public function loadResponse($responseId, $placeId)
    {
        $return = $this->getTable()->queryGetResponse($responseId, $placeId);

        return $return;
    }
}
