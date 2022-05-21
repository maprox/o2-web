<?php

class Job_Mon_Device extends Job_Abstract
{
    /**
     * Should have single instance for each key
     * @var {false}
     */
    public static $isSingle = true;

    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'mon.device';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'createPacket';

    public static $keys = [
        'packet.check.azimuth',
        'packet.check.coord',
        'packet.check.odometer',
        'packet.receive',
        //'geofence.update.onpacket',
        //'sim.update.onpacket',
        'command.create',
        'command.update'
    ];

    /**
     * Count of threads for queue handler
     */
    public static $keysThreadsCount = [
        'packet.receive' => 30
    ];

    /**
     * Methods for keys
     * @var {String[]|false}
     */
    protected $keysMethod = [
        'packet.check.coord' => 'checkCoord',
        'packet.check.azimuth' => 'checkAzimuth',
        'packet.check.odometer' => 'checkOdometer',
        //'geofence.update.onpacket' => 'updateGeofence',
        //'sim.update.onpacket' => 'updateSimCard',
        'command.create' => 'createCommand',
        'command.update' => 'updateCommand'
    ];

    /**
     * Process device command creation
     * @param mixed[] $data
     * {
     *     command: 'custom',
     *     uid: '123',
     *     transport: 'sms',
     *     (config: {
     *         from: '+79282838388',
     *         address: '+79999999999'
     *     },)
     *     params: [{
     *         number: ...
     *     }, {...}]
     * }
     */
    protected function createCommand($data)
    {
        $logger = Falcon_Logger::getInstance();

        if (!isset($data['uid'])) {
            //throw new Falcon_Exception('UID is not specified');
            $logger->log('command_create', "UID is not specified");
            return;
        }

        // Make database mon_device_command entry

        // Find device by its uid
        $deviceUid = $data['uid'];
        // search device by its uid
        $device = Falcon_Mapper_Mon_Device::getInstance()
            ->loadByUid($deviceUid, true);

        $deviceId = null;
        if ($device && $device->isActive()) {
            // Get deviceId
            $deviceId = $device->get('id');
            $logger->log('command_create',
                "DeviceId for $deviceUid = $deviceId");
        }

        // Get id_command_template
        $commandTemplateId = null;
        if (isset($data['id_command_template'])) {
            $commandTemplateId = $data['id_command_template'];
        }

        // Get id_command_type
        $commandTypeId = null;
        $ctm = Falcon_Mapper_Mon_Device_Command_Type::getInstance();
        $types = $ctm->loadBy(function ($sql) use ($data) {
            $sql->where('name = ?', $data['command']);
        }, [], true);

        if (isset($types[0])) {
            $commandType = $types[0];
            $commandTypeId = $commandType['id'];
        }

        if (!$commandTypeId) {
            //throw new Falcon_Exception('Command not found');
            $logger->log('command_create', $commandType, "Command not found");
            return;
        }

        // Get available transports
        $transportsData = $commandType['transports'];
        if (!count($transportsData)) {
            //throw new Falcon_Exception('No available transports for command');
            $logger->log('command_create', $commandType,
                'No available transports for command');
            return;
        }

        $transports = [];
        foreach ($transportsData as $transportData) {
            $transports[] = $transportData['name'];
        }

        // Get transportId
        $transportName = null;
        if (isset($data['transport'])) {
            $transportName = $data['transport'];
        }
        if (!$transportName) {
            // Transport is auto, set it
            if (!$deviceId || !$device->get('lastconnect')) {
                $transportName = 'sms';
            } else {
                if (in_array('tcp', $transports)) {
                    $transportName = 'tcp';
                } else {
                    $transportName = 'sms';
                }
            }
        }
        $transportId = Falcon_Mapper_X_Transport::getInstance()
            ->getSingleFieldBy('id', 'name', $transportName);

        if (!$transportId) {
            //throw new Falcon_Exception('Transport not found');
            $logger->log('command_create', $transportName, 'Transport not found');
            return;
        }

        // Create here entry in mon_device_command
        $command = new Falcon_Record_Mon_Device_Command([
            'id_device' => $deviceId,
            'id_transport' => $transportId,
            'status' => Falcon_Record_Mon_Device_Command::STATUS_SENT,
            'id_command_type' => $commandTypeId,
            'id_command_template' => $commandTemplateId
        ]);
        $command->insert();

        // Get inserted guid record
        $guidRecord = $command->getTrigger('guid')->lastGuidRecord;

        // Get commandId
        $commandId = $command->getId();

        $ctpm = Falcon_Mapper_Mon_Device_Command_Type_Param::getInstance();

        //$params = $
        if (isset($data['params'])) {
            // Get params array
            foreach ($data['params'] as $name => $value) {
                // Get param id by it's name and commandTypeId
                $records = $ctpm->load([
                    'name = ?' => $name,
                    'id_device_command_type = ?' => $commandTypeId
                ]);

                if (empty($records)) {
                    $logger->log('command',
                        'Param does not exists: ' . $name
                        . ', value: ' . json_encode($value)
                        . ', $commandTypeId: ' . $commandTypeId
                    );

                    continue;
                }

                $paramId = $records[0]->get('id');

                $paramRecord = new Falcon_Record_Mon_Device_Command_Param(
                    [
                        'id_device_command' => $commandId,
                        'id_device_command_type_param' => $paramId,
                        'value' => $value
                    ]);

                $paramRecord->insert();
            }
        }

        // Write command updates
        if ($deviceId) {
            $at = new Falcon_Table_X_Access();
            $users = $at->getUsersByObject($device);
            Falcon_Action_Update::add(
                [
                    'alias' => 'mon_device_command',
                    'id_entity' => $command->get('id'),
                    'id_operation'
                    => Falcon_Record_X_History::OPERATION_CREATE,
                    'id_user' => $users
                ]
            );
        }

        // Send message with command
        // Key depends on transport
        if ($transportName === 'sms') {

            $protocolId = 0;
            if (isset($data['config']) &&
                isset($data['config']['id_protocol'])
            ) {
                $protocolId = $data['config']['id_protocol'];
            } elseif ($deviceId) {
                $protocolId = $device->get('protocol');
            } else {
                //throw new Falcon_Exception('Device protocol not found!');
                $logger->log('command_create', 'Device protocol not found!');
                return;
            }

            $protocol = new Falcon_Record_Mon_Device_Protocol($protocolId);
            $key = 'command.' . str_replace(
                    ['-', '_'], '.', $protocol->get('alias'));
        }

        if ($transportName === 'tcp') {
            $key = 'command.' . $deviceUid;
        }

        // Command data
        $commandData = [
            'command' => $data['command'],
            'transport' => $transportName,
            'params' => $data['params'],
            'uid' => $deviceUid,
            'guid' => $guidRecord->get('guid')
        ];

        if (isset($data['config'])) {
            $commandData['config'] = $data['config'];
        }

        // Send command
        Falcon_Amqp::sendTo('mon.device', $key, $commandData);
    }

    /**
     * Process command update
     * @param Array $data
     * {
     *     guid: ...
     *     status: 1/2/3
     *     data: some_raw_string_data
     * }
     */
    public function updateCommand($data)
    {
        $logger = Falcon_Logger::getInstance();

        if (!isset($data['guid'])) {
            $logger->log('error', 'Update command: No guid');
            return;
        }

        $m = Falcon_Mapper_X_Guid::getInstance();
        $record = $m->getByGuid($data['guid']);

        if (!$record) {
            $logger->log('error',
                'Update command: no record with guid ' . $data['guid']);
            return;
        }

        $record->set('status', $data['status']);
        $record->set('answer', $data['data']);
        $record->set('edt', $m->dbDate(null, true));

        $record->update();

        // Get device record
        $device = new Falcon_Record_Mon_Device($record->get('id_device'));

        // Write command updates
        $at = new Falcon_Table_X_Access();
        $users = $at->getUsersByObject($device);
        Falcon_Action_Update::add(
            [
                'alias' => 'mon_device_command',
                'id_entity' => $record->get('id'),
                'id_operation'
                => Falcon_Record_X_History::OPERATION_EDIT,
                'id_user' => $users
            ]
        );
    }

    /**
     * Worker for new packet creation
     * @param $params
     * @return bool
     * @throws Falcon_Exception
     */
    protected function createPacket($params)
    {
        $logger = Falcon_Logger::getInstance();

        if (!isset($params['uid'])) {
            $logger->log('packet_create', $params,
                'Invalid packet structure');
            throw new Falcon_Exception('Invalid packet structure');
        }

        // search device by its uid
        $deviceUid = $params['uid'];
        try {
            $device = Falcon_Mapper_Mon_Device::getInstance()
                ->loadByUid($deviceUid, true);

            $logger->log('mega_debug', "Device $deviceUid loaded");

            if (!$device || !$device->isActive()) {
                $this->sendPacketResponse($deviceUid);
                $logger->log('packet_create',
                    "Device $deviceUid not found or inactive");
                return true;
            }

            // check if we can create packet for this device
            if (!$device->isWriteableNew($params)) {
                $this->sendPacketResponse($deviceUid);
                $logger->log('packet_create',
                    "Device $deviceUid is not writeable");
                return true;
            }

            $logger->log('mega_debug', "Device $deviceUid is writeable");

            if (isset($params['images'])) {
                $action = new Falcon_Action_Device_Image($device);
                $action->receive($params);
                $this->sendPacketResponse($deviceUid);
                return true;
            }

            $packet = Falcon_Mapper_Mon_Packet::getInstance()
                ->createPacket($device, $params);

            $logger->log('mega_debug', "Packet for $deviceUid created");

            // Update sim cards if needed
            $ms = new Falcon_Action_Mon_Sim_Card();
            $ms->maybeUpdateSimCard($packet, $device);

            $logger->log('mega_debug', "Device $deviceUid maybeUpdateSimCard");

        } catch (Exception $E) {
            $logger->log('packet_create', [
                "Device $deviceUid has error!",
                $E->getMessage(),
                $E->getTrace()
            ], 'ERROR');
            return false;
        }

        /*
         * ------------------------------------------------------------
         * After packet creation we send message to
         * calculate all neccessary data for notifications.
         * ------------------------------------------------------------
         */
        $deviceId = $device->getId();
        $packetId = $packet->getId();
        $packetTime = $packet->get('time');

        Falcon_Amqp::sendTo('mon.device', 'geofence.update.onpacket',
            ['id_device' => $deviceId, 'id' => $packetId]);
        Falcon_Amqp::sendTo('mon.track', 'check.onpacket',
            ['device' => $deviceId, 'time' => $packetTime]);
        Falcon_Amqp::sendTo('mon.fuel', 'check.onpacket',
            ['device' => $deviceId, 'time' => $packetTime]);
        Falcon_Amqp::sendTo('mon.ignition', 'check.onpacket',
            ['device' => $deviceId, 'time' => $packetTime]);

        $this->sendPacketResponse($deviceUid);
        return true;
    }

    /**
     * Send packet response
     * @param {string} $deviceUid
     */
    protected function sendPacketResponse($deviceUid)
    {
        // send response signal to the balancer
        Falcon_Amqp::sendTo('mon.device', 'packet.signal.response',
            ['uid' => $deviceUid]);
    }

    /**
     * Worker for updating sim
     * @param $params
     */
    protected function updateSimCard($params)
    {
        return;

        $id = (int)$params['id'];
        $idDevice = (int)$params['id_device'];
        $packet = new Falcon_Record_Mon_Packet($id);
        $device = new Falcon_Model_Device($idDevice);

        // Update sim cards if needed
        $ms = new Falcon_Action_Mon_Sim_Card();
        $ms->maybeUpdateSimCard($packet, $device);
    }

    /**
     * Worker for updating geofence
     * @param $params
     */
    protected function updateGeofence($params)
    {
        $id = (int)$params['id'];
        $idDevice = (int)$params['id_device'];
        $packet = new Falcon_Record_Mon_Packet($id);
        $device = new Falcon_Model_Device($idDevice);

        // do not work with deleted packets
        if ($packet->isDeleted()) {
            return;
        }

        // update states of zones for current packet
        $updated = $device->updateZonesStates($packet);

        // If some geozones was updated
        /*if (!empty($updated)) {
            // Get all active waylists for current device
            $waylists = $device->getRecord()->getActiveWaylists();
            foreach ($waylists as $waylist)	{
                // Perform update
                $waylist->updateByGeofences($updated);
            }
        }*/

        Falcon_Amqp::sendTo('x.notification', 'notification.process.onpacket',
            ['id' => $id]);
    }

    /**
     * Worker for checking coordinates
     * @param $params
     */
    protected function checkCoord($params)
    {
        $inplaceRange = 50;

        $id = (int)$params['id'];
        $prevPacket = new Falcon_Record_Mon_Packet($id);
        $idDevice = $prevPacket->get('id_device');
        $device = new Falcon_Record_Mon_Device($idDevice);
        $mapper = Falcon_Mapper_Mon_Packet::getInstance();

        $packets = $mapper->loadBy(function ($sql) use ($prevPacket) {
            $sql->order('time desc');
            $sql->where('time < ?', $prevPacket->get('time'));
            $sql->where('id_device = ?', $prevPacket->get('id_device'));
            $sql->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
            $sql->limit(20);
        });

        if (empty($packets)) {
            return;
        }

        $freqIdle = $this->getFreqIdle($idDevice, $device->get('protocol'));
        $freqMoving = $this->getFreqMoving($idDevice, $device->get('protocol'));
        $freqBorder = sqrt($freqIdle * $freqMoving);

        $startLat = $prevPacket->get('latitude');
        $startLon = $prevPacket->get('longitude');
        $jumpLat = $packets[0]['latitude'];
        $jumpLon = $packets[0]['longitude'];

        if ($mapper->calculateRange($startLat, $startLon, $jumpLat, $jumpLon)
            < Falcon_Mapper_Mon_Packet::SUSPICIOUS_DISTANCE
        ) {

            return;
        }

        $prevPacket = $prevPacket->toArray();
        $deleteIds = [];
        foreach ($packets as $packet) {
            $timeDiff = strtotime($prevPacket['time'])
                - strtotime($packet['time']);

            // Если началось движение - аборт
            if ($timeDiff < $freqBorder) {
                break;
            }

            $rangeStartDiff = $mapper->calculateRange($startLat, $startLon,
                $packet['latitude'], $packet['longitude']);

            // Если вернулись на место, то аборт и проверяем нет ли списка на удаление
            if ($rangeStartDiff < $inplaceRange) {
                if (count($deleteIds)) {
                    $this->deletePackets($deleteIds, $packet['id']);
                }
                break;
            }

            $rangeJumpDiff = $mapper->calculateRange($jumpLat, $jumpLon,
                $packet['latitude'], $packet['longitude']);

            // Если улетели еще куда-то - аборт
            if ($rangeJumpDiff > $inplaceRange) {
                break;
            }

            $deleteIds[] = $packet['id'];
            $prevPacket = $packet;
        }
    }

    /**
     * Worker for checking strange azimuth
     * @param $params
     */
    protected function checkAzimuth($params)
    {
        $azimuthHeavyChange = 900;
        $azimuthModerateChange = 400;
        $odometerHeavyCoeff = 7.5;
        $odometerModerateCoeff = 2;
        $maxGoodCount = 5;
        $minOdometerChange = 150;

        $id = (int)$params['id'];
        $packet = Falcon_Mapper_Mon_Packet::getInstance()->load([
            'id = ?' => $id
        ], true);

        if (empty($packet)) {
            return;
        }

        $packet = reset($packet);

        $mapper = Falcon_Mapper_Mon_Packet::getInstance();

        $packet['state'] = null;
        $data = $mapper->loadBy(function ($sql) use ($packet) {
            $sql->order('time desc');
            $sql->limit(9);
            $sql->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
            $sql->where('id_device = ?', $packet['id_device']);
            $sql->where('time < ?', $packet['time']);
        });
        $data = array_reverse($data);

        if (empty($data)) {
            return;
        }

        $testData = $data;
        $testData[] = $packet;
        $previous = array_shift($testData);
        $azimuthChange = 0;
        $summaryRange = 0;
        $goodCount = (int)($previous['state']
            === Falcon_Record_Abstract::STATE_ACTIVE);

        foreach ($testData as $item) {

            $localChange = abs($previous['azimuth'] - $item['azimuth']);
            $azimuthChange += min(360 - $localChange, $localChange);

            $summaryRange += $mapper->calculateRange($previous['latitude'],
                $previous['longitude'], $item['latitude'], $item['longitude']);

            if ($item['state'] === Falcon_Record_Abstract::STATE_ACTIVE) {
                $goodCount++;
            }

            $previous = $item;
        }

        if ($summaryRange < $minOdometerChange) {
            return;
        }

        $range = $mapper->calculateRange($data[0]['latitude'],
            $data[0]['longitude'], $packet['latitude'],
            $packet['longitude']);

        if ($range == 0) {
            return;
        }

        $deleteIds = [];
        foreach ($data as $item) {
            $deleteIds[] = $item['id'];
        }
        $deleteIds[] = $packet['id'];

        if (
            $azimuthChange > $azimuthHeavyChange
            && ($summaryRange / $range) > $odometerModerateCoeff
            && $goodCount < $maxGoodCount
        ) {
            $this->deletePackets($deleteIds);
            return;
        }

        if (
            $azimuthChange > $azimuthModerateChange
            && ($summaryRange / $range) > $odometerHeavyCoeff
            && $goodCount < $maxGoodCount
        ) {
            $this->deletePackets($deleteIds);
        }
    }

    /**
     * Worker for odometer recalculation
     * @param $params
     */
    protected function checkOdometer($params)
    {
        $logger = Falcon_Logger::getInstance();
        $mapper = Falcon_Mapper_Mon_Packet::getInstance();

        $id = (int)$params['device'];
        $counter = (int)$params['counter'];
        $sdt = $params['sdt'];

        $packets = $this->getPackets($id, $sdt, $counter);

        if (empty($packets)) {
            $logger->log('recalc', "Recalc tracks: $id");
            Falcon_Mapper_Mon_Track::getInstance()->recalculateFrom($id, $sdt);
            $logger->log('recalc', "Recalc tracks done. $id");

            // let's update device odometer value
            $deviceRecord = new Falcon_Record_Mon_Device($id);
            $packet = $mapper->getLastForDevice($id);
            $deviceRecord->set('odometer', $packet->get('odometer') / 1000);
            $deviceRecord->update();

            $logger->log('recalc', "Recalc done for $id");

            Falcon_Locker::getInstance()->unlock('packet_recalc', $id);

            return;
        }

        $logger->log('recalc', [
            'id_device' => $id,
            'rows' => count($packets),
            'counter' => $counter,
            'time_first' => count($packets) > 1 ?
                $packets[1]['time'] : null
        ], 'performPacketsUpdate');
        $mapper->performPacketsUpdate($packets);

        Falcon_Amqp::sendTo('mon.device', 'packet.check.odometer', [
            'device' => $id,
            'counter' => $counter + 1,
            'sdt' => $sdt
        ]);
    }

    /**
     * Deletes given packets, updates "from_archive" state
     * @param $packets
     * @param bool $updateFrom
     */
    protected function deletePackets($packets, $updateFrom = false)
    {
        if (empty($packets)) {
            return;
        }

        $dt = false;
        $device = false;
        foreach ($packets as $packet) {
            $packet = new Falcon_Record_Mon_Packet($packet);

            if ($dt === false) {
                $dt = $packet->get('time');
            }
            if ($device === false) {
                $device = $packet->get('id_device');
            }

            $packet->trash();
        }

        if ($updateFrom === false) {
            $packet = Falcon_Mapper_Mon_Packet::getInstance()
                ->getPacketAtIndexFromDt($device, 0, $dt, true, false);
        } else {
            $packet = new Falcon_Record_Mon_Packet($updateFrom);
        }

        if ($packet) {
            $packet->set('from_archive', 1);
            $packet->update();
        }
    }

    /**
     * @param $deviceId
     * @param $protocol
     * @return int
     */
    protected function getFreqIdle($deviceId, $protocol)
    {
        $setting = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
            'id_device = ?' => $deviceId,
            'id_protocol = ?' => (int)$protocol,
            'option = ?' => 'freq_idle'
        ]);

        // @TODO занести в конфиги
        $defaultValue = 1800;

        if (!empty($setting)) {
            $value = (int)$setting[0]->get('value');
        }

        return empty($value) ? $defaultValue : $value;
    }

    /**
     * @param $deviceId
     * @param $protocol
     * @return int
     */
    protected function getFreqMoving($deviceId, $protocol)
    {
        $setting = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
            'id_device = ?' => $deviceId,
            'id_protocol = ?' => (int)$protocol,
            'option = ?' => 'freq_mov'
        ]);

        // @TODO занести в конфиги
        $defaultValue = 10;

        if (!empty($setting)) {
            $value = (int)$setting[0]->get('value');
        }

        return empty($value) ? $defaultValue : $value;
    }

    /**
     * @param int $deviceId
     * @param string $sdt
     * @param int $counter
     * @return mixed[]
     */
    protected function getPackets($deviceId, $sdt, $counter = 0)
    {
        $maxCountOfPackets = 100;
        $mapper = Falcon_Mapper_Mon_Packet::getInstance();

        // get packets to be recalculated
        $rows = $mapper->loadBy(
            function ($sql) use ($deviceId, $counter, $sdt, $maxCountOfPackets) {
                $sql
                    ->where('id_device = ?', $deviceId)
                    ->where('time >= ?', $sdt)
                    ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
                    ->order('time asc')
                    ->limit($maxCountOfPackets + 1, $maxCountOfPackets * $counter);
            });

        return $rows;
    }
}