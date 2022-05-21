<?php

/**
 * Mapper for table "mon_device_setting"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Setting extends Falcon_Mapper_Common
{
    protected $_cache = [];

    /**
     * Load records by a supplied query function
     * @param callback $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $data = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);
        return $this->getTable()->castRowsToInt($data);
    }

    /**
     * @param $deviceId
     * @param $option
     * @param int $protocol
     * @return mixed
     */
    public function getOption($deviceId, $option, $protocol = 0)
    {
        $cacheKey = implode('#', func_get_args());

        if (!array_key_exists($cacheKey, $this->_cache)) {
            $records = $this->load([
                'id_device = ?' => $deviceId,
                'option = ?' => $option,
                'id_protocol = ?' => $protocol
            ]);
            $this->_cache[$cacheKey] = $records ? $records[0]->get('value') :
                null;
        }

        return $this->_cache[$cacheKey];
    }

    public function dropCache()
    {
        $this->_cache = [];
    }
}
