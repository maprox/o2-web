<?php

/**
 * Class for preparing tracks
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Blank_Mon_Track extends Falcon_Record_Blank_Abstract
{
    /*
     * Коэффиценты использующиеся для расчета веса треков.
     * @cfg {Float}
     */
    const
        MIN_MOVING_SPEED = 1,
        INCORRECT_COUNT_COEFF = 0.3,
        PERIOD_COEFF = 0.2,
        MAX_MOVED = 1000,
        MAX_PERIOD = 3600;

    /**
     * Определяет тип пакета
     * @param $packet
     * @return mixed
     */
    protected function getPacketType($packet)
    {
        $packetIsSleep = (
            (float)$packet['speed'] < self::MIN_MOVING_SPEED
            || !empty($packet['break'])
        );

        return $packetIsSleep ? 'sleep' : 'moving';
    }

    /*
     * Возвращает вес трека, рассчитывает если еще не рассчитан.
     * @return {Float}
     */
    public function getWeight()
    {
        if ($this->weight === null) {
            if ($this->isSleep()) {
                $this->weight = $this->calculateWeightSleep();
            } else {
                $this->weight = $this->calculateWeightMoving();
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
        list($period, $moved, $count) = $this->getPacketData();
        $config = Zend_Registry::get('config');
        $config = $config->tracks;

        // Если стоянка, достаточно только проверить время
        if ($this->isSleep()) {
            return $period > $config->min_stop_time;
        }

        $countActivePackets = 0;
        foreach ($this->getPackets() as $packet) {
            if ($packet['state'] == Falcon_Record_Abstract::STATE_ACTIVE) {
                $countActivePackets++;
            }
        }

        return (
            $countActivePackets > 1
            && $moved > $config->track_sure_length
            && $period > $config->min_track_time
        );
    }

    /*
     * Возвращает, стоянка ли это.
     * @return {Boolean}
     */
    public function isSleep()
    {
        return $this->type == 'sleep';
    }

    /*
     * Возвращает, движение ли это.
     * @return {Boolean}
     */
    public function isMoving()
    {
        return !$this->isSleep();
    }

    /*
     * Удаляет последний пакет трека, возвращает новый последний пакет.
     * @return {Mixed[]}
     */
    public function popLastPacket()
    {
        $key = $this->getLastPacketKey();
        unset($this->packets[$key]);
        $this->dropData();
        $key = $this->getLastPacketKey();
        return $this->packets[$key];
    }

    /*
     * Returns a record for writing to the database
     * @return {Falcon_Record_Mon_Track}
     */
    public function getRecord()
    {
        $last = $this->getLastPacketKey();
        $edt = $this->packets[$last]['time'];
        $first = $this->getFirstPacketKey();
        $sdt = $this->packets[$first]['time'];

        $return = new Falcon_Record_Mon_Track([
            'type' => $this->type,
            'sdt' => $sdt,
            'edt' => $edt,
            'id_device' => $this->device
        ]);

        return $return;
    }

    /*
     * Устанавливает, является ли трек стоянкой.
     * @param {Boolean} $isSleep
     */
    public function setSleep($isSleep)
    {
        $this->type = $isSleep ? 'sleep' : 'moving';
        $this->dropData();
    }

    /*
     * Рассчитывает вес для трека-стоянки.
     * @return {Float}
     */
    protected function calculateWeightSleep()
    {
        list($period, $moved, $count) = $this->getPacketData();
        $period = min($period, self::MAX_PERIOD) * self::PERIOD_COEFF + 2;
        $count = $count + 2;

        return log10($count) * $period;
    }

    /*
     * Рассчитывает вес для трека-движения.
     * @return {Float}
     */
    protected function calculateWeightMoving()
    {
        list($period, $moved, $count) = $this->getPacketData();
        $moved = min($moved, self::MAX_MOVED) + 1;
        $count = $count + 2;

        return log10($count) * $moved;
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

            $moved = 0;
            $count = 0;
            foreach ($this->packets as $key => $packet) {
                if (
                    $packet['state'] == Falcon_Record_Abstract::STATE_ACTIVE
                    // ignore first packet movement
                    && $key != $first
                ) {
                    $moved += $packet['moved'];
                }

                $count +=
                    ($packet['state'] == Falcon_Record_Abstract::STATE_ACTIVE) ?
                        1 : self::INCORRECT_COUNT_COEFF;
            }

            $minTime = strtotime($this->packets[$first]['time']);
            $maxTime = $minTime;
            foreach ($this->packets as $key => $packet) {
                if ($last == $key) {
                    continue;
                }
                $maxTime = max($maxTime, strtotime($packet['time']));
            }

            $this->packetData = [$maxTime - $minTime, $moved, $count];
        }

        return $this->packetData;
    }
}
