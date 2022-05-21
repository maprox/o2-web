<?php

/**
 * Action "Session"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Session extends Falcon_Action_Rest_Common
{
    /**
     * Need to perform check read
     * @var Boolean
     */
    protected $checkRead = false;

    /**
     * If need to add access sql
     * @var Boolean
     */
    protected $addAccessSql = false;
}
