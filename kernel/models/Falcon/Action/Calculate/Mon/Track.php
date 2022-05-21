<?php

/**
 * Класс производящий вычисления отрезков информации для истории поездок
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Calculate_Mon_Track extends Falcon_Action_Calculate_Abstract
{
    protected $walking = false;

    public function __construct($device, $sdt, $options = [])
    {
        parent::__construct($device, $sdt, $options);

        $deviceRecord = new Falcon_Record_Mon_Device($this->getDevice());

        // @TODO: обозначить пешеходные протоколы нормально
        if ($deviceRecord->get('protocol') == 9) {
            $this->walking = true;
        }
    }

    protected function getUnsetRecords()
    {
        $tracks = parent::getUnsetRecords();

        // Если есть треки попадающие на это время, схватим
        // выпавший и предыдущий по отношению к нему
        if (!empty($tracks)) {
            $prevTrack = Falcon_Mapper_Mon_Track::getInstance()->load([
                'id_device = ?' => $this->getDevice(),
                'edt = ?' => $tracks[0]->get('sdt')
            ], 'sdt');
            $tracks = array_merge($prevTrack, $tracks);
        }

        return $tracks;
    }

    protected function processPackets($packets)
    {
        if (count($packets) < 2) {
            $this->setRecords = [new Falcon_Record_Mon_Track([
                'id_device' => $this->getDevice(),
                'type' => 'sleep',
                'sdt' => $this->getSdt(),
                'edt' => $this->getEdt()
            ])];
            return;
        }

        $config = Zend_Registry::get('config');
        $config = $config->tracks;

        $maxTimeBetween = $config->max_time_between;
        $setting = Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->load([
                'id_device = ?' => $this->getDevice(),
                'option = ?' => 'freq_idle'
            ]);
        if (!empty($setting) && $setting[0]->get('value')) {
            $val = $setting[0]->get('value');
            $maxTimeBySettings = $val + max($val * $config->freq_idle_coeff,
                    $config->min_freq_idle_shift);
            $maxTimeBetween = max($maxTimeBetween, $maxTimeBySettings);
        }

        $maxDistance = $config->max_distance;
        $setting = Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->load([
                'id_device = ?' => $this->getDevice(),
                'option = ?' => 'max_distance'
            ]);
        if (!empty($setting) && $setting[0]->get('value')) {
            $val = $setting[0]->get('value');
            $maxDistance = $val;
        }

        $trackIgnoresSpeed = false;
        $setting = Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->load([
                'id_device = ?' => $this->getDevice(),
                'option = ?' => 'track_ignores_speed'
            ]);
        if (!empty($setting) && $setting[0]->get('value')) {
            $trackIgnoresSpeed = !!$setting[0]->get('value');
        }

        $prevPacket = array_shift($packets);
        $prevPacket['moved'] = 0;
        $chunks = [[$prevPacket]];

        foreach ($packets as &$packet) {
            $time = strtotime($packet['time']) - strtotime($prevPacket['time']);
            $moved = $this->getDistance($prevPacket, $packet);

            $packet['moved'] = $moved;

            if ($this->walking) {
                $packet['speed'] = ($moved * 3.6) / max($time, 1);
            }

            if ($time > $maxTimeBetween || $moved > $maxDistance) {
                $prevPacket['break'] = true;
                array_unshift($chunks, [$prevPacket, $packet]);
                array_unshift($chunks, []);
            }

            $chunks[0][] = $packet;
            $prevPacket = $packet;
        }

        $chunks = array_reverse($chunks);

        $tracks = [];
        foreach ($chunks as $chunk) {
            if (count($chunk) > 1) {
                $tracks = array_merge($tracks, $this->makeTracks(
                    $chunk, $this->getDevice()));
            }
        }

        $count = count($tracks);
        for ($key = 0; $key < $count - 1; $key++) {
            $first = $tracks[$key];
            $second = $tracks[$key + 1];

            if ($first->isSleep() && $second->isSleep()) {
                $second->merge($first);
                unset($tracks[$key]);
            }
        }

        foreach ($tracks as $track) {
            $trackRecord = $track->getRecord();
            $this->setRecords[] = $trackRecord;
            try {
                if ($trackIgnoresSpeed && !$track->isSleep()) {
                    // let's set state of all of the packets in track to ACTIVE
                    $packetsMapper = Falcon_Mapper_Mon_Packet::getInstance();
                    $packetsMapper->activateDevicePackets($this->getDevice(),
                        $trackRecord->get('sdt'), $trackRecord->get('edt'));
                }
            } catch (Exception $e) {
                Falcon_Logger::getInstance()->log('activate_packets_error',
                    'Error during packets activation', $e);
            }
        }
    }

    /**
     * Save results to database
     */
    protected function writeResults()
    {
        $lastTrack = end($this->setRecords);
        if ($lastTrack->get('type') == 'sleep') {
            $lastTrack->set('edt', $this->getEdt());
        } else {
            $this->setRecords[] = new Falcon_Record_Mon_Track([
                'type' => 'sleep',
                'sdt' => $lastTrack->get('edt'),
                'edt' => $this->getEdt(),
                'id_device' => $lastTrack->get('id_device'),
            ]);
        }

        parent::writeResults();

        Falcon_Mapper_Mon_Track::getInstance()->calculateOdometer();
    }

    /*
     * Рассчитывает расстояние между двумя пакетами, в метрах
     * @param {Mixed} $packet1
     * @param {Mixed} $packet2
     * @return {Float}
     */
    protected function getDistance($packet1, $packet2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($packet2['latitude'] - $packet1['latitude']);
        $dLon = deg2rad($packet2['longitude'] - $packet1['longitude']);

        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($packet1['latitude'])) *
            cos(deg2rad($packet2['latitude'])) * sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * asin(sqrt($a));
        $d = $earthRadius * $c;

        return $d * 1000;
    }

    /*
     * Разбивает группу пакетов на треки
     * @param {Mixed[][]} $packets
     * @return Falcon_Record_Blank_Mon_Track[]
     */
    protected function makeTracks($packets, $deviceId)
    {
        $tracks = [new Falcon_Record_Blank_Mon_Track($deviceId)];
        foreach ($packets as $key => $packet) {
            $sameType = $tracks[0]->addPacket($packet);

            if (!$sameType && isset($packets[$key + 1])) {
                array_unshift($tracks,
                    new Falcon_Record_Blank_Mon_Track($deviceId, $packet));
            }
        }

        $tracks = array_reverse($tracks);

        $haveUnglued = true;
        while ($haveUnglued) {
            $mergeWeights = [];
            $tracks = array_values($tracks);

            for ($key = 0; $key < count($tracks) - 2; $key++) {
                $first = $tracks[$key];
                $second = $tracks[$key + 1];
                $third = $tracks[$key + 2];

                if ($second->isSatisfactory()) {
                    continue;
                }

                $mergeWeights[] = [$key, $key + 1, $key + 2,
                    $first->getWeight() * $third->getWeight() / $second->getWeight()];
            }

            $haveUnglued = count($mergeWeights) > 0;
            usort($mergeWeights, function ($a, $b) {
                return $a[3] > $b[3] ? -1 : 1;
            });

            if ($haveUnglued) {
                $weight = array_shift($mergeWeights);
                $tracks[$weight[0]]->merge($tracks[$weight[1]])
                    ->merge($tracks[$weight[2]]);
                unset($tracks[$weight[1]]);
                unset($tracks[$weight[2]]);
            }
        }

        $tracks = array_values($tracks);
        $last = count($tracks) - 1;

        if (
            isset($tracks[0]) && isset($tracks[1])
            && !$tracks[0]->isSatisfactory()
        ) {
            $tracks[1]->merge($tracks[0]);
            unset($tracks[0]);
        }

        if (
            isset($tracks[$last]) && isset($tracks[$last - 1])
            && !$tracks[$last]->isSatisfactory()
        ) {
            $tracks[$last - 1]->merge($tracks[$last]);
            unset($tracks[$last]);
        }

        $tracks = array_values($tracks);

        // Если у нас в группе один-единственный трек движения, то он может избежать
        // проверок выше и остаться треком движения не выполняя минимальных условий
        // Подстрахуемся
        if (
            count($tracks) == 1
            && $tracks[0]->isMoving()
            && !$tracks[0]->isSatisfactory()
        ) {
            $tracks[0]->setSleep(true);
        }

        for ($key = 0; $key < count($tracks) - 1; $key++) {
            $first = $tracks[$key];
            $second = $tracks[$key + 1];
            if ($first->isSleep() && $second->isMoving()) {
                $packet = $first->popLastPacket();
                $second->addPacket($packet);
            }
        }

        return $tracks;
    }
}
