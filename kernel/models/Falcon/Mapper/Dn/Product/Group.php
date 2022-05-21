<?php

/**
 * Table "dn_product_group"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
class Falcon_Mapper_Dn_Product_Group extends Falcon_Mapper_Common
{
    /**
     * Returns a group record
     * @param string $code Code of a group
     */
    public function getGroupByCode($code)
    {
        $row = $this->getTable()->getRowByCode($name);
        $group = count($row) > 0 ? $this->newRecord($row[0]) : null;
        return $group;
    }
}
