<?php

/**
 * Notification Factory
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Action_Factory
{
    /**
     * Creates an instance of specific action object
     * @param {Array} $action Action data
     * @return actionClassName
     */
    public static function createInstance($action)
    {
        $logger = Falcon_Logger::getInstance();

        $typeMapper = Falcon_Mapper_N_Notification_Action_Type::getInstance();
        $type = $action['id_action_type'];
        $alias = $typeMapper->getIdentifierById($type);

        // TODO: could it be like:
        // 'Falcon_Notification_Action_' . ucwords_custom($alias) ?
        // or may be it should work like "flyweight" not just "factory"
        if (in_array($alias, ['group_add', 'group_remove'])) {
            $actionClassName = 'Falcon_Notification_Action_Group';
        } else if (in_array($alias, ['url'])) {
            $actionClassName = 'Falcon_Notification_Action_Url';
        } else {
            $actionClassName = 'Falcon_Notification_Action_Message';
        }
        if (!class_exists_warn_off($actionClassName)) {
            return null;
        }
        $actionManager = new $actionClassName();
        $actionManager->setAction($action);

        if (!($actionManager instanceOf Falcon_Notification_Action_Abstract)) {
            return null;
        }

        return $actionManager;
    }
}
