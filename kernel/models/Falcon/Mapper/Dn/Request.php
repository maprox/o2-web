<?php

/**
 * Table "dn_request"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Request extends Falcon_Mapper_Common
{

    /**
     * Load warehouses by request identifier
     * @param Integer $requestId Request identifier
     * @param Boolean $loadEmpty Load warehouses without data (default = true)
     * @return Array[]
     */
    public function loadWarehouseWithAmount($requestId, $loadEmpty = true)
    {
        $table = $this->getTable();
        return $table->loadWarehouseWithAmount($requestId, $loadEmpty);
    }
}
