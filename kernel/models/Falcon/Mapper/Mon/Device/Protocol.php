<?php

/**
 * Class of "mon_device_protocol" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Protocol extends Falcon_Mapper_Common
{
    const GLOBAL_SETTINGS_ALIAS = 'common';

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
     * Returns a protocol alias by its id
     * @param int $id
     * @return string
     */
    public function getAliasForId($id)
    {
        if ($id == 0) {
            return self::GLOBAL_SETTINGS_ALIAS;
        }

        $record = $this->loadRecord($id, true);
        return $record ? $record['alias'] : null;
    }

    /**
     * Returns a protocol id by its alias
     * @param string $alias
     * @return int
     */
    public function getIdForAlias($alias)
    {
        $records = $this->load([
            'alias = ?' => $alias,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ], true);
        return !empty($records) ? $records[0]['id'] : null;
    }
}
