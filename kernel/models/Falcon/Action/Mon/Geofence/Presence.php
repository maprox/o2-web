<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Geofence_Presence extends Falcon_Action_Rest_Readonly
{
    /**
     * If given, limits number of records in list, despite user requests
     * @var Integer
     */
    protected $upperLimit = 1000;
}
