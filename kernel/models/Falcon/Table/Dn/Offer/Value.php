<?php

/**
 * Offer value table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Dn_Offer_Value extends Falcon_Table_Common
{
    /**
     * Insert set of records
     * @var String
     */
    private $sqlInsert = "INSERT INTO dn_offer_value VALUES ?";

    /**
     * Insert set of records
     * @param Array[] $data Array of value arrays
     * @return Array[] Result data
     */
    public function queryInsert($data)
    {
        $values = [];
        foreach ($data as $row) {
            $values[] = "'" . implode("', '", $row) . "'";
        }
        $values = '(' . implode('), (', $values) . ')';
        return $this->query(str_replace('?', $values, $this->sqlInsert));
    }
}
