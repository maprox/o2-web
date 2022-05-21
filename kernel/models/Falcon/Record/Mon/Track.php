<?php

/**
 * Table "mon_track" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Track extends Falcon_Record_Abstract
{
    const INCORRECT_TOLERANCE = 3;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'type',
        'sdt',
        'edt',
        'track',
        'odometer',
        'actual_odometer',
        'speed_max',
        'speed_average',
        'state'
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        $sdt = $this->get('sdt');
        $edt = $this->get('edt');
        $deviceId = $this->get('id_device');

        if (empty($deviceId) || empty($sdt) || empty($edt)) {
            return $this;
        }

        $packets = Falcon_Mapper_Mon_Packet::getInstance()->
        loadByDeviceByTimeField($deviceId, $sdt, $edt, [[
            'property' => 'time',
            'direction' => 'ASC'
        ]], true, true);

        // У стоянок должен быть адрес, для отчетов
        // Запросим адрес для первого пакета
        if ($packets && $this->get('type') != 'moving') {
            $packet = $packets[0];
            if (empty($packet['address'])) {
                Falcon_Amqp::sendTo('mon.packet', 'update.address',
                    ['id' => $packet['id']]);
            }
        }

        $this->buildTrack($packets);
        $this->calculateOdometer($packets);
        $this->calculateSpeed($packets);

        return parent::insert();
    }

    /**
     * Создает объект geography при использовании Postgis
     * @param {Mixed[][]} $packets - пакеты трека
     */
    public function buildTrack($packets)
    {
        $mode = $this->get('type');
        $matrix = [];
        $prevPacket = false;

        foreach ($packets as $packet) {
            if (
                $mode == 'moving'
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

            // temporarily check - remove later
            if (
                ((float)$packet['lng'] < -180) ||
                ((float)$packet['lng'] > 180) ||
                ((float)$packet['lat'] < -90) ||
                ((float)$packet['lat'] > 90)
            ) {
                continue;
            }

            $matrix[] = $packet;
            $prevPacket = $packet;
        }

        if (empty($matrix)) {
            return $this;
        }

        if ($mode != 'moving') {
            $track = $this->getMapper()->buildSleepTrack($matrix);
        } else {
            $track = $this->getMapper()->buildTrack($matrix);
        }
        $this->set('track', $track);
    }

    /**
     * Рассчитывает одометр трека из начального и конечного пакета.
     * @param {Mixed[][]} $packets - пакеты трека
     */
    protected function calculateOdometer($packets)
    {
        /*		$simple = true;
                foreach ($packets as $packet)
                {
                    if ($packet['odometer_forced'] == 1)
                    {
                        $simple = false;
                        break;
                    }
                }
                if ($simple)
                { */
        $startPacket = array_shift($packets);
        $endPacket = array_pop($packets);

        if (
            ($startPacket['odometer'] != null)
            && ($endPacket['odometer'] != null)
        ) {
            $this->set('odometer',
                abs($startPacket['odometer'] - $endPacket['odometer']));
        }
        /*		}
                else
                {
                    $result = 0;
                    foreach ($packets as $index => $packet)
                    {
                        if ($index == 0)
                        {
                            continue;
                        }

                        $prev = $packets[$index - 1];

                        if ($packet['odometer_forced'] == 1)
                        {
                            if ($prev['val'] <= $packet['val'])
                            {
                                $diff = $packet['val'] - $prev['val'];
                            }
                            else
                            {
                                $diff = $packet['val'];
                            }
                        }
                        else
                        {
                            $diff = $packet['odometer'] - $prev['odometer'];
                        }

                        $result = $result + $diff;
                    }

                    $this->set('odometer', $result);
                }*/
    }

    /**
     * Рассчитывает скорости трека исходя из пакетов.
     * @param {Mixed[][]} $packets - пакеты трека
     */
    protected function calculateSpeed($packets)
    {
        $maxSpeed = 0;
        $averageSpeed = [];

        foreach ($packets as $item) {
            $maxSpeed = max($maxSpeed, $item['speed']);
            $averageSpeed[] = $item['speed'];
        }

        $averageSpeed = $averageSpeed ?
            array_sum($averageSpeed) / count($averageSpeed) : 0;

        $this->set('speed_max', $maxSpeed);
        $this->set('speed_average', $averageSpeed);
    }

    /**
     * Возвращает продолжительность трека
     */
    public function getTime()
    {
        return strtotime($this->get('edt')) - strtotime($this->get('sdt'));
    }
}
