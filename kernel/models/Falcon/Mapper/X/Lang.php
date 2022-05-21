<?php

/**
 * Lang mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_X_Lang extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * True to enable caching of the whole mapper's table (false by default).
     * @var bool
     */
    protected $caching = true;
}
