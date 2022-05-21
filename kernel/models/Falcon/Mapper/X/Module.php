<?php

/**
 * Class of "x_module" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Module extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * Get users service rights mask on given access right
     *
     * @param Integer $idUser Users id
     * @param String $location - "index" or "admin", all if empty
     * @return {Array[]}
     */
    public function loadForUser($idUser, $location = false)
    {
        return $this->getTable()->loadForUser($idUser, $location);
    }
}
