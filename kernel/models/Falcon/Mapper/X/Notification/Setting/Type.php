<?php

/**
 * Notfication settings type mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Mapper_X_Notification_Setting_Type extends Falcon_Mapper_Common
{

    /**
     * True to enable caching of the whole mapper's table (false by default).
     * @var bool
     */
    protected $caching = true;

    /**
     * Returns a protocol alias by its id
     * @param int $id
     * @return string
     */
    public function getAliasForId($id)
    {
        $record = $this->loadRecord($id);
        return $record ? $record->get('name') : null;
    }

    /**
     * Returns a protocol id by its alias
     * @param string $alias
     * @return int
     */
    public function getIdForAlias($alias)
    {
        $records = $this->load([
            'name = ?' => $alias,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ], true);
        return !empty($records) ? $records[0]['id'] : null;
    }
}
