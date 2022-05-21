<?php

/**
 * Table "mon_packet_sensor"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Table_Mon_Packet_Sensor extends Falcon_Table_Common
{
    /*
     * SQL
     * @type String
     */
    private $sqlLoadByPacket = '
		select ps.*, s.name as sensor
		from mon_packet_sensor as ps
			left join mon_sensor as s
			on s.id = ps.id_sensor
		where ps.id_packet = ?';

    /**
     * Load sensors by id_packet
     * @param Integer $packetId
     * @return Array[]
     */
    public function loadByPacket($packetId)
    {
        return $this->query($this->sqlLoadByPacket, [$packetId]);
    }
}
