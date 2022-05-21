<?php

/**
 * Table "dn_measure"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Table_Dn_Measure extends Falcon_Table_Common
{
    /**
     * Returns an identifier of measure by its name
     * @param string $name Name of measure
     * @return Array
     */
    public function getIdByName($name)
    {
        return $this->queryCell(
            "select id from dn_measure where name = ?", $name, 'id');
    }
}
