<?php

/**
 * Table "mon_packet"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2014, Maprox LLC
 */
class Falcon_Table_Mon_Packet extends Falcon_Table_Common
{
    /**
     * SQL requests
     * @var String
     */
    private $sqlLoadByDeviceForPeriod = '
		select *,
		  id_device as deviceid
		from mon_packet
		where id_device = ?
		  and state = ?
		  and event_dt >= ?
		  and event_dt < coalesce(?, current_timestamp + interval \'100 day\')
		order by time desc';
    private $sqlPrevMaxId = '
		select max(id) as maxid
		from mon_packet
		where id_device = ?
		  and id < ?
		  and time < ?';
    private $sqlPrevMaxTime = '
		select max(time) as maxtime
		from mon_packet
		where id_device = ?
		  and id < ?';
    private $sqlLastPacketIfNormal = '
		select *,
		  id_device as deviceid
		from mon_packet p
		where p.id_device = ?
		  and state = ?
		  and p.id = ?
		  and p.time = ?';
    private $sqlPacketByTimeField = '
		select *,
		  id_device as deviceid
		from mon_packet p
		where p.id_device = ?
		  and p.time = ?';
    private $sqlGetNewSosPackets = '
		SELECT id, id_device, time
		FROM mon_packet p
		WHERE p.id_type = 1
		  AND p.time not in (SELECT dt FROM ev_integer WHERE id_event = 29)
		  AND p.time > current_date - interval \'10 day\'
	';
    private $sqlCalculateOdometer =
        'select * from st_length(st_geographyfromtext(?))';
    private $sqlGetAverageSpeed =
        'SELECT speed, time FROM mon_packet
			WHERE id_device = ? and time < ? and state != ?
			ORDER BY time DESC limit 10';
    private $sqlActivateDevicePackets = '
		update mon_packet
		set state = 1
		where id_device = ?
		  and time between ? and ?';

    /**
     * Calculated ranges
     * @var Float[]
     */
    protected $rangeCache = [];
    /**
     * Calculated speeds
     * @var Float[]
     */
    protected $speedCache = [];

    /**
     * Loads packets by event_dt period for devices in deviceIds list
     * @param Integer[] $deviceIds
     * @param Date $sdt [Opt.] Period start
     * @param Date $edt [Opt.] Period end
     * @return Array[]
     */
    public function loadByDeviceIds($deviceIds, $sdt, $edt = null)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_packet', ['*', 'id_device as deviceid'])
            ->where('id_device in (?)', $deviceIds)
            ->where('event_dt >= ?', $sdt)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            //->where('state != ?', Falcon_Record_Abstract::STATE_INCORRECT)
            ->order('time desc');
        if ($edt !== null) {
            $sql->where('event_dt < ?', $edt ? $edt : 'now()');
        }
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Loads device packets by "event_dt" period
     * @param Integer $deviceId
     * @param Date $sdt [Opt.] Period start
     * @param Date $edt [Opt.] Period end
     * @return Array[]
     */
    public function loadByDeviceForPeriod($deviceId, $sdt, $edt = null)
    {
        return $this->query($this->sqlLoadByDeviceForPeriod, [
            $deviceId, Falcon_Record_Abstract::STATE_ACTIVE, $sdt, $edt]);
    }

    /**
     * Loads device packets by "time" period
     * @param Integer $deviceId
     * @param Date $sdt [Opt.] Period start
     * @param Date $edt [Opt.] Period end
     * @param {stdClass[]} $order Array of order objects
     *     with "property" and "direction" fields
     * @param {Boolean} $inclusive include packet if it's time is exactly $sdt
     * @param {Boolean} $returnIncorrect [opt., true by default] include incorrect packets
     * @param Array $sensors Which sensors should be joined
     * @return Array[]
     */
    public function loadByDeviceForTimePeriod($deviceId, $sdt, $edt = null,
                                              $order = null, $inclusive = false, $returnIncorrect = true,
                                              $sensors = null)
    {
        $db = $this->_db;

        $fields = ['id', 'id_device', 'id_type',
            'time', 'latitude', 'longitude', 'speed', 'odometer',
            'odometer_forced', 'state'];

        $sql = $db->select()
            ->from(['mp' => 'mon_packet'], $fields)
            ->where('id_device = ?', $deviceId);

        if ($sensors) {
            $sql->join(['mps' => 'mon_packet_sensor'],
                'mp.id = mps.id_packet', []);

            $sql->join(['ms' => 'mon_sensor'],
                'ms.id = mps.id_sensor', []);
            $sql->where('ms.name IN (?)', $sensors);
            $sql->columns('name as sensor', 'ms');
            $sql->columns('val', 'mps');
        }

        if ($inclusive) {
            $sql->where('time >= ?', $sdt);
        } else {
            $sql->where('time > ?', $sdt);
        }

        if ($edt) {
            $sql->where('time <= ?', $edt);
        }

        if (!$returnIncorrect) {
            $sql->where('state = ' . Falcon_Record_Abstract::STATE_ACTIVE .
                ' OR id_type = 1');
        } else {
            $sql->where('state != ' . Falcon_Record_Abstract::STATE_DELETED .
                ' OR id_type = 1');
        }

        if ($order) {
            // add ordering
            $orderBy = [];
            if (is_array($order)) {
                foreach ($order as $orderItem) {
                    $orderItem = (array)$orderItem;
                    $orderBy[] = $orderItem['property'] . ' ' .
                        $orderItem['direction'];
                }
            }
            if (count($orderBy) > 0) {
                $sql->order($orderBy);
            }
        } else {
            $sql->order('time desc');
        }
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Loads device packets limited by $limit parameter
     * @param Integer $deviceId
     * @param Integer $limit
     * @return Array[]
     *//*
	public function loadByDeviceLimited($deviceId, $limit = 10)
	{
		$records = $this->query($this->sqlLoadByDeviceLimited, array(
			$deviceId, $limit));
		if (empty($records))
		{
			// if no packets for device
			// lets get the last device packet (to show last location)
			$device = new Falcon_Model_Device($deviceId);
			$time = $device->getLastPacketDate();
			$records = $this->getDevicePacketsByTimeField($deviceId, $time);
			if (empty($records) || $records[0]['state']
					!= Falcon_Record_Abstract::STATE_ACTIVE)
			{
				$record = $this->getPacketAtIndexFromDt(
					$deviceId, 0, null, true, false);
				if (!empty($record))
				{
					$record['deviceid'] = $record['id_device'];
					$records = array($record);
				}
			}
		}
		return $records;
	}*/

    /**
     * Loads packets by event_dt period for devices in deviceIds list
     * @param Integer[] $deviceIds
     * @param Date $sdt [Opt.] Period start
     * @param Date $edt [Opt.] Period end
     * @return Array[]
     */
    public function loadByDeviceIdsLimited($deviceIds, $limit)
    {
        /*$records = array();
        foreach ($deviceIds as $deviceId) {
            $records = array_merge($records,
                $this->loadByDeviceLimited($deviceId, $limit));
        }
        return $records;*/

        $db = $this->_db;
        $sql = $db->select()
            ->from(['d' => 'mon_device'], ['id as deviceid'])
            ->join(['p' => 'mon_packet'],
                'p.id_device = d.id and p.time = d.lastpacket',
                ['p.*'])
            ->where('d.state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->where('p.state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->where('d.lastconnect is not null')
            ->where('d.id in (?)', $deviceIds);
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Returns $count packets at $index in a row before the specified time $dt,
     * inclusive. (To retrieve newest packets: $index = 0)
     * @param {Integer} $deviceId
     * @param {Integer} $offset [0 by default] Index of a packet in a row
     * @param {Integer} $count [1 by default] Number of a packets
     * @param {String} $dt [opt., now() by default] From a time
     * @param {Boolean} $orderDesc [opt., true by default] count from newest packets
     * @param {Boolean} $returnIncorrect [opt., true by default] include incorrect packets
     * @return {Falcon_Record_Mon_Packet}
     */
    public function getPacketsAtIndexFromDt($deviceId, $offset = 0, $count = 1,
                                            $dt = null, $orderDesc = true, $returnIncorrect = true)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_packet')
            ->where('id_device = ?', $deviceId)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->order('time ' . ($orderDesc ? 'desc' : 'asc'))
            ->limit($count, $offset);
        if ($dt !== null) {
            $sql->where('time <= ?', $dt);
        }
        if (!$returnIncorrect) {
            $sql->where('state != ?', Falcon_Record_Abstract::STATE_INCORRECT);
        }
        return $db->query($sql)->fetchAll();
    }

    /**
     * Returns packet at $index in a row before the specified time $dt,
     * inclusive. (To retrieve newest packet: $index = 0)
     * @param {Integer} $deviceId
     * @param {Integer} $num Number of a packet
     * @param {String} $dt From a time
     * @param {Boolean} $orderDesc [opt., true by default] count from newest packets
     * @param {Boolean} $returnIncorrect [opt., true by default] include incorrect packets
     * @return {Falcon_Record_Mon_Packet}
     */
    public function getPacketAtIndexFromDt($deviceId, $index = 0, $dt = null,
                                           $orderDesc = true, $returnIncorrect = true)
    {
        $result = $this->getPacketsAtIndexFromDt($deviceId, $index, 1,
            $dt, $orderDesc, $returnIncorrect);
        return (isset($result[0]) ? $result[0] : null);
    }

    /**
     * Returns first packet for device
     * @param {Integer} $deviceId
     * @return {Falcon_Record_Mon_Packet}
     */
    public function getFirstForDevice($deviceId)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_packet')
            ->where('id_device = ?', $deviceId)
            ->where('latitude > ?', 0)
            ->where('longitude > ?', 0)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->order('time asc')
            ->limit(1);
        $rows = $db->query($sql)->fetchAll();
        $rows = $this->tryToCastRowsToInt($rows);
        return reset($rows);
    }

    /**
     * Returns previous packet for specified packet if its normal
     * @param Integer $deviceId device
     * @param Integer $packetId packet identifier
     * @param Data $time packet time
     * @return Array[] | null if not found
     */
    public function getPreviousPacketIfNormal($deviceId, $packetId, $time)
    {
        $record = null;
        $maxId = $this->queryCell($this->sqlPrevMaxId, [
            $deviceId, $packetId, $time], 'maxid');
        $maxTime = $this->queryCell($this->sqlPrevMaxTime, [
            $deviceId, $packetId], 'maxtime');
        if ($maxId && $maxTime) {
            $record = $this->queryRow($this->sqlLastPacketIfNormal, [
                $deviceId, Falcon_Record_Abstract::STATE_ACTIVE, $maxId, $maxTime]);
        }
        return $record;
    }

    /**
     * Returns packets by "time" field
     * @param Integer $deviceId device
     * @param Data $time packet time
     */
    public function getDevicePacketsByTimeField($deviceId, $time)
    {
        return $this->query($this->sqlPacketByTimeField, [
            $deviceId, $time]);
    }

    /**
     * Gets SOS packets not written into events table yet
     * @return Falcon_Record_Mon_Packet[]
     */
    public function getNewSosPackets()
    {
        return $this->query($this->sqlGetNewSosPackets);
    }

    /**
     * Calculates odometer difference based on coords
     * @param {Float} startLat Starting packet latitude
     * @param {Float} startLon Starting packet longitude
     * @param {Float} endLat Ending packet latitude
     * @param {Float} endLon Ending packet longitude
     * @return {Float}
     */
    public function calculateRange($startLat, $startLon, $endLat, $endLon)
    {
        if (!is_numeric($startLon) || !is_numeric($startLat) ||
            !is_numeric($endLon) || !is_numeric($endLon)
        ) {
            return 0;
        }
        $line = $startLon . ' ' . $startLat . ',' . $endLon . ' ' . $endLat;
        if (!isset($this->rangeCache[$line])) {
            $lineString = 'SRID=4326;LINESTRING(' . $line . ')';
            $this->rangeCache[$line] =
                $this->queryCell($this->sqlCalculateOdometer, $lineString);
        }
        return $this->rangeCache[$line];
    }

    /**
     * Clears speed cache
     */
    public function dropSpeedCache()
    {
        $this->speedCache = [];
    }

    /**
     * Adds value to speed cache
     * @param $time
     * @param $speed
     */
    public function populateSpeedCache($time, $speed)
    {
        $this->speedCache[strtotime($time)] = $speed;
        ksort($this->speedCache);
    }

    /**
     * Retrieves time position in cache
     * @param Integer $deviceId
     * @param $time
     * @return Integer
     */
    public function getSpeedCachePosition($deviceId, $time)
    {
        $value = array_search(strtotime($time), array_keys($this->speedCache));
        if ($value && $value >= 10) {
            return $value;
        }

        $speeds = $this->query($this->sqlGetAverageSpeed,
            [$deviceId, $time, Falcon_Record_Abstract::STATE_DELETED]);
        foreach ($speeds as $item) {
            $this->populateSpeedCache($item['time'], $item['speed']);
        }

        $value = array_search(strtotime($time), array_keys($this->speedCache));
        return $value;
    }

    /**
     * Return average speed of previous packets
     * @param Integer $deviceId
     * @param String $time
     * @return {Float}
     */
    public function getAverageSpeedFrom($deviceId, $time)
    {
        $position = $this->getSpeedCachePosition($deviceId, $time);
        $speeds = array_slice($this->speedCache,
            max($position - 10, 0), max(10, $position));
        $countZero = 0;
        foreach ($speeds as $speed) {
            if ($speed == 0) {
                $countZero++;
            }
        }
        // Если часто встречаются нулевые скорости, то это сбоящая стоянка
        if (empty($speeds) || ($countZero * 2 > count($speeds))) {
            return 0;
        } else {
            return array_sum($speeds) / count($speeds);
        }
    }

    /**
     * Remove all packets for given device id
     * @param Integer $deviceId
     */
    public function clearPacketsForDevice($deviceId)
    {
        if (!$deviceId) {
            return;
        }

        $deviceId = (int)$deviceId;

        return $this->query(
            "delete from mon_packet where id_device = " . $deviceId);
    }

    /**
     * Set state of packets for specified device to ACTIVE
     * @param int $id
     * @param string $sdt
     * @param string $edt
     */
    public function activateDevicePackets($id, $sdt, $edt)
    {
        $this->query($this->sqlActivateDevicePackets, [$id, $sdt, $edt]);
    }
}
