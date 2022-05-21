<?php

/**
 * Table "dn_product_group"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
class Falcon_Table_Dn_Product_Group extends Falcon_Table_Common
{
    /**
     * Row by code
     * @var String
     */
    private $sqlRowByCode = "select * from dn_product_group where code = ?";

    /**
     * Returns group by value of a field 'code'
     * @param string $code Value of a field 'code'
     * @return Array
     */
    public function getRowByCode($code)
    {
        return $this->query($this->sqlRowByCode, $code);
    }
}
