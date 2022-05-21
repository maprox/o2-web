<?php

/**
 * Mapper for table "mon_device"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Mapper_Mon_Device extends Falcon_Mapper_Common
{
    /**
     * Allow to create records with given id
     * @var Boolean
     */
    protected $allowInsertId = true;
    /**
     * Cached records
     * @var {Falcon_Record_Mon_Device[]}
     */
    protected $records = [];

    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $joinedFn = function ($sql) use ($queryFn, $addLinked) {
            call_user_func($queryFn, $sql);
            if (!$addLinked) {
                return;
            }

            $sql->joinLeft('mon_vehicle',
                'mon_vehicle.id_device = t.id', []);

            $joinWaylistCondition = 'mon_waylist.id_vehicle = mon_vehicle.id' .
                ' and mon_waylist.state != ' .
                Falcon_Record_Abstract::STATE_DELETED .
                ' and mon_waylist.status = ' .
                Falcon_Record_Mon_Waylist::STATUS_STARTED;

            $sql->joinLeft('mon_waylist', $joinWaylistCondition,
                ['mon_waylist.id as active_waylist']);
        };

        return parent::loadBy($joinedFn, $queryParams,
            $addLinkedJoined, $addLinked);
    }

    /**
     * Generates event, creates notifiers
     * @param {Integer} $id Device id
     * @param {String} $name Name of the event
     */
    public function addDeviceEvent($id, $name)
    {
        $logger = Falcon_Logger::getInstance();
        $lastPacket = Falcon_Mapper_Mon_Packet::getInstance()
            ->getLastForDevice($id);

        if (!empty($lastPacket)) {
            $table = $this->getTable();
            $lastPacketId = $lastPacket->getId();
            $table->addDeviceEvent($id, $name, $lastPacketId);
        }

        // Add updates
        $users = $this->getUsersByObject(new Falcon_Record_Mon_Device($id));

        foreach ($users as $userId) {
            Falcon_Action_Update::add([
                'alias' => 'events',
                'id_user' => $userId
            ]);
        }
    }

    /**
     * Returns a list of device sensors
     * @param int $deviceId Device identifier
     */
    public function getSensors($deviceId)
    {
        // let's get current device sensors
        $m = Falcon_Mapper_Mon_Device_Sensor::getInstance();
        return $m->loadBy(function ($sql) use ($deviceId) {
            $sql->where('id_device = ?', $deviceId);
        });
    }

    /**
     * Clear device cache
     *
     * @param Falcon_Record_Mon_Device $device
     */
    public function clearCache($device)
    {
        try {
            $setting = Falcon_Record_Mon_Device_Setting::IDENTIFIER;
            $value = $device->get('identifier');
            $cacherKey = md5('mon_device_loadBySetting_' . $setting . '_' . $value);
            $cacher = Falcon_Cacher::getInstance();
            $cacher->drop('table', $cacherKey);
        } catch (Exception $E) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('clear_cache', $E->getMessage(), 'ERROR');
        }
    }

    /**
     * Loads device by some device setting.
     * Currently supported - "identifier" and "phone"
     * @param string $setting
     * @param string $value
     * @param bool $asRecord If true, returns device record. Defaults to false
     * @return bool
     */
    public function loadBySetting($setting, $value, $asRecord = false)
    {
        if (strlen($value) == 0) {
            return null;
        }

        //$cacherKey = md5('mon_device_loadBySetting_' . $setting . '_' . $value);
        //$cacher = Falcon_Cacher::getInstance();
        //$records = $cacher->get('table', $cacherKey);
        //if (!$records) {

        $records = $this->loadBy(function ($sql) use ($setting, $value) {
            $sql
                ->join(['d' => 'mon_device_setting'],
                    't.id = d.id_device', [])
                ->where('d.id_protocol = t.protocol')
                ->where('d.state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                ->where('d.option = ?', $setting)
                ->where('d.value = ?::text', $value)
                ->where('t.state != ?', Falcon_Record_Abstract::STATE_DELETED);
        });

        //	$cacher->set($records, 'table', $cacherKey, Falcon_Cacher::DAY);
        //}

        if (!empty($records)) {
            $fields = $records[0];
            if ($asRecord) {
                return $this->newRecord($fields);
            }
            return $fields;
        }

        return null;
    }

    /**
     * Loads device by its uid
     * @param string $value Unique identifier
     * @param bool $asRecord If true, returns device record. Defaults to false
     * @return bool
     */
    public function loadByUID($value, $asRecord = false)
    {
        $setting = Falcon_Record_Mon_Device_Setting::IDENTIFIER;
        return $this->loadBySetting($setting, $value, $asRecord);
    }

    /**
     * Loads device by phone number
     * @param string $value Device phone
     * @param bool $asRecord If true, returns device record. Defaults to false
     * @return bool
     */
    public function loadByPhone($value, $asRecord = false)
    {
        $setting = Falcon_Record_Mon_Device_Setting::PHONE_NORMALIZED;
        $value = Falcon_Util_Phone::normalize($value);
        return $this->loadBySetting($setting, $value, $asRecord);
    }

    /**
     * Returns the device name by its id.
     * @param {Integer} $id
     * @return {String}
     */
    public function getNameById($id)
    {
        if (empty($this->records[$id])) {
            $recordClass = $this->getRecordClassName();
            $this->records[$id] = new $recordClass($id);
        }
        return $this->records[$id]->get('name');
    }

    /**
     * Returns deviceKey by uid
     * @param int $firmId
     * @param string $deviceUid
     */
    public static function getDeviceKey($firmId, $deviceUid)
    {
        $salt = Zend_Registry::get('config')->security->key_salt;
        return $salt ? md5($salt . $firmId . $deviceUid . $salt) : null;
    }

    /**
     * Checks deviceKey
     * @param int $firmId
     * @param string $deviceUid
     * @param string $deviceKey
     */
    public static function checkDeviceKey($firmId, $deviceUid, $deviceKey)
    {
        return self::getDeviceKey($firmId, $deviceUid) === $deviceKey;
    }

    /**
     * Returns array of device ids to be recalculated
     * @param int $days
     * @return array
     */
    public function getPacketRecalcQueue($days = 60)
    {
        $rows = Falcon_Mapper_Mon_Packet::getInstance()->loadBy(
            function ($sql) use ($days) {
                $sql
                    ->where('time >= current_date - interval \'' .
                        $days . ' day\'')
                    ->where('from_archive = ?',
                        Falcon_Record_Abstract::STATE_ACTIVE)
                    ->group('id_device');
            }, [
                'fields' => ['id_device']
            ]
        );
        $result = [];
        foreach ($rows as $row) {
            $result[] = $row['id_device'];
        }
        return $result;
    }

    /**
     * Returns today packet params for the specified device
     * @param {Integer} $id Device id
     * @return Array
     */
    public function getTodayParams($id)
    {
        return $this->getTable()->getTodayParams($id);
    }
}
