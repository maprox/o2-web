<?php

/**
 * Класс производящий вычисления отрезков информации для отчета по топливу
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Action_Calculate_Mon_Device_Fuel
    extends Falcon_Action_Calculate_Abstract
{
    /*
     * Подготовленные пакеты для записи в базу
     * @cfg {Falcon_Record_Mon_Packet_Fuel[]}
     */
    protected $insertPackets = [];
    /*
     * Подготовленные пакеты для обновления в базе
     * @cfg {Falcon_Record_Mon_Packet_Fuel[]}
     */
    protected $updatePackets = [];
    /*
     * Настройки для загрзуки пакетов маппером
     * @cfg {Mixed[]}
     */
    protected $loadOptions = [
        'fields' => ['id', 'time', 'speed',
            'mon_packet_sensor.val_conv as val',
            'mon_packet_fuel.val as fuel',
            'mon_packet_fuel.state as fuel_state']
    ];

    /**
     * Returns records to be deleted
     * @return array
     */
    protected function getUnsetRecords()
    {
        $records = parent::getUnsetRecords();
        if (empty($records)) {
            return $records;
        }

        $first = reset($records);
        $diff = strtotime($this->getSdt()) - strtotime($first->get('sdt'));
        if ($diff > 86400 * 5) {
            array_shift($records);
        }

        return $records;
    }

    /**
     * Make some preparations on packets
     * @param {array} $packets
     * @return array
     */
    protected function preparePackets($packets)
    {
        if (empty($packets)) {
            return $packets;
        }

        $medianLength = min(10, count($packets) - 1);
        $keys = array_keys($packets);
        $last = end($keys);

        $median = array_fill(0, $medianLength + 1, $packets[0]['val']);
        for ($i = 0; $i < $medianLength; $i++) {
            $median[] = $packets[$i]['val'];
        }

        foreach ($packets as $key => &$packet) {
            $packet['time_sec'] = strtotime($packet['time']);

            array_shift($median);
            $median[] = isset($packets[$key + $medianLength]) ?
                (float)$packets[$key + $medianLength]['val'] :
                $packets[$last]['val'];
            $search = $median;
            sort($search);
            $packet['val'] = $search[$medianLength];
        }

        $prevPacket = $packets[0];
        $prevPacket['used'] = 0;
        $prevPacket['seconds'] = 0;
        foreach ($packets as &$packet) {
            $packet['used'] = $prevPacket['val'] - $packet['val'];
            $packet['seconds'] = $packet['time_sec'] - $prevPacket['time_sec'];
            $prevPacket = $packet;
        }

        return $packets;
    }

    /**
     *
     * @param type $packets
     */
    protected function processPackets($packets)
    {
        $records = $this->makeRecords($packets, $this->getDevice());
        foreach ($records as $record) {
            $this->setRecords[] = $record->getRecord();
            list($insert, $update) = $record->getPacketRecords();
            $this->insertPackets = array_merge($this->insertPackets, $insert);
            $this->updatePackets = array_merge($this->updatePackets, $update);
        }
    }

    /**
     *
     * @param type $sql
     */
    public function joinAdditionalData($sql)
    {
        parent::joinAdditionalData($sql);

        $options = $this->getOptions();
        $sensorId = (int)$options['sensor'];
        $tankNumber = (int)$options['tank_number'];

        $sql->join('mon_packet_sensor',
            'mon_packet_sensor.id_packet = t.id', []);
        $sql->where('mon_packet_sensor.id_device_sensor = ?', $sensorId);
        $sql->where('mon_packet_sensor.val_conv::real > ?', 0);
        $sql->where("coalesce(mon_packet_sensor.val_conv, '') != ''");
        $sql->joinLeft('mon_packet_fuel',
            'mon_packet_fuel.id_packet = t.id and
			 mon_packet_fuel.tank_number = ' . $tankNumber, []);
    }

    /*
     * Разбивает группу пакетов на треки
     * @param {Mixed[][]} $packets
     * @return Falcon_Record_Blank_Mon_Device_Fuel[]
     */
    protected function makeRecords($packets, $deviceId)
    {
        $options = $this->getOptions();
        $chunks = [
            new Falcon_Record_Blank_Mon_Device_Fuel($deviceId, null, $options)
        ];
        foreach ($packets as $key => $packet) {
            $sameType = $chunks[0]->addPacket($packet);
            if (!$sameType && isset($packets[$key + 1])) {
                $new = new Falcon_Record_Blank_Mon_Device_Fuel($deviceId,
                    $packet, $options);
                array_unshift($chunks, $new);
            }
        }

        $chunks = array_reverse($chunks);

        $haveUnglued = true;
        while ($haveUnglued) {
            $mergeWeights = [];
            $chunks = array_values($chunks);

            for ($key = 0; $key < count($chunks) - 1; $key++) {
                if ($chunks[$key]->getType() == $chunks[$key + 1]->getType()) {
                    $chunks[$key]->merge($chunks[$key + 1]);
                    unset($chunks[$key + 1]);
                    continue 2;
                }
            }

            for ($key = 0; $key < count($chunks) - 2; $key++) {
                $first = $chunks[$key];
                $second = $chunks[$key + 1];
                $third = $chunks[$key + 2];

                if ($second->isSatisfactory()) {
                    continue;
                }

                // We do not divide on zero, even if totalling fuel change was 0
                $calcWeight = $first->getWeight() * $third->getWeight() /
                    ($second->getWeight() + 0.00001);

                $mergeWeights[] = [$key, $key + 1, $key + 2,
                    $first->getWeight() > $third->getWeight(), $calcWeight];
            }

            $haveUnglued = count($mergeWeights) > 0;
            usort($mergeWeights, function ($a, $b) {
                return $a[4] > $b[4] ? -1 : 1;
            });

            if ($haveUnglued) {
                $weight = array_shift($mergeWeights);
                if ($weight[3]) {
                    $chunks[$weight[0]]->merge($chunks[$weight[1]]);
                } else {
                    $chunks[$weight[2]]->merge($chunks[$weight[1]]);
                }
                unset($chunks[$weight[1]]);
            }
        }
        $chunks = array_values($chunks);
        $last = count($chunks) - 1;

        if (
            isset($chunks[0]) && isset($chunks[1])
            && !$chunks[0]->isSatisfactory()
        ) {
            $chunks[1]->merge($chunks[0]);
            unset($chunks[0]);
        }

        if (
            isset($chunks[$last]) && isset($chunks[$last - 1])
            && !$chunks[$last]->isSatisfactory()
        ) {
            $chunks[$last - 1]->merge($chunks[$last]);
            unset($chunks[$last]);
        }

        $chunks = array_values($chunks);

        for ($key = 0; $key < count($chunks) - 1; $key++) {
            $first = $chunks[$key];
            $second = $chunks[$key + 1];

            if (
                ($first->isUsage() && $second->isRefuel())
                || ($first->isRefuel() && $second->isUsage())
            ) {
                $packets = $first->getAbnormal();

                if ($packets) {
                    foreach ($packets as $packet) {
                        $second->addPacket($packet);
                    }
                }
            }
        }

        for ($key = 0; $key < count($chunks) - 1; $key++) {
            $first = $chunks[$key];
            $second = $chunks[$key + 1];

            if ($first->isRefuel() && $second->isUsage()) {
                $packets = $second->getAbnormalFromStart();

                if ($packets) {
                    foreach ($packets as $packet) {
                        $first->addPacket($packet);
                    }
                }
            }
        }

        return $chunks;
    }

    protected function writeResults()
    {
        $options = $this->getOptions();
        $tankNumber = (int)$options['tank_number'];

        if (!empty($this->setRecords)) {
            $lastRecord = end($this->setRecords);
            $this->setEdt($lastRecord->get('edt'));

            $firstRecord = $this->setRecords[0];
            $prevRecord = Falcon_Mapper_Mon_Device_Fuel::getInstance()
                ->load([
                    'id_device = ?' => $firstRecord->get('id_device'),
                    'tank_number = ?' => $tankNumber,
                    'edt = ?' => $firstRecord->get('sdt')
                ]);

            if (
                !empty($prevRecord)
                && $prevRecord[0]->get('type') == $firstRecord->get('type')
            ) {
                $prevRecord = $prevRecord[0];
                $prevRecord->set('amount', $prevRecord->get('amount') +
                    $firstRecord->get('amount'));
                $prevRecord->set('edt', $firstRecord->get('edt'));
                $prevRecord->update();
                array_shift($this->setRecords);
            }
        }

        parent::writeResults();

        foreach ($this->insertPackets as $record) {
            $record->insert();
        }
        foreach ($this->updatePackets as $record) {
            $record->update();
        }
    }
}
