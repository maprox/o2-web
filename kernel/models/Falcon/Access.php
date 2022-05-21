<?php

/**
 * Server access manager class for common items in every service
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Access extends Falcon_Access_Abstract
{
    protected static $serviceMask;

    /**
     * Gets required service rights mask
     * @return Integer
     */
    protected static function getServiceAccessMask()
    {
        if (empty(self::$serviceMask)) {
            $service = Zend_Registry::get('config')->version->service;
            $className = 'Falcon_Access_' . ucfirst($service);

            if (!class_exists_warn_off($className)) {
                self::throwError();
            }

            $constantName = $className . '::SERVICE_ACCESS';

            if (!defined($constantName)) {
                self::throwError();
            }

            self::$serviceMask = constant($constantName);
        }

        return self::$serviceMask;
    }

    /**
     * Returns an array of object firms
     * @param Falcon_Record_Abstract $entity
     * @param string $time
     */
    public static function getObjectFirmIds($entity, $time = null)
    {
        $firmIds = Falcon_Mapper_X_Access::getInstance()
            ->getObjectSharedFirmIds($entity, $time);
        $firmIds[] = $entity->getIdFirm();
        return $firmIds;
    }

    /**
     * Returns an array of object user ids
     * @param Falcon_Record_Abstract $entity
     * @param string $time
     */
    public static function getObjectUserIds($entity, $time = null)
    {
        $m = Falcon_Mapper_X_Access::getInstance();
        $userIds = $m->getObjectSharedUserIds($entity, $time);
        return $userIds;
    }
}
