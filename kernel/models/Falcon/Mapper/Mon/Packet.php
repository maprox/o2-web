<?php

/**
 * Mapper for table "mon_packet"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012-2013, Maprox LLC
 */
class Falcon_Mapper_Mon_Packet extends Falcon_Mapper_Common
{
    const
        FUTURE_TIME_TOLERANCE = 3600, // 1 hour
        COORDS_TOLERANCE = 100, // meters
        SPEED_TOLERANCE = 5, // 5 km/h
        MAX_SPEED_TOLERANCE = 200, // 200 km/h
        SPEED_HDOP_TOLERANCE = 2.5,
        SPEED_SATELLITES_TOLERANCE = 6,
        HDOP_TOLERANCE = 2.0,
        ACCURACY_LOW_TOLERANCE = 100,
        ACCURACY_MAX_TOLERANCE = 200,
        SATELLITES_TOLERANCE = 6;

    const
        SUSPICIOUS_DISTANCE = 300, // meters
        ODOMETER_CHECK_STOPPING_SPEED = 5,
        MAXIMUM_POSSIBLE_SPEED = 300,
        ODOMETER_CHECK_ADD_SPEED = 0, // 50 km/h
        ODOMETER_CHECK_MULTIPLY_SPEED = 2,
        ODOMETER_CHECK_MULTIPLY_DISTANCE = 3,
        ODOMETER_CHECK_DIVIDE_DISTANCE = 2;

    private $_pointsLimit = 10;

    private $_neccessarySensors = ['speed', 'odometer', 'longitude',
        'latitude', 'hdop', 'accuracy', 'azimuth', 'altitude', 'sat_count'];

    protected $sosPacketType = null;

    protected $needCoordCheck = null;

    /**
     * Loads packets for user
     * @param Integer $userId
     * @param String $sdt [Opt.] Period start
     * @param String $edt [Opt.] Period end
     * @return Array[]
     */
    public function loadByUser($userId, $sdt = null, $edt = null)
    {
        $result = [];
        $devices = Falcon_Mapper_Mon_Device::getInstance()
            ->loadByAccess(['fields' => ['id', 'state']]);
        $devicesIds = [];
        foreach ($devices as $device) {
            if ($device['state'] == Falcon_Record_Abstract::STATE_DELETED) {
                continue;
            }
            $devicesIds[] = $device['id'];
        }
        $devicesIds = array_unique($devicesIds);

        // if no devices specified
        if (empty($devicesIds)) {
            return $result;
        }

        $table = $this->getTable();
        if ($sdt === null) {
            $result = $table->loadByDeviceIdsLimited(
                $devicesIds, $this->_pointsLimit);
        } else {
            $result = $table->loadByDeviceIds($devicesIds, $sdt, $edt);
        }
        return $result;
    }

    /**
     * Loads packets by devices ids
     * @param {Integer[]} $ids
     * @param String $sdt [Opt.] Period start
     * @param String $edt [Opt.] Period end
     * @return Array[]
     */
    public function loadByIds($ids, $sdt = null, $edt = null)
    {
        $result = [];
        if (count($ids) === 0) {
            return $result;
        }

        $table = $this->getTable();
        if ($sdt === null) {
            $result = $table->loadByDeviceIdsLimited(
                $ids, $this->_pointsLimit);

        } else {
            $result = $table->loadByDeviceIds($ids, $sdt, $edt);
        }
        return $result;
    }


    /**
     * Loads packets for device by time field of packets
     * @param Integer $deviceId
     * @param String $sdt [Opt.] Period start
     * @param String $edt [Opt.] Period end
     * @param stdClass[] $order Array of order objects
     *     with "property" and "direction" fields
     * @param Boolean $inclusive include packet if it's time is exactly $sdt
     * @param Boolean $returnIncorrect [opt., true by default] include incorrect packets
     * @param Array $sensors Which sensors should be joined
     * @return Array[]
     */
    public function loadByDeviceByTimeField($deviceId,
                                            $sdt = null, $edt = null, $order = [],
                                            $inclusive = false, $returnIncorrect = true, $sensors = null)
    {
        $table = $this->getTable();
        $records = ($sdt === null) ?
            $table->loadByDeviceLimited($deviceId, $this->_pointsLimit) :
            $table->loadByDeviceForTimePeriod($deviceId, $sdt,
                $edt, $order, $inclusive, $returnIncorrect, $sensors);
        return $records;
    }

    /**
     * Returns packet at $index in a row before the specified time $dt,
     * inclusive. (To retrieve newest packet: $index = 0)
     * @param Integer $deviceId
     * @param Integer $index Number of a packet
     * @param String $dt From a time
     * @param Boolean $orderDesc [opt., true by default] count from newest packets
     * @param Boolean $returnIncorrect [opt., true by default] include incorrect packets
     * @return Falcon_Record_Mon_Packet|null
     */
    public function getPacketAtIndexFromDt($deviceId, $index = 0, $dt = null,
                                           $orderDesc = true, $returnIncorrect = true)
    {
        $table = $this->getTable();
        $record = $table->getPacketAtIndexFromDt($deviceId, $index,
            $dt, $orderDesc, $returnIncorrect);
        return ($record) ? $this->newRecord($record) : null;
    }

    /**
     * Returns last packet for device
     * @param Integer $deviceId
     * @return Falcon_Record_Mon_Packet
     */
    public function getLastForDevice($deviceId)
    {
        return $this->getPacketAtIndexFromDt($deviceId);
    }

    /**
     * Returns first packet for device
     * @param Integer $deviceId
     * @return Falcon_Record_Mon_Packet
     */
    public function getFirstForDevice($deviceId)
    {
        $return = $this->getTable()->getFirstForDevice($deviceId);
        if (!empty($return)) {
            $return = $this->newRecord($return);
        }
        return $return;
    }

    /**
     * Sets packet state, based on how much we trust it.
     * @param Mixed[] $packetData
     * @param Falcon_Record_Mon_Packet $prevPacket
     */
    public function setPacketState(&$packetData, $prevPacket)
    {
        $logger = Falcon_Logger::getInstance();
        if ($this->isSosPacket($packetData)) {
            $logger->log('mon_packet', 'SOS packet', $packetData);
            $packetData['state'] = Falcon_Record_Abstract::STATE_ACTIVE;
            return;
        }

        if (!isset($packetData['latitude']) ||
            !isset($packetData['longitude'])
        ) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
            return;
        }

        $lat = (float)$packetData['latitude'];
        $lon = (float)$packetData['longitude'];
        // If both coordinates are 0.000000
        if (!$lat && !$lon) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
            return;
        }

        // check if coordinates are wrong
        if (($lat < -90) || ($lat > 90) || ($lon < -180) || ($lon > 180)) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
            return;
        }

        // time check
        if (isset($packetData['time'])) {
            $curr = new DateTime();
            $time = new DateTime($packetData['time']);
            $diff = $time->getTimestamp() - $curr->getTimestamp();
            if ($diff > self::FUTURE_TIME_TOLERANCE) {
                $logger->log('mon_packet', 'Packet from future', $packetData);
                $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
                return;
            }
        }

        $sensors = [];
        $accuracy = null;
        if (isset($packetData['sensors'])) {
            # copy accuracy sensor from packet information
            if (!isset($packetData['sensors']['accuracy']) &&
                isset($packetData['accuracy'])
            ) {
                $packetData['sensors']['accuracy'] = $packetData['accuracy'];
            }
            $sensors = (array)$packetData['sensors'];
        }
        if (isset($sensors['accuracy'])) {
            $accuracy = (int)$sensors['accuracy'];
        }

        // check hdop and satellitescount  parameter
        $packetData['hdop'] = (float)f_isset($packetData, 'hdop', 0);
        $packetData['satellitescount'] =
            (int)f_isset($packetData, 'satellitescount', 0);

        if ($accuracy !== null) {
            if ($accuracy > self::ACCURACY_MAX_TOLERANCE) {
                $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
                return;
            }
        } else {
            if ($packetData['hdop'] == 0.0 ||
                $packetData['satellitescount'] == 0
            ) {
                $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
                return;
            }
        }

        if (!$prevPacket) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_ACTIVE;
            return;
        }

        $range = $this->calculateRange(
            $packetData['latitude'],
            $packetData['longitude'],
            $prevPacket->get('latitude'),
            $prevPacket->get('longitude')
        );

        $currTime = $packetData['time'];
        $prevTime = $prevPacket->get('time');
        $avgSpeed = $this->getAvarageSpeed($range, $currTime, $prevTime);
        if ($avgSpeed > self::MAX_SPEED_TOLERANCE) {
            $logger->log('mon_packet', 'TOO HIGH SPEED', [
                'uid' => $packetData['uid'],
                'currTime' => $currTime,
                'prevTime' => $prevTime,
                'speed' => $avgSpeed
            ]);
            $packetData['state'] = Falcon_Record_Abstract::STATE_DELETED;
            return;
        }

        if ((
                $accuracy === null
                || $packetData['hdop'] > 0
            ) && (
                $packetData['hdop'] > self::HDOP_TOLERANCE
                || $packetData['satellitescount'] < self::SATELLITES_TOLERANCE
            )
        ) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_INCORRECT;
            return;
        }

        if (
            $accuracy !== null
            && $accuracy >= self::ACCURACY_LOW_TOLERANCE
            && $accuracy <= self::ACCURACY_MAX_TOLERANCE
        ) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_INCORRECT;
            return;
        }

        if ((
                (
                    $packetData['speed'] > self::SPEED_TOLERANCE
                ) || (
                    $prevPacket->get('speed') > self::SPEED_TOLERANCE
                )
            ) && (
                (
                    (
                        $packetData['hdop'] <= self::SPEED_HDOP_TOLERANCE
                    ) && (
                        $packetData['satellitescount'] >=
                        self::SPEED_SATELLITES_TOLERANCE
                    )
                ) || (
                    (
                        $accuracy !== null
                    ) && (
                        $accuracy < self::ACCURACY_LOW_TOLERANCE
                    )
                )
            )
        ) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_ACTIVE;
            return;
        }

        if ($range > self::COORDS_TOLERANCE) {
            $packetData['state'] = Falcon_Record_Abstract::STATE_ACTIVE;
        } else {
            $packetData['state'] = Falcon_Record_Abstract::STATE_INCORRECT;
        }
    }

    /**
     * Calculates avarage speed between packets
     * @param float $range Range between packets in meters
     * @param string $currTime
     * @param string $prevTime
     * @return float
     */
    public function getAvarageSpeed($range, $currTime, $prevTime)
    {
        $curr = $currTime ? strtotime($currTime) : 0;
        $prev = $prevTime ? strtotime($prevTime) : 0;
        if ($curr == $prev) {
            return 1000000000;
        }
        if ($curr < $prev) {
            $temp = $curr;
            $curr = $prev;
            $prev = $temp;
        }
        return ($range / ($curr - $prev)) * (3600 / 1000);
    }

    /**
     * @param Float $fromLat
     * @param Float $fromLon
     * @param Float $toLat
     * @param Float $toLon
     * @return Float
     */
    public function calculateRange($fromLat, $fromLon, $toLat, $toLon)
    {
        if ($fromLat == $toLat && $fromLon == $toLon) {
            return 0;
        }

        return $this->getTable()->calculateRange(
            $fromLat, $fromLon, $toLat, $toLon);
    }

    /**
     * Checks, whether given packet is sos packet
     * @param Mixed[]|Falcon_Record_Abstract $packet
     * @return Boolean
     */
    public function isSosPacket($packet)
    {
        $typeId = is_object($packet)
            ? $packet->get('id_type') : $packet['id_type'];
        if ($this->sosPacketType === null) {
            $typeRecord = Falcon_Mapper_Mon_Packet_Type::getInstance()->load(
                ['name = ?' => 'SOS']);
            $this->sosPacketType =
                empty($typeRecord) ? -1 : $typeRecord[0]->getId();
        }
        return ($typeId == $this->sosPacketType);
    }

    /**
     * Corrects odometer value for $packetData
     * @param Integer $deviceId
     * @param Array[] $packetData
     * @param Falcon_Record_Mon_Packet $prevPacket
     * @param Float $coeff
     * @param String $odometerName
     * @param Boolean $skipForced
     */
    public function calculatePacketOdometer($deviceId,
                                            &$packetData, $prevPacket, $coeff, $odometerName = 'odometer',
                                            $skipForced = true)
    {
        if (
            $skipForced
            && isset($packetData['odometer_forced'])
            && ($packetData['odometer_forced'] > 0)
            && isset($packetData[$odometerName])
        ) {
            return;
        }

        if (!$prevPacket) {
            Falcon_Logger::getInstance()->log('warn',
                'No previous packet for deviceId = ' .
                $deviceId . ', packetTime = ' . $packetData['time']);
            return;
        }

        $manualOdometer = $this->testSuspiciousOdometer($packetData,
            $prevPacket, $odometerName, $coeff);
        if ($manualOdometer) {
            return;
        }

        $odometer = (float)$packetData['sensors']['odometer'] * $coeff;
        if ($prevPacket) {
            $value = 0;
            if ($packetData['state'] != Falcon_Record_Abstract::STATE_DELETED) {
                $value = $odometer;
                $prevSensor = $prevPacket->getSensorValue('odometer');
                $prevValue = (float)$prevSensor * $coeff;
                if ($prevValue && ($prevValue <= $odometer)) {
                    $value = $odometer - $prevValue;
                }
            }
            $lastValue = $prevPacket->get($odometerName);
            if ($lastValue >= 0) {
                $odometer = $lastValue + $value * $coeff;
            }
        } else {
            Falcon_Logger::getInstance()->log('warn',
                'No previous packet for deviceId = ' . $deviceId,
                'packetTime = ' . $packetData['time']);
        }

        $packetData[$odometerName] = $odometer;
    }

    /**
     * Detects suspiciously large odometer value
     * @param Mixed[] $packetData
     * @param Falcon_Record_Mon_Packet $prevPacket
     * @param String $odometerName
     * @param Float $coeff
     * @return Boolean
     */
    protected function testSuspiciousOdometer(
        &$packetData, $prevPacket, $odometerName, $coeff)
    {
        $logger = Falcon_Logger::getInstance();
        // Вычисляем расстояние, проверяем координаты на подозрительность
        $distance = $this->calculateRange(
            $packetData['latitude'],
            $packetData['longitude'],
            $prevPacket->get('latitude'),
            $prevPacket->get('longitude')
        );
        $isStopping = $this->isPossibleStopping($packetData['id_device'],
            $packetData['time'], $packetData['speed']);
        // Если подозрительно большой скачок при стоянке - запоминаем что надо проверить
        if ($isStopping && ($distance > self::SUSPICIOUS_DISTANCE)) {
            $this->needCoordCheck = true;
        }
        // Прошлое значение
        $prevValue = (float)$prevPacket->getSensorValue('odometer');

        // Надо ли вычислять одометр по координатам
        $calculate = false;
        // Надо ли выставить одометр равный нулю
        $setZero = false;

        if (!isset($packetData['sensors'])
            || !isset($packetData['sensors']['odometer'])
            || !$prevValue
        ) {
            $calculate = true;
        }

        if (!$calculate) {
            $currValue = (float)$packetData['sensors']['odometer'];

            $maxExpected = ($packetData['speed'] + $prevPacket->get('speed'))
                * self::ODOMETER_CHECK_MULTIPLY_SPEED / 2
                + self::ODOMETER_CHECK_ADD_SPEED;

            $time = strtotime($packetData['time']) -
                strtotime($prevPacket->get('time'));

            $diff = $prevValue > $currValue ?
                $currValue : $currValue - $prevValue;
            $speedCalculated = ($diff * 3.6) / ($time + 1);

            // Если подозрительно большая скорость
            if ($speedCalculated > $maxExpected
                // Или подозрительно большой одометр
                || ($distance * self::ODOMETER_CHECK_MULTIPLY_DISTANCE) < $diff
                // Или подозрительно маленький одометр
                || ($distance / self::ODOMETER_CHECK_DIVIDE_DISTANCE) > $diff
                // Или стоянка
                || $isStopping
            ) {
                // Вычисляем одометр по координатам
                $calculate = true;
            }

            // Если по одометру выходит запредельная скорость - ставим ноль
            if ($speedCalculated > self::MAXIMUM_POSSIBLE_SPEED) {
                $setZero = true;
            }
        }

        if ($calculate) {
            if (
                !$setZero
                || $packetData['state'] == Falcon_Record_Abstract::STATE_ACTIVE
            ) {
                $packetData[$odometerName] =
                    (int)($prevPacket->get($odometerName) + $distance * $coeff);
            } else {
                $packetData[$odometerName] =
                    (int)($prevPacket->get($odometerName));
            }
            $packetData['odometer_calculated'] = 1;
        }

        return $calculate;
    }

    /**
     * Tests for possible stopping by checking average speed of previous packets
     * @param Integer $deviceId
     * @param String $time
     * @param Float $speed
     * @return Boolean
     */
    public function isPossibleStopping($deviceId, $time, $speed)
    {
        $this->getTable()->populateSpeedCache($time, $speed);

        $averageSpeed = $this->getTable()
            ->getAverageSpeedFrom($deviceId, $time);

        return $averageSpeed < self::ODOMETER_CHECK_STOPPING_SPEED;
    }

    /**
     * Returns packet type according to input data
     * @param Mixed[] $packetData
     * @return Int
     */
    public function getPacketType(&$packetData)
    {
        if (!isset($packetData['sensors']) ||
            !isset($packetData['sensors']['sos'])
        ) {
            return 0;
        }
        $sos = (float)$packetData['sensors']['sos'];
        return ($sos != 0) ? 1 : 0;
    }

    /**
     * Creates packet from input $data
     * @param Falcon_Record_Mon_Device $device
     * @param Array $data
     * @return Falcon_Record_Mon_Packet
     */
    public function createPacket($device, $data)
    {
        $deviceId = $device->getId();
        // Packet creation
        $data['id_device'] = $deviceId;
        $data['id_type'] = $this->getPacketType($data);
        if (!isset($data['sensors'])) {
            $data['sensors'] = [];
        }
        $data['sensors'] = (array)$data['sensors'];

        // retrieve previous and last packets
        $prev = $this->getPacketAtIndexFromDt(
            $deviceId, 0, $data['time'], true, false);
        $last = $this->getLastForDevice($deviceId);

        // Check is this packet is from archive.
        // If this is an archive packet, then last packet time
        // would be greater then this packet time
        $prevTime = $prev ? strtotime($prev->get('time')) : 0;
        $lastTime = $last ? strtotime($last->get('time')) : 0;
        $thisTime = strtotime($data['time']);

        $isArchive = ($lastTime > $thisTime);
        $data['from_archive'] = $isArchive ?
            Falcon_Record_Abstract::STATE_ACTIVE :
            Falcon_Record_Abstract::STATE_UNAPPROVED;

        // Correct packet coordinates
        $this->setPacketState($data, $prev);

        // Let's get packet address via request to geocoder
        if ($data['state'] != Falcon_Record_Abstract::STATE_DELETED &&
            isset($data['latitude']) && isset($data['longitude']) &&
            !isset($data['address'])
        ) {
            $geocoder = new Falcon_Geocoder_Query();
            $g_answer = $geocoder->execute('revGeocode', [
                $data['latitude'],
                $data['longitude']
            ]);
            if ($g_answer->isSuccess()) {
                $data['address'] = $g_answer->getParam('address');
            }
        }

        // correct packet odometer value
        $coeff = $device->getOdometerCoeff();
        $prevOdometer = $this->getPacketAtIndexFromDt(
            $deviceId, 0, $data['time'], true);
        $this->calculatePacketOdometer(
            $deviceId, $data, $prevOdometer, $coeff);
        $this->calculatePacketOdometer(
            $deviceId, $data, $prevOdometer, $coeff, 'odometer_ext');

        // let's add packet into database
        //$logger->debug(vdv(array($data)));
        if (isset($data['odometer'])) {
            $data['odometer'] = round($data['odometer']);
        }
        if (isset($data['odometer_ext'])) {
            $data['odometer_ext'] = round($data['odometer_ext']);
        }
        if (isset($data['azimuth'])) {
            $data['azimuth'] = round($data['azimuth']);
        }
        if (isset($data['satellitescount'])) {
            $data['satellitescount'] = round($data['satellitescount']);
        }

        $packet = $this->newRecord($data);
        //$logger->debug(vdv(array($data)));
        $packet->insert()->load();


        if (!$packet->isDeleted() && $isArchive) {
            // Find associated tracks and set their state to 0
            $config = Zend_Registry::get('config');
            $maxTime = $config->tracks->max_time_between;

            $tracks = Falcon_Mapper_Mon_Track::getInstance()->load([
                'id_device = ?' => $deviceId,
                'sdt <= ?' => date(DB_DATE_FORMAT, $thisTime + $maxTime),
                'edt >= ?' => date(DB_DATE_FORMAT, $thisTime - $maxTime),
            ]);
            foreach ($tracks as $track) {
                $track->set('state', 0);
            }
        }

        if ($this->needCoordCheck) {
            $this->needCoordCheck = false;
            if (!$packet->isDeleted()) {
                Falcon_Amqp::sendTo('mon.device', 'packet.check.coord',
                    ['id' => $packet->getId()]);
            }
        }

        // insert sensors of a packet
        if (isset($data['sensors'])) {
            $this->createSensors($packet, $data);
        }

        //$device = new Falcon_Model_Device($deviceId);
        if (!$isArchive && $packet->isActive()) {
            $device->set('odometer', $packet->get('odometer_ext') / 1000);
        }
        if (!$packet->isDeleted()) {
            // set lastpacket field
            $currTime = $packet->get('time');
            $prevTime = strtotime($device->get('lastpacket'));
            if (!$prevTime || $prevTime < strtotime($currTime)) {
                $device->set('lastpacket', $currTime);
            }
        }

        // set lastconnected field
        $currEventTime = $packet->get('event_dt');
        $prevEventTime = strtotime($device->get('lastconnect'));
        if (!$prevEventTime || $prevEventTime < strtotime($currEventTime)) {
            $device->set('lastconnect', $currEventTime);
        }

        $STATUS_RECV = Falcon_Action_Device_Configure::STATUS_PACKET_RECIEVED;
        if ($device->get('configured') != $STATUS_RECV) {
            Falcon_Action_Device_Configure::setStatus($device,
                $STATUS_RECV, true);
        }

        $device->update();

        $this->writeUpdatesOnCreate($device, $packet);

        if (
            $prev &&
            $prev->get('state') != Falcon_Record_Abstract::STATE_DELETED &&
            !$packet->isDeleted()
        ) {
            $protocol = new Falcon_Record_Mon_Device_Protocol(
                $device->get('protocol'));
            if ($protocol->needAzimuthCheck()) {
                Falcon_Amqp::sendTo('mon.device', 'packet.check.azimuth',
                    ['id' => $prev->getId()]);
            }
        }

        // returns packet instance
        return $packet;
    }

    /**
     * Write updates after creating new packet
     * @param Falcon_Record_Mon_Device $device
     * @param Falcon_Record_Mon_Packet $packet
     */
    protected function writeUpdatesOnCreate($device, $packet)
    {
        // Write update table for each user that have access to device
        $table = new Falcon_Table_X_Access();
        $users = $table->getUsersByObject($device);
        Falcon_Action_Update::add([
            'alias' => $packet->getTableName(),
            'id_operation' => Falcon_Record_X_History::OPERATION_CREATE,
            'id_entity' => $packet->getId(),
            'id_user' => $users
        ]);
    }

    /**
     * Sensors creation
     * @param Falcon_Record_Mon_Packet $packet
     * @param Array[] $data
     * @return bool True if packet was updated
     */
    public function createSensors($packet, $data)
    {
        if (!isset($data['sensors'])) {
            return false;
        }
        $sensors = (array)$data['sensors'];

        $packetId = $packet->getId();

        // Save sensors for each device sensor
        $deviceSensors = Falcon_Mapper_Mon_Device::getInstance()
            ->getSensors($packet->get('id_device'));

        $written = [];
        $adders = [];
        $packetSensors = [];
        foreach ($deviceSensors as $deviceSensor) {
            // Check if sensor is active and have param value
            if ($deviceSensor['state']
                !== Falcon_Record_Abstract::STATE_ACTIVE
            ) {
                continue;
            }

            $packetSensor = $this->createPacketSensor($sensors, $packetId,
                $deviceSensor['param'], $deviceSensor['id']);

            if (!$packetSensor) {
                continue;
            }
            $packetSensors[$deviceSensor['name']] = $packetSensor;

            // Apply conversion
            $res = $this->applySensorConversion($packetSensor, $deviceSensor);
            if (is_array($res) && count($res) > 1) {
                $adders[] = [
                    'packetSensor' => $packetSensor,
                    'summands' => $res
                ];
                $written[] = $deviceSensor['param'];
                continue;
            }

            // Insert sensor
            $packetSensor->insert();
            $written[] = $deviceSensor['param'];
        }

        foreach ($adders as $adder) {
            $result = 0;
            foreach ($adder['summands'] as $sensorName) {
                $sensorName = trim($sensorName);
                $packetSensor = isset($packetSensors[$sensorName]) ?
                    $packetSensors[$sensorName] : null;
                if (!$packetSensor) {
                    continue;
                }

                $value = $packetSensor->get('val_conv');
                $value = !empty($value) ? $value : $packetSensor->get('val');
                $result += ($value ? $value : 0);
            }
            $adder['packetSensor']->set('val', $result);
            $adder['packetSensor']->set('val_conv', $result);
            $adder['packetSensor']->insert();
        }

        $necessary = array_diff($this->_neccessarySensors, $written);
        foreach ($necessary as $param) {
            $packetSensor = $this->createPacketSensor($sensors, $packetId,
                $param);

            if (!$packetSensor) {
                continue;
            }

            // Insert sensor
            $packetSensor->insert();
        }

        return true;
    }

    protected function createPacketSensor($data, $packetId, $param, $dSensorId = 0)
    {
        if (!$param) {
            return false;
        }

        // Create packet sensor for current device sensor
        // Find needed packet sensor
        if (!isset($data[$param])) {
            return false;
        }
        // Needed packet sensor is found
        // Skip sensor if value is null
        if ($data[$param] === null) {
            return false;
        }

        $sensorId = Falcon_Mapper_Mon_Sensor::getInstance()
            ->getIdByName($param);

        // deletes previous sensor value
        $this->getTable()->query('delete from mon_packet_sensor
			where id_packet = ? and id_sensor = ?',
            [$packetId, $sensorId]);

        // Return packet sensor
        return new Falcon_Record_Mon_Packet_Sensor([
            'id_packet' => $packetId,
            'id_sensor' => $sensorId,
            'val' => (string)$data[$param],
            'id_device_sensor' => $dSensorId
        ], false, false);
    }

    /**
     * Applies sensor conversion
     * @param Falcon_Record_Mon_Packet_Sensor $packetSensor Packet sensor
     * @param Array $deviceSensor Device sensor
     * @return bool|Array Returns true or array of adder
     */
    public function applySensorConversion($packetSensor, $deviceSensor)
    {
        // manual value
        if ($deviceSensor['manual']) {
            $packetSensor->set('val_conv', $deviceSensor['val']);
            return true;
        }

        if ($deviceSensor['val']) {
            $concatSensors = explode('+', $deviceSensor['val']);
            if (!empty($concatSensors)) {
                return $concatSensors;
            }
        }

        // value convertion
        if ($deviceSensor['convert'] && !empty($deviceSensor['conversion'])) {
            $data = json_decode(json_encode($deviceSensor['conversion']));
            $conversion = new Falcon_Action_Device_Sensor_Conversion($data);
            $result = $conversion->check($packetSensor->get('val'),
                $deviceSensor['smoothing'])->getData();
            $packetSensor->set('val_conv', $result['y']);
        }

        return true;
    }

    /**
     * Returns previous normal packet for specified packet
     * @param Integer $packetId
     * @return Falcon_Record_Mon_Packet | null if not found
     */
    public function getPreviousNormalPacket($packetId)
    {
        $packet = $this->loadRecord($packetId);
        $table = $this->getTable();
        $record = $table->getPreviousPacketIfNormal(
            $packet->get('id_device'),
            $packet->getId(),
            $packet->get('time'));
        return ($record) ? $this->newRecord($record) : null;
    }

    /**
     * Gets SOS packets not written into events table yet
     * @return Falcon_Record_Mon_Packet[]
     */
    public function getNewSosPackets()
    {
        return $this->getTable()->getNewSosPackets();
    }

    /**
     * Returns oldest packet to be recalculated for device
     * @param int $deviceId
     * @param int $days
     * @return array
     */
    public function getUnrecalcedForDevice($deviceId, $days = 60)
    {
        $records = $this->loadBy(function ($sql) use ($deviceId, $days) {
            $sql
                ->where('id_device = ?', $deviceId)
                ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
                ->where('time < (select time from mon_packet t2
					where t2.id_device = ?
					  and t2.state != 3
					  and t2.from_archive = 1
					  and t2.time >= current_date - interval \'' . $days . ' day\'
					  and exists (select * from mon_packet t3
						where t3.time < t2.time
						  and t3.state != ' . Falcon_Record_Abstract::STATE_DELETED . '
						  and t3.id_device = t2.id_device)
					order by t2.time asc
					limit 1)', $deviceId)
                ->order('time desc')
                ->order('event_dt desc')
                ->limit(1);
        });
        return $records ? $records[0] : null;
    }

    /**
     * Updates all packets starting from specified data.
     * This method is called if we've got an old packet from device.
     * We need it to recalculate odometer
     * @param array $packets
     */
    public function performPacketsUpdate($packets)
    {
        // work with packets
        $deviceId = $packets[0]['id_device'];
        $device = new Falcon_Record_Mon_Device($deviceId);
        $coeff = $device->getOdometerCoeff();
        $prev = null;
        $this->getTable()->dropSpeedCache();
        foreach ($packets as $row) {
            $this->getTable()->populateSpeedCache($row['time'], $row['speed']);
        }

        foreach ($packets as $row) {
            $packet = $this->newRecord($row);
            if (!$prev) {
                $prev = $packet;
                continue;
            }
            $data = $packet->toArray();

            $oldOdometer = $data['odometer'];
            $oldSensors = $packet->getSensors();

            if (!isset($oldSensors['odometer'])) {
                $oldSensors = $prev->getSensors();
                if (!empty($oldSensors)) {
                    $packet->setSensors($oldSensors);
                    $this->createSensors($packet, [
                        'sensors' => $oldSensors
                    ]);
                }
            }
            $data['sensors'] = $oldSensors;

            $this->calculatePacketOdometer($deviceId,
                $data, $prev, $coeff, 'odometer', false);
            $this->calculatePacketOdometer($deviceId,
                $data, $prev, $coeff, 'odometer_ext', true);

            if ($this->needCoordCheck) {
                $this->needCoordCheck = false;
                Falcon_Amqp::sendTo('mon.device', 'packet.check.coord',
                    ['id' => $data['id']]);
            }

            if ($oldOdometer == $data['odometer']) {
                if ($data['from_archive'] ==
                    Falcon_Record_Abstract::STATE_ACTIVE
                ) {
                    $packet->set('from_archive',
                        Falcon_Record_Abstract::STATE_DELETED)->update();
                }
                $prev = $packet;
                continue;
            }

            if (isset($data['odometer'])) {
                $data['odometer'] = round($data['odometer']);
            }
            if (isset($data['odometer_ext'])) {
                $data['odometer_ext'] = round($data['odometer_ext']);
            }
            if ($data['from_archive'] == Falcon_Record_Abstract::STATE_ACTIVE) {
                $data['from_archive'] = Falcon_Record_Abstract::STATE_DELETED;
            }
            foreach ($data as $key => $value) {
                $packet->set($key, $value);
            }

            $packet->update();

            if (isset($data['sensors']['speed_avg']) &&
                isset($oldSensors['speed_avg']) &&
                $data['sensors']['speed_avg'] != $oldSensors['speed_avg']
            ) {
                $this->createSensors($packet, $data);
            }

            $prev = $packet;
        }
    }

    /**
     * Returns odometer from start to end of time period for given device
     * @param int $id
     * @param string $sdt
     * @param string $edt
     * @return null|number
     */
    public function getOdometerByTimeForDevice($id, $sdt, $edt)
    {
        $start = $this->getPacketAtIndexFromDt($id, 0, $sdt, true, false);
        $end = $this->getPacketAtIndexFromDt($id, 0, $edt, true, false);

        if ($start && $end) {
            return abs($end->get('odometer') - $start->get('odometer'));
        }

        return null;
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     * @return String|Boolean
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('mon_device', 'mon_device.id = t.id_device', []);
        }
        return 'mon_device';
    }

    /**
     * Set state of packets for specified device to ACTIVE
     * @param int $id
     * @param string $sdt
     * @param string $edt
     */
    public function activateDevicePackets($id, $sdt, $edt)
    {
        $this->getTable()->activateDevicePackets($id, $sdt, $edt);
    }
}