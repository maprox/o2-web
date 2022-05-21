<?php

/**
 * Class of updates mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Updates extends Falcon_Mapper_Common
{
    /**
     * Получение алиасов объектов, которые необходимо обновить
     * @param {Date} $sdt Дата, начиная с которой нужно проверять обновления
     * @return String[] Массив алиасов, которые были обновлены
     */
    public function getAliases($sdt = null)
    {
        $user = Falcon_Model_User::getInstance();
        if ($sdt == null || $user->getId() < 0) {
            return [];
        }
        $aliases = $this->getTable()->getAliases($sdt,
            $user->getId(), $user->getFirmId());

        return array_unique($aliases);
    }

    /**
     * Get aliases from given period
     * @param {Date} $sdt start
     * @param {Date} $edt end date
     * @return String[] Aliases
     */
    public function getAliasesForPeriod($sdt = null, $edt = null)
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        if ($sdt == null || $user->getId() < 0) {
            return [];
        }

        $aliases = $this->getTable()->getAliasesForPeriod($sdt, $edt,
            $user->getId(), $user->getFirmId());

        return array_unique($aliases);
    }

    /**
     * Returns updates
     * @param $sdt $sdt
     * @param $edt $edt
     * @param Array $aliases
     */
    public function getUpdates($sdt, $edt, $aliases = [])
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        if ($sdt == null || $user->getId() < 0) {
            return [];
        }

        $userId = $user->getId();
        $firmId = $user->getFirmId();

        $updates = $this->getTable()->getUpdates($sdt, $edt, $userId, $firmId,
            $aliases);

        return $updates;
    }
}