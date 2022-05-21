<?php

/**
 * Device
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Model_Device extends Falcon_Model_Abstract
{
    const MAX_CONFIGURE_ATTEMPTS = 3;
    const COORDS_TOLERANCE = 0.005;

    // sql-запросы
    private $sqlGetSensors = 'select * from d_get_sensors(?)';

    private $_isAccessible; // доступность данного устройства для пользователя
    protected static $_userObjects; // Все устройства текущего пользователя

    /**
     * Класс записи. Обязательно переопределить в наследнике класса.
     * @var {String}
     */
    protected $mapperClass = 'Falcon_Mapper_Mon_Device';

    /**
     * Конструктор. Устанавливаем идентификатор объекта
     * @param {int} $id Идентификатор объекта
     */
    public function __construct($id = -1)
    {
        parent::__construct($id);
    }

    /**
     * Returns id_firm
     */
    public function getFirmId()
    {
        return $this->getRecord()->get('id_firm');
    }

    /**
     * Функция проверки устройства на доступность для пользователя
     * @return Boolean
     */
    public function isAccessible()
    {
        if ($this->_isAccessible != null) {
            return $this->_isAccessible;
        }
        $user = Falcon_Model_User::getInstance();
        $req_devices = $user->getDevices(); // получаем список устройств
        if ($req_devices->isFailure()) {
            $error = $req_devices->getLastError();
            $code = ($error) ? $error['code'] : 3;
            $params = ($error) ? $error['params'] : [];
            throw new Falcon_Exception(
                'Falcon_Model_Device->isAccessible() error ' .
                'getting user device', $code, $params);
        }
        foreach ($req_devices->getData() as $device) {
            // проверяем есть ли устройство с таким идентификатором
            if ($device['deviceid'] == $this->getId()) {
                $this->_isAccessible = true;
                return true;
            }
        }
        $this->_isAccessible = false;
        return false;
    }

    /**
     * Загрузка информации об устройстве по UID'у
     * @param {String} uid Уникальный идентификатор устройства
     * @return {Boolean}
     */
    public function loadByUID($uid)
    {
        $answer = new Falcon_Message();

        $m = Falcon_Mapper_Mon_Device::getInstance();
        $device = $m->loadByUid($uid, true);

        if (!$device || !$device->isActive()) {
            return $answer->error(Falcon_Exception::OBJECT_NOT_FOUND,
                ["Device not found", $uid, 'silent_error' => true]);
        }

        $this->_id = $device->getId();
        return $answer;
    }

    /**
     * Получение списка сенсоров
     */
    public function getSensors()
    {
        $t = Zend_Registry::get('translator');
        $answer = $this->LoadQuery($this->sqlGetSensors, [$this->getId()]);
        if ($answer->isSuccess()) {
            $propList = Falcon_Record_Mon_Packet::getProps();
            $list = [];
            foreach ($answer->getData() as $record) {
                $sensor = new Falcon_Record_Mon_Sensor((int)$record['id']);
                $sensor = $sensor->toArray();
                foreach ($propList as $prop) {
                    if ($sensor['id_prop'] == $prop['id']) {
                        $sensor['propertyname'] =
                            $t['zt']->translate(trim($prop['name']));
                        break;
                    }
                }
                $list[] = $sensor;
            }
            $answer->addParam('data', $list);
        }
        return $answer;
    }

    /**
     * Сохраняет значение одометра в последний пакет устройства
     * @param {Float} $odometer - значение одометра
     * @return {Falcon_Message}
     */
    public function setOdometer($odometer)
    {
        $packet = Falcon_Mapper_Mon_Packet::getInstance()->
        getLastForDevice($this->getId());
        if ($packet) {
            $packet->set('odometer', $odometer * 1000);
            $packet->set('odometer_forced', 1);
            $packet->update();
        }

        return new Falcon_Message();
    }

    /**
     * Sets options in device
     * @param {Mixed[]} $options
     */
    public function setOption($options)
    {
        $values = [];
        foreach ($options as $option => $value) {
            $values[] = [
                'option' => $option,
                'value' => $value
            ];
        }

        $action = new Falcon_Record_Mon_Device_Action();
        $action->setProps([
            'id_device' => $this->getId(),
            'id_protocol' => $this->getRecord()->get('protocol'),
            'action' => Falcon_Record_Mon_Device_Action::SET_SETTING,
            'value' => $values,
        ])->insert();
    }

    /**
     * Loads options for device records
     * @param {Array[]} $data
     * @return {Array[]}
     */
    protected function loadOptions($data)
    {
        $ids = [];
        foreach ($data as $item) {
            if ($item['iseditable']) {
                $ids[] = $item['id'];
            }
        }
        $records = [];
        if (count($ids) > 0) {
            $records = Falcon_Mapper_Mon_Device_Setting::getInstance()
                ->load(['id_device in (?)' => $ids, 'option != ?' => 'raw']);
        }
        $options = [];
        foreach ($records as $record) {
            $id = $record->get('id_device');
            if (empty($options[$id])) {
                $options[$id] = [];
            }
            $options[$id][$record->get('option')] = $record->get('value');
        }

        foreach ($data as &$item) {
            if (array_key_exists($item['id'], $options)) {
                $item = array_merge($item, $options[$item['id']]);
            }
        }

        return $data;
    }

    /**
     * Loads data from Mon_Device table
     * @param {Array[]} $data
     * @return {Array[]}
     */
    protected function loadTableData($data)
    {
        $ids = [];
        foreach ($data as $item) {
            $ids[] = $item['id'];
        }
        $records = [];
        if (count($ids) > 0) {
            $records = Falcon_Mapper_Mon_Device::getInstance()
                ->load(['id in (?)' => $ids]);
        }
        $devices = [];
        foreach ($records as $record) {
            $devices[$record->get('id')] = $record->toArray();
        }

        foreach ($data as &$item) {
            if (array_key_exists($item['id'], $devices)) {
                $item = array_merge($item, $devices[$item['id']]);
            }
            $item['lastdisplaypacket'] = isset($item['lastpacket'])
                ? $item['lastpacket'] : 0;
        }

        return $data;
    }

    /**
     * Updates zone states for supplied packet
     * @param Falcon_Record_Mon_Packet $packet
     * @return Integer[]
     */
    public function updateZonesStates($packet)
    {
        $device = $this->getRecord();
        $firmIds = Falcon_Access::getObjectFirmIds($device);
        // Write updates table flag
        Falcon_Mapper_Mon_Geofence::getInstance()
            ->setParams(['$hideinside' => true]);
        $geofences = Falcon_Mapper_Mon_Geofence::getInstance()->load([
            'id_firm in (?)' => $firmIds,
            'max_lat is not null' => false,
            'min_lat is not null' => false,
            'max_lon is not null' => false,
            'min_lon is not null' => false,
        ], true);

        if (empty($geofences)) {
            return [];
        }

        $ids = [];
        foreach ($geofences as $geofence) {
            $ids[] = $geofence['id'];
        }

        $geofenceStateExists = Falcon_Mapper_Mon_Geofence_Presence::getInstance()
            ->loadBy(function ($sql) use ($device, $ids) {
                $sql->where('id_device = ?', $device->getId());
                $sql->where('id_geofence in (?)', $ids);
                $sql->group('id_geofence');
                $sql->reset(Zend_Db_Select::COLUMNS);
                $sql->columns('id_geofence');
            });

        $geofenceStateExists = array_map(function ($item) {
            return $item['id_geofence'];
        }, $geofenceStateExists);

        $notExists = [];
        foreach ($geofences as $geofence) {
            if (!in_array($geofence['id'], $geofenceStateExists)) {
                $notExists[] = $geofence;
            }
        }

        $return = [];
        if (!empty($notExists)) {
            $return = array_merge($this->doUpdateZonesStates(
                $notExists, false, '2000-01-01 00:00:00'));
        }
        $return = array_merge($return, $this->doUpdateZonesStates(
            $geofences, $packet, $packet->get('time')));
        return array_unique($return);
    }

    /**
     * Performs actual update
     * @param $geofences
     * @param $packet
     * @param $time
     * @return array
     */
    public function doUpdateZonesStates($geofences, $packet, $time)
    {
        $device = $this->getRecord();
        $ids = [];
        foreach ($geofences as $geofence) {
            $ids[] = $geofence['id'];
        }

        $prevStates = Falcon_Mapper_Mon_Geofence::getInstance()
            ->getPrevPresencesForDevice($ids, $device->getId(), $time);
        $nextStates = Falcon_Mapper_Mon_Geofence::getInstance()
            ->getNextPresencesForDevice($ids, $device->getId(), $time);

        $updateGeofences = [];
        foreach ($geofences as $geofence) {
            $id = $geofence['id'];

            $insideBounds = (
                $packet
                && $packet->get('latitude') < (float)$geofence['max_lat']
                && $packet->get('latitude') > (float)$geofence['min_lat']
                && $packet->get('longitude') < (float)$geofence['max_lon']
                && $packet->get('longitude') > (float)$geofence['min_lon']
            );

            if ($insideBounds) {
                $inside = Falcon_Mapper_Mon_Geofence::getInstance()->hasPoint(
                    $id, $packet->get('latitude'), $packet->get('longitude'));
            } else {
                $inside = false;
            }

            if (
                isset($prevStates[$id])
                && (bool)$prevStates[$id]['state'] == $inside
            ) {
                continue;
            }

            if (
                isset($nextStates[$id])
                && (bool)$nextStates[$id]['state'] == $inside
            ) {
                $test = Falcon_Mapper_Mon_Geofence_Presence::getInstance()
                    ->load([
                        'id_device = ?' => $device->getId(),
                        'id_geofence = ?' => $id,
                        'sdt = ?' => $time,
                    ]);
                if (empty($test)) {
                    $record = new Falcon_Record_Mon_Geofence_Presence(
                        $nextStates[$id]['id']);
                    $record->set('sdt', $time);
                    try {
                        $record->update();
                    } catch (\Exception $e) {
                        Falcon_Logger::getInstance()
                            ->log('error', $e->getTraceAsString());
                    }
                }
            } else {
                $record = new Falcon_Record_Mon_Geofence_Presence([
                    'id_device' => $device->getId(),
                    'id_geofence' => $id,
                    'state' => (int)$inside,
                    'sdt' => $time,
                ]);
                try {
                    $record->insert();
                } catch (\Exception $e) {
                    Falcon_Logger::getInstance()
                        ->log('error', $e->getTraceAsString());
                }
            }

            $updateGeofences[] = $id;
        }

        // Geofence update should be writed only for users
        // that have access both device and geofence
        $deviceUsers = Falcon_Mapper_Mon_Device::getInstance()
            ->getUsersByObject($device);

        if (!empty($updateGeofences)) {
            try {
                foreach ($updateGeofences as $geofenceId) {
                    // Get geofence users
                    $geofenceRecord
                        = new Falcon_Record_Mon_Geofence($geofenceId);
                    $geofenceUsers = Falcon_Mapper_Mon_Geofence::getInstance()
                        ->getUsersByObject($geofenceRecord);

                    // Intersect with device users and write updates
                    $intersect = array_intersect($deviceUsers, $geofenceUsers);
                    foreach ($intersect as $userId) {
                        Falcon_Action_Update::add(
                            [
                                'alias' => 'mon_geofence',
                                'id_entity' => $geofenceId,
                                'id_operation'
                                => Falcon_Record_X_History::OPERATION_EDIT,
                                'id_user' => $userId
                            ]
                        );
                    }
                }
            } catch (Zend_Db_Exception $e) {
                Falcon_Logger::getInstance()
                    ->log('error', $e->getTraceAsString());
            }
        }

        return $updateGeofences;
    }
}
