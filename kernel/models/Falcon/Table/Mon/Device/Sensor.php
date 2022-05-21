<?php

/**
 * Table "mon_device_sensor"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Device_Sensor extends Falcon_Table_Common
{

    /**
     * Get chart points
     *
     * @param type $deviceId
     * @param type $sdt
     * @param type $edt
     * @return type
     */
    public function getChartPoints($deviceId, $sdt, $edt)
    {
        $db = $this->_db;
        $logger = Falcon_Logger::getInstance();
        $sql = "select distinct a as time, p.id_device, ps.*, coalesce(mds.name, ms.description) as name
			from generate_series('$sdt'::timestamp, '$edt'::timestamp,
				((extract(epoch from '$edt'::timestamp) - extract(epoch from '$sdt'::timestamp)) / 200) * '1 sec'::interval
			) s(a)
			left join mon_packet p on p.id = (select p2.id from mon_packet p2
				where p2.time > a
				and p2.time <= '$edt'
				and p2.id_device = $deviceId
				and p2.time < a + '00:05'::interval
				order by time
				limit 1)
			left join mon_packet_sensor ps on ps.id_packet = p.id
			left join mon_device_sensor mds on mds.id = ps.id_device_sensor
			left join mon_sensor ms on ms.id = ps.id_sensor
			order by a";

        $result = $db->query($sql)->fetchAll();
        return $result;
    }

}