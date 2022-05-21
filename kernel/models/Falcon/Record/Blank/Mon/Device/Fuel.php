<?php

/**
 * Class for preparing fuel data
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Blank_Mon_Device_Fuel
    extends Falcon_Record_Blank_Abstract
{
    /*
     * Текстовые обозначения типов трека, для записи в базу.
     * @cfg {String}
     */
    const
        REFUEL = 'refuel',
        USAGE = 'usage',
        DRAIN = 'drain';

    const
        MINIMAL_USAGE_PERIOD = 300,
        MINIMAL_USAGE_PACKETS = 5,
        MIN_MOVING_SPEED = 2.0,
        MAX_LITER_PER_SECOND_CONSUMPTION = 0.01;

    /**
     * Определяет тип пакета
     * @param $packet
     * @return mixed
     */
    public function getPacketType($packet)
    {
        $type = self::USAGE;

        $usageSpeed = $packet['used'] / max($packet['seconds'], 1);

        if ($usageSpeed < 0) {
            if (
                $packet['speed'] < self::MIN_MOVING_SPEED
                || abs($packet['used']) > $this->getMinRefuel() * 3
            ) {
                $type = self::REFUEL;
            }
        }

        if ($usageSpeed > $this->getMinDrainSpeed()) {
            if ($packet['speed'] < self::MIN_MOVING_SPEED) {
                $type = self::DRAIN;
            }
        }

        return $type;
    }

    /**
     * @return float
     */
    protected function getMinDrainSpeed()
    {
        return $this->getMinDrain() / 3600;
    }

    /**
     * @return float
     */
    protected function getMinDrain()
    {
        return Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->getOption($this->device, 'minimal_drain');
    }

    /**
     * @return float
     */
    protected function getMinRefuelSpeed()
    {
        return $this->getMinRefuel() / 3600;
    }

    /**
     * Отбирает некорректные пакеты с конца отрезка, если такие есть
     * @return mixed[]
     */
    public function getAbnormal()
    {
        $packets = $this->getPackets(true, false);
        $packets = array_reverse($packets);
        $abnormal = [];
        $buffer = [];
        foreach ($packets as $packet) {
            if (
                ($packet['used'] > 0 && $this->isRefuel())
                || ($packet['used'] < 0 && !$this->isRefuel())
            ) {
                $abnormal = array_merge($abnormal, $buffer);
                $buffer = [];
                $abnormal[] = $packet;
            } elseif ($packet['used'] == 0) {
                $buffer[] = $packet;
            } else {
                break;
            }
        }

        if (!empty($abnormal)) {
            $unset = $abnormal;
            array_pop($unset);
            foreach ($unset as $packet) {
                unset($this->packets[$packet['id']]);
            }
            $this->dropData();
        }

        return $abnormal;
    }

    /**
     * Отбирает некорректные пакеты с начала отрезка использования, если такие есть
     * @return mixed[]
     */
    public function getAbnormalFromStart()
    {
        if (!$this->isUsage()) {
            return [];
        }

        $packets = $this->getPackets(true);
        $startFuel = $packets[0]['val'];
        $count = min(max(20, ceil(count($packets) / 10)), 100);
        $searchPeak = array_slice($packets, 0, $count);

        $max = $startFuel;
        $maxKey = 0;
        foreach ($searchPeak as $key => $packet) {
            if ($packet['val'] > $max) {
                $max = $packet['val'];
                $maxKey = $key;
            }
        }

        if (!$maxKey) {
            return [];
        }

        $afterPeak = array_slice($packets, $maxKey);
        $time = 0;
        foreach ($afterPeak as $packet) {
            if ($packet['val'] > $startFuel) {
                $time += $packet['seconds'];
            } else {
                break;
            }
        }

        if ($time < 900) {
            return [];
        }

        $abnormal = array_slice($packets, 0, $maxKey + 1);

        foreach ($abnormal as $packet) {
            unset($this->packets[$packet['id']]);
        }
        $this->dropData();
        return $abnormal;
    }

    /**
     * @return float
     */
    protected function getMinRefuel()
    {
        return Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->getOption($this->device, 'minimal_refuel');
    }

    /*
     * Возвращает вес трека, рассчитывает если еще не рассчитан.
     * @return {Float}
     */
    public function getWeight()
    {
        if ($this->weight === null) {
            list($period, $used, $count) = $this->getPacketData();
            if ($this->isRefuel()) {
                $this->weight = sqrt($count * $period) * max($used * -1, 0);
            } elseif ($this->isDrain()) {
                $this->weight = sqrt($count * $period) * max($used, 0);
            } else {
                $this->weight = sqrt(max($used, 0) * $period) * $count;
            }
        }

        return $this->weight;
    }

    /*
     * Возвращает, удовлетворяет ли трек
     * минимальным требованиям согласно своему типу.
     * @return {Boolean}
     */
    public function isSatisfactory()
    {
        list($period, $used, $count) = $this->getPacketData();

        if ($this->isUsage()) {
            return $period > self::MINIMAL_USAGE_PERIOD &&
            $count > self::MINIMAL_USAGE_PACKETS &&
            $used >= 0;
        }

        if ($this->isDrain()) {
            $usageSpeed = $used / max($period, 1);
            return $used > $this->getMinDrain() &&
            ($usageSpeed > $this->getMinDrainSpeed());
        }

        return ($used * -1) > $this->getMinRefuel();
    }

    /**
     * Возвращает все пакеты участка.
     * @param bool $sorted
     * @param bool $pop
     * @return Mixed[][]
     */
    public function getPackets($sorted = false, $pop = true)
    {
        $packets = parent::getPackets();

        if ($sorted) {
            usort($packets, function ($a, $b) {
                if ($a['time_sec'] == $b['time_sec']) {
                    return $a['id'] > $b['id'];
                }
                return $a['time_sec'] > $b['time_sec'];
            });

            if ($pop) {
                array_pop($packets);
            }
        }

        return $packets;
    }

    /*
     * Возвращает, заправка ли это.
     * @return {Boolean}
     */
    public function isRefuel()
    {
        return $this->type == self::REFUEL;
    }

    /*
     * Возвращает, слив ли это.
     * @return {Boolean}
     */
    public function isDrain()
    {
        return $this->type == self::DRAIN;
    }

    /*
     * Возвращает, поездка ли это
     * @return {Boolean}
     */
    public function isUsage()
    {
        return !$this->isDrain() && !$this->isRefuel();
    }

    /*
     * Возвращает, тип отрезка
     * @return {String}
     */
    public function getType()
    {
        return $this->type;
    }

    /*
     * Returns a record for writing to the database
     * @return {Falcon_Record_Mon_Device_Fuel}
     */
    public function getRecord()
    {
        list($period, $used, $count) = $this->getPacketData();

        $last = $this->getLastPacketKey();
        $edt = $this->packets[$last]['time'];
        $first = $this->getFirstPacketKey();
        $sdt = $this->packets[$first]['time'];

        $tank_number = isset($this->params['tank_number'])
            ? $this->params['tank_number'] : 1;
        $return = new Falcon_Record_Mon_Device_Fuel([
            'type' => $this->getType(),
            'id_device' => $this->device,
            'sdt' => $sdt,
            'edt' => $edt,
            'amount' => abs($used),
            'tank_number' => $tank_number
        ]);

        return $return;
    }

    /*
     * Возвращает объекты пакетов для записи в бд.
     * @return {Falcon_Record_Mon_Packet_Fuel[]}
     */
    public function getPacketRecords()
    {
        $insert = [];
        $update = [];

        $packets = $this->getPackets(true);
        if (empty($packets)) {
            return [$insert, $update];
        }

        $items = [];
        foreach ($packets as $packet) {
            $items[] = [
                'id' => $packet['id'],
                'speed' => $packet['speed'],
                'val' => $packet['val'],
                'time' => $packet['time_sec'],
                'curr_val' => $packet['fuel'],
                'curr_state' => $packet['fuel_state'],
            ];
        }
        unset($packets);

        $vector = $this->isRefuel() ? 1 : -1;
        $last = count($items) - 1;
        $lastVal = $items[$last]['val'];
        $firstVal = $items[0]['val'];
        $firstTime = $items[0]['time'];

        $trusted = [
            $firstTime => $firstVal,
        ];
        $lastTrusted = $firstTime;

        for ($i = 1; $i < $last - 1; $i++) {
            $val = $items[$i]['val'];
            $curTime = $items[$i]['time'];
            $trustedKeys = array_keys($trusted);

            if (($firstVal - $val) * $vector > 0) {
                continue;
            }
            if (($val - $lastVal) * $vector > 0) {
                continue;
            }

            if ($this->isUsage()) {
                $time = max($curTime - $lastTrusted, 1);
                $used = $val - $trusted[$lastTrusted];
                if (abs($used / $time) > self::MAX_LITER_PER_SECOND_CONSUMPTION) {
                    continue;
                }
            }

            if (($trusted[$lastTrusted] - $val) * $vector > 0) {
                $conflicting = $items[$i - 1]['val'];
                $before = [$items[$i - 1]['time']];
                $countBefore = 1;

                while (!empty($trustedKeys) && $countBefore < 1000) {
                    $lastTrusted = array_pop($trustedKeys);
                    if (($trusted[$lastTrusted] - $val) * $vector > 0) {
                        $before[] = $lastTrusted;
                        $countBefore++;
                    } else {
                        break;
                    }
                }
                $countAfter = 1;
                for ($j = $i + 2; $j < $last - 1 && $countAfter < 1000; $j++) {
                    if (($conflicting - $items[$j]['val']) * $vector > 0) {
                        $countAfter++;
                    } else {
                        break;
                    }
                }
                if ($countAfter > $countBefore) {
                    foreach ($before as $time) {
                        if (isset($trusted[$time])) {
                            unset($trusted[$time]);
                        }
                    }
                } else {
                    continue;
                }
            }

            $trusted[$curTime] = $val;
            $lastTrusted = $curTime;
        }
        $trusted[$items[$last]['time']] = $lastVal;

        ksort($trusted);
        $times = array_keys($trusted);
        $countTimes = count($times);

        foreach ($items as &$item) {
            if (isset($trusted[$item['time']])) {
                continue;
            }

            $first = 0;
            $key = (int)floor($countTimes / 2);
            $last = $countTimes - 1;
            $counter = 0;

            while ($first != $key && $last != $key && ++$counter < 100) {

                if (isset($times[$key]) && ($times[$key] > $item['time'])) {
                    $last = $key;
                    $key = (int)floor($key / 2 + $first / 2);
                } else {
                    $first = $key;
                    $key = (int)floor($key / 2 + $last / 2);
                }
            }
            $prevTime = $times[$first];
            $nextTime = $times[$last];

            $prevVal = $trusted[$prevTime];
            $nextVal = $trusted[$nextTime];
            $item['val'] = ($nextVal * ($item['time'] - $prevTime) +
                    $prevVal * ($nextTime - $item['time'])) /
                ($nextTime - $prevTime);
        }
        unset($item);
        unset($trusted);

        $tank_number = isset($this->params['tank_number'])
            ? $this->params['tank_number'] : 1;
        foreach ($items as $item) {
            $item['state'] = isset($trusted[$item['time']]) ?
                Falcon_Record_Abstract::STATE_ACTIVE :
                Falcon_Record_Abstract::STATE_INCORRECT;

            $record = new Falcon_Record_Mon_Packet_Fuel([
                'id_packet' => $item['id'],
                'val' => $item['curr_val'],
                'state' => $item['curr_state'],
                'tank_number' => $tank_number
            ], false, false);

            $changed = false;
            if (round($item['curr_val'], 2) != round($item['val'], 2)) {
                $record->set('val', $item['val']);
                $changed = true;
            }
            if ($item['curr_state'] != $item['state']) {
                $record->set('state', $item['state']);
                $changed = true;
            }
            if ($changed) {
                if ($item['curr_state']) {
                    $update[] = $record;
                } else {
                    $insert[] = $record;
                }
            }
        }

        return [$insert, $update];
    }

    /*
     * Возвращает основные данные о треке.
     * Продолжительность, пробег, количество пакетов.
     * @return {Float[]}
     */
    protected function getPacketData()
    {
        if ($this->packetData === null) {
            $first = $this->getFirstPacketKey();
            $last = $this->getLastPacketKey();

            $used = 0;
            $count = 0;
            foreach ($this->getPackets() as $key => $packet) {
                // We don't count last packet - it belongs to
                // another item and needed in here for edt only
                if ($key == $last) {
                    continue;
                }

                $used += $packet['used'];
                $count++;
            }

            $minTime = $this->packets[$first]['time_sec'];
            $maxTime = $minTime;
            foreach ($this->packets as $packet) {
                $maxTime = max($maxTime, $packet['time_sec']);
            }

            $this->packetData = [$maxTime - $minTime, $used, $count];
        }

        return $this->packetData;
    }
}
