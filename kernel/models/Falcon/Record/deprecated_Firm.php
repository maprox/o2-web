<?php

/**
 * Class of firm table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Firm extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'state'
    ];

    /**
     * Load firm's warehouses
     * @param Boolean $toArray Export data to an array
     * @return Falcon_Record_Warehouse[]/Array[]
     */
    public function loadWarehouses($toArray = false)
    {
        return Falcon_Mapper_Warehouse::getInstance()
            ->loadByFirm($this->getId(), $toArray);
    }
}