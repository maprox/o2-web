<?php

/**
 * Class of "mon_vehicle" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Mapper_Mon_Vehicle extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $joinedFn = function ($sql) use ($queryFn, $addLinked) {
            call_user_func($queryFn, $sql);
            if (!$addLinked) {
                return;
            }

            $sql->joinLeft(['vd' => 'mon_vehicle_driver'],
                'vd.id_vehicle = t.id', []);
        };

        return parent::loadBy($joinedFn, $queryParams,
            $addLinkedJoined, $addLinked);
    }

}