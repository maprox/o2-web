<?php

/**
 * Класс производящий вычисления отрезков информации для отчета по топливу
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Calculate_Mon_Device_Ignition extends Falcon_Action_Calculate_Abstract
{
    const
        MIN_ON_AVERAGE_SPEED = 3,
        MIN_ON_SPEED = 1,
        MIN_OFF_SECONDS = 60,
        MIN_OFF_PACKETS = 5;

    /*
     * Настройки для загрзуки пакетов маппером
     * @cfg {Mixed[]}
     */
    protected $loadOptions = [
        'fields' => ['id', 'time', 'speed', 'time',
            'mon_packet_sensor.val as val']
    ];

    protected function preparePackets($packets)
    {
        if (empty($packets)) {
            return $packets;
        }

        $averageLength = min(10, count($packets) - 1);
        $keys = array_keys($packets);
        $last = end($keys);

        $averagePool = array_fill(0, $averageLength + 1, $packets[0]['speed']);
        for ($i = 0; $i < $averageLength; $i++) {
            $averagePool[] = $packets[$i]['speed'];
        }

        foreach ($packets as $key => &$packet) {
            $packet['seconds'] = isset($packets[$key - 1]) ?
                strtotime($packet['time']) - strtotime($packets[$key - 1]['time'])
                : 0;

            array_shift($averagePool);
            $averagePool[] = isset($packets[$key + $averageLength]) ?
                (float)$packets[$key + $averageLength]['speed'] :
                $packets[$last]['speed'];

            if ($packet['val']) {
                $average = array_sum($averagePool) / count($averagePool);
                if (
                    $average < self::MIN_ON_AVERAGE_SPEED
                    || $packet['speed'] < self::MIN_ON_SPEED
                ) {
                    $packet['val'] = 0;
                }
            }
        }

        return $packets;
    }

    protected function processPackets($packets)
    {
        $this->setRecords = $this->makeRecords($packets, $this->getDevice());
    }

    public function joinAdditionalData($sql)
    {
        parent::joinAdditionalData($sql);

        $options = $this->getOptions();

        $sql->join('mon_packet_sensor',
            'mon_packet_sensor.id_packet = t.id', []);
        $sql->where('mon_packet_sensor.id_device_sensor = ?',
            $options['sensor']);
        $sql->where('mon_packet_sensor.val is not null');
    }

    /*
     * Разбивает группу пакетов на части
     * @param {Mixed[][]} $packets
     * @return Falcon_Record_Mon_Device_Ignition[]
     */
    protected function makeRecords($packets, $deviceId)
    {
        $chunks = [[]];
        foreach ($packets as $key => $packet) {
            $last = end($chunks[0]);
            $sameType = !$last || $last['val'] == $packet['val'];
            $chunks[0][] = $packet;
            if (!$sameType && isset($packets[$key + 1])) {
                array_unshift($chunks, [$packet]);

                if (!$last['val']) {
                    $seconds = 0;
                    foreach ($chunks[1] as $pckt) {
                        $seconds += $pckt['seconds'];
                    }

                    if (
                        count($chunks[1]) < self::MIN_OFF_PACKETS
                        || $seconds < self::MIN_OFF_SECONDS
                    ) {
                        $chunks[0] = array_merge($chunks[0], $chunks[1]);
                        unset($chunks[1]);
                        $chunks = array_values($chunks);
                    }
                }
            }
        }

        $chunks = array_reverse($chunks);
        $records = [];

        foreach ($chunks as $chunk) {
            $first = array_shift($chunk);
            $sdt = $first['time'];
            $edt = $first['time'];
            foreach ($chunk as $packet) {
                $sdt = min($sdt, $packet['time']);
                $edt = max($edt, $packet['time']);
            }

            $records[] = new Falcon_Record_Mon_Device_Ignition([
                'id_device' => $deviceId,
                'sdt' => $sdt,
                'edt' => $edt,
                'type' => $first['val'] ? 'on' : 'off'
            ]);
        }

        return $records;
    }

    protected function writeResults()
    {
        if (!empty($this->setRecords)) {
            $lastRecord = end($this->setRecords);
            $this->setEdt($lastRecord->get('edt'));

            $firstRecord = $this->setRecords[0];
            $prevRecord = Falcon_Mapper_Mon_Device_Ignition::getInstance()
                ->load([
                    'id_device = ?' => $firstRecord->get('id_device'),
                    'edt = ?' => $firstRecord->get('sdt'),
                ]);

            if (
                !empty($prevRecord)
                && $prevRecord[0]->get('type') == $firstRecord->get('type')
            ) {
                $prevRecord = $prevRecord[0];
                $prevRecord->set('edt', $firstRecord->get('edt'));
                $prevRecord->update();
                array_shift($this->setRecords);
            }
        }

        parent::writeResults();
    }
}