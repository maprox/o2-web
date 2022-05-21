<?php

/**
 * Class of package mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_N_Notification_Action_Type extends Falcon_Mapper_Common
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

    /**
     * Возвращает id по типу уведомления
     * @param {String} $type тип уведомления
     * @return {Integer}
     */
    public function getIdByType($type)
    {
        $records = $this->load(['identifier = ?' => $type]);
        if (empty($records)) {
            return 0;
        }
        return $records[0]->getId();
    }

    /**
     * Возвращает id по типу уведомления
     * @param {String} $type тип уведомления
     * @return {Integer}
     */
    public function getIdentifierById($type)
    {
        $records = $this->load(['id = ?' => $type]);
        if (empty($records)) {
            return '';
        }

        return $records[0]->get('identifier');
    }

    /**
     * Returns action type record by alias
     * @param type $type
     */
    public function getRecordByType($type)
    {
        $actionType = $this->load([
            'identifier = ?' => $type
        ]);
        if (count($actionType)) {
            return $actionType[0];
        }

        return null;
    }
}
