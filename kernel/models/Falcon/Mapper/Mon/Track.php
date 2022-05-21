<?php

/**
 * Class of "mon_track" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Track extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $data = $this->getTable()->loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);

        $lastTrack = end($data);
        if ($lastTrack['type'] == 'sleep' && empty($lastTrack['track'])) {
            array_pop($data);
        }

        foreach ($data as &$item) {
            $item['track'] = $this->getTable()->convertTrack($item['track']);
            if (!preg_match_all('/(\d+\.\d+)\s+(\d+\.\d+)[,\)]/',
                $item['track'], $item['track'], PREG_SET_ORDER)
            ) {
                $item['track'] = [];
                continue;
            }

            foreach ($item['track'] as &$point) {
                $point = [
                    'lng' => (float)$point[1],
                    'lat' => (float)$point[2],
                ];
            }
        }

        return $data;
    }

    /**
     * Get moving summary
     * @param type $idDevice
     * @param type $sdt
     * @param null $idUser
     * @param null $edt
     * @param null $shift
     */
    public function getMovingSummary($idDevice, $sdt, $edt, $idUser = null,
                                     $shift = null)
    {
        return $this->getTable()->getMovingSummary($idDevice, $sdt, $edt,
            $idUser = null, $shift = null);
    }

    /**
     * Returns last track edt for device
     * @param int $deviceId
     * @return {String}
     */
    public function getEdtForDevice($deviceId)
    {
        $edt = $this->getTable()->getEdtForDevice($deviceId);
        if (!empty($edt)) {
            return $edt;
        }

        $packet = Falcon_Mapper_Mon_Packet::getInstance()
            ->getFirstForDevice($deviceId);

        if (empty($packet)) {
            return false;
        }

        return $packet->get('time');
    }

    /**
     * Создает объект geography при использовании Postgis
     * @param {Float[][]} $matrix Матрица lng/lat точек пути
     * @return {String}
     */
    public function buildTrack($matrix)
    {
        return $this->getTable()->buildTrack($matrix);
    }

    /**
     * Создает объект geography для стоянки при использовании Postgis
     * @param {Float[][]} $matrix Матрица lng/lat точек пути
     * @return {String}
     */
    public function buildSleepTrack($matrix)
    {
        return $this->getTable()->buildSleepTrack($matrix);
    }

    /**
     * Обновляет пустые одометры, вычисляя их из трека
     */
    public function calculateOdometer()
    {
        $this->getTable()->calculateOdometer();
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('mon_device', 'mon_device.id = t.id_device', []);
        }
        return 'mon_device';
    }

    /**
     * Возвращает следующий трек, требующий обновления
     * @return {Falcon_Record_Mon_Track}
     */
    public function getNextNotUpdated()
    {
        $tracks = $this->load(['state = ?' => 0]);
        if (empty($tracks)) {
            return false;
        }
        return array_shift($tracks);
    }

    /**
     * Recalculates odometer values of track from given timestamp
     */
    public function recalculateFrom($deviceId, $sdt)
    {
        $tracks = $this->load([
            'id_device = ?' => $deviceId, 'sdt >= ?' => $sdt]);
        foreach ($tracks as $track) {
            $odometer = 0;
            $packets = Falcon_Mapper_Mon_Packet::getInstance()->load([
                'id_device = ?' => $deviceId,
                'time >= ?' => $track->get('sdt'),
                'time <= ?' => $track->get('edt'),
            ], 'time', true);
            if ($packets) {
                $first = reset($packets);
                $last = end($packets);
                $odometer = abs($last['odometer'] - $first['odometer']);
            }
            $track->set('odometer', $odometer);
            $track->update();
        }
        $this->recalculateActualOdometer($deviceId);
    }

    /**
     * Recalculates actual odometer field
     */
    public function recalculateActualOdometer($deviceId)
    {
        $this->getTable()->recalculateActualOdometer($deviceId);
    }

    /**
     * Rebuild all "track" columns in mon_track table
     * See issue #1618: ERROR: missing chunk number 0 for toast value
     * @param {Number} $from unix timestamp
     * @param {Number} $to unix timestamp
     */
    public function rebuildBrokenTracks($from, $to)
    {
        $from = date(DB_DATE_FORMAT, $from);
        $to = date(DB_DATE_FORMAT, $to);
        Falcon_Logger::getInstance()->log('rebuild_tracks', $from, $to);

        $data = $this->getTable()->loadBy(
            function ($sql) use ($from, $to) {
                $sql->where('sdt >= ?', $from);
                $sql->where('sdt < ?', $to);
            }, [
                'fields' => [
                    'id',
                    'id_device',
                    'type',
                    'sdt',
                    'edt'
                ]
            ]
        );
        foreach ($data as $row) {
            $trackId = $row['id'];
            $deviceId = $row['id_device'];
            $sdt = $row['sdt'];
            $edt = $row['edt'];
            $packets = Falcon_Mapper_Mon_Packet::getInstance()->
            loadByDeviceByTimeField($deviceId, $sdt, $edt, [[
                'property' => 'time',
                'direction' => 'ASC'
            ]], true, true);

            $mode = $row['type'];
            $matrix = [];
            $prevPacket = false;

            foreach ($packets as $packet) {
                if ($mode == Falcon_Action_Mon_Track::MOVING
                    && $packet['state'] != Falcon_Record_Abstract::STATE_ACTIVE
                ) {
                    continue;
                }
                $packet = [
                    'lng' => $packet['longitude'],
                    'lat' => $packet['latitude']
                ];
                if ($packet === $prevPacket) {
                    continue;
                }
                $matrix[] = $packet;
                $prevPacket = $packet;
            }

            $track = null;
            if (!empty($matrix)) {
                if ($mode != Falcon_Action_Mon_Track::MOVING) {
                    $track = $this->buildSleepTrack($matrix);
                } else {
                    $track = $this->buildTrack($matrix);
                }
            }
            $this->getTable()->query(
                'update mon_track set track = ? ' .
                'where id = ' . $trackId, $track
            );
        }
    }
}
