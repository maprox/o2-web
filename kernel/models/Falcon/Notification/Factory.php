<?php

/**
 * Notification Factory
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Factory
{
    /**
     * Creates an instance of specific action object
     * @param {string} $alias Action alias
     * @param {int} $id Object identifier
     * @param {Falcon_Model_Work} $work Work instance
     * @return ActionClassName
     */
    public static function createInstance($alias, $work = null)
    {
        $logger = Falcon_Logger::getInstance();
        $ActionClassName = 'Falcon_Notification_' . ucwords_custom($alias);
        if (!class_exists_warn_off($ActionClassName)) {
            return null;
        }
        $action = new $ActionClassName($work);
        if (!($action instanceOf Falcon_Notification_Abstract)) {
            return null;
        }
        return $action;
    }
}
