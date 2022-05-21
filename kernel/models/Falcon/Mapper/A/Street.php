<?php

/**
 * Class of address street mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Mapper_A_Street extends Falcon_Mapper_Common
{

    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * @returns next id_street in sequence
     */
    public function getNextId()
    {
        return $this->getMax('id_street') + 1;
    }
}
