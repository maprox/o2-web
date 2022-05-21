<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Waylist_Route extends Falcon_Action_Rest_Child
{
    /**
     * Parent table config for checking access
     * like "array(fieldName => tableName)"
     * @var array
     */
    public static $parentConfig = ['id_waylist' => 'mon_waylist'];
}
