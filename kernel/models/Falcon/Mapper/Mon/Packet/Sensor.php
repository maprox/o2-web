<?php

/**
 * Mapper for table "mon_packet_sensor"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Mon_Packet_Sensor extends Falcon_Mapper_Common
{
    /**
     * Load sensors by id_packet
     * @param Integer $packetId
     * @return Array[]
     */
    public function loadByPacket($packetId)
    {
        return $this->getTable()->loadByPacket($packetId);
    }

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
        $sensors = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);
        foreach ($sensors as &$sensor) {
            $sensor = (array)$sensor;
            $sensor['sensor'] = (array)$sensor['sensor'];
            $sensor['sensor'] = isset($sensor['sensor']['name']) ?
                $sensor['sensor']['name'] : '';
        }
        return $sensors;
    }
}