<?php

/**
 * Table "dn_measure"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Dn_Measure extends Falcon_Mapper_Common
{
    /**
     * True to enable caching of the whole mapper's table (false by default).
     * @var bool
     */
    protected $caching = true;

    /**
     * Returns identifier of measure by its name
     * @param string $name Name of the measure
     */
    public function getIdByName($name)
    {
        return $this->getTable()->getIdByName($name);
    }
}