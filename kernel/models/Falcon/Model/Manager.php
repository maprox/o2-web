<?php

/**
 * Model manager class
 *
 * @project    Maprox Observer <http://maprox.net/observer>
 * @copyright  2009-2012, Maprox Ltd.
 */
class Falcon_Model_Manager extends Falcon_Db_Table_Abstract
{
    // sql-запросы
    //private $sqlGetCurTime = 'select localtimestamp as servertime';
    // Proxies allowed for load
    private $proxies = [];

    // Cache loaded data
    protected static $cache = [];

    /**
     * Get data for user
     * N.B. resets original user
     * @param $userId
     * @param proxy
     * @param $alias
     * @param $idEntity Optional
     */
    public function getForUser($userId, $proxy, $alias,
                               $idEntity = null)
    {
        // Set user with userId as current
        $user = new Falcon_Model_User($userId);
        Falcon_Model_User::setInstance($user);

        return $this->loadItem($alias, $idEntity, $proxy);
    }

    /**
     * Loads item
     * @param type $alias
     * @param type $id
     * @param type $proxy
     * @return type
     */
    public function loadItem($alias, $id, $proxy = [])
    {
        $userId = Falcon_Model_User::getInstance()->getId();
        $method = $alias;
        if (strstr($method, '_')) {
            $exploded = explode('_', $method);
            $method = array_shift($exploded);
            foreach ($exploded as $e) {
                $method .= ucfirst($e);
            }
        }
        $method = 'load' . ucfirst($method);
        $answer = new Falcon_Message(null, false);
        // if no special method exists
        if (!method_exists($this, $method)) {
            // Action class
            $actionClass = 'Falcon_Action_' . ucwords_custom($alias);
            // Path to action class
            $file = Zend_Registry::get('config')->path->library .
                str_replace('_', '/', $actionClass) . '.php';
            // if file exists then load action
            if (is_file($file)) {
                try {
                    // Get extraParams from proxy
                    $params = empty($proxy['extraParams']) ?
                        [] : $proxy['extraParams'];

                    // If id specified load one item
                    if (!empty($id)) {
                        $params['$filter']
                            = 'id IN (' . implode(',', [$id]) . ')';
                    }

                    // If no ids given
                    // with no filter full data will be loaded
                    $actionInstance = new $actionClass($params);
                    // Get data for proxy
                    $answer = $actionInstance->doGetList(false);
                } catch (Exception $e) {
                    // silent exception
                    Falcon_Logger::getInstance()->log('access',
                        '403 user id: ' . $userId, $e);
                }
            }
        } else {
            $answer = $this->$method();
        }

        return $answer;
    }

    /**
     * Mass load items for frontend
     * @param String $alias
     * @param Array $ids
     * @return Array
     */
    public function loadItems($alias, $ids)
    {
        $userId = Falcon_Model_User::getInstance()->getId();

        // Aliases for requested page
        $proxyAliases = [];
        // Helper array
        $proxyMap = [];
        // Get proxies
        $proxies = $this->getProxies();

        foreach ($proxies as $proxy) {
            $proxyAliases[] = $proxy['id'];
            // Save proxy for easier use
            $proxyMap[$proxy['id']] = $proxy;
        }

        $method = $alias;
        if (strstr($method, '_')) {
            $exploded = explode('_', $method);
            $method = array_shift($exploded);
            foreach ($exploded as $e) {
                $method .= ucfirst($e);
            }
        }
        $method = 'load' . ucfirst($method);
        $answer = new Falcon_Message(null, false);
        // if no special method exists
        if (!method_exists($this, $method)) {
            // класс контроллера
            $actionClass = 'Falcon_Action_' . ucwords_custom($alias);
            // путь к файлу контроллера
            $file = Zend_Registry::get('config')->path->library .
                str_replace('_', '/', $actionClass) . '.php';
            // if file exists then load action
            if (is_file($file)) {
                try {
                    // Get extraParams from proxy
                    $params = empty($proxyMap[$alias]['extraParams']) ?
                        [] : $proxyMap[$alias]['extraParams'];

                    if (!empty($ids)) {
                        $params['$filter']
                            = 'id IN (' . implode(',', $ids) . ')';
                    }
                    // If no ids given
                    // with no filter full data will be loaded
                    $actionInstance = new $actionClass($params);
                    // Get data for proxy
                    $answer = $actionInstance->doGetList(false);
                } catch (Exception $e) {
                    // silent exception
                    Falcon_Logger::getInstance()->log('access',
                        '403 user id: ' . $userId, $e);
                }
            }
        } else {
            $answer = $this->$method();
        }

        return $answer;
    }

    /**
     * Set proxies
     */
    public function setProxies($proxies = [])
    {
        $this->proxies = $proxies;
    }

    /**
     * Get proxies
     * @return Array
     */
    public function getProxies()
    {
        return $this->proxies;
    }

    /**
     * Возвращает текущее время на сервере (UTC+0)
     * @return Array
     *//*
	public function getServerTime()
	{
		return $this->LoadQuery($this->sqlGetCurTime);
	}*/


    public function loadAccesslevels()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_X_Right_Level::getInstance()
            ->load(null, true);
        $answer = new Falcon_Message($records);
        return $answer;
    }

    public function loadAccessrights()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_X_Right::getInstance()->load(null, true);
        foreach ($records as &$record) {
            $record['identifier'] = $record['alias'];
        }
        $answer = new Falcon_Message($records);
        return $answer;
    }

    public function loadBillingAccount($firmId = 0)
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        if ($firmId == 0 || !is_numeric($firmId) ||
            !$user->hasRight('admin_billing_account')
        ) {
            $firmId = $user->getFirmId();
        }
        $records = Falcon_Mapper_Billing_Account::getInstance()
            ->loadWithTariff($firmId);

        $firm = new Falcon_Model_Firm($firmId);
        $billingDisabled = $firm->get('Billing disabled');
        foreach ($records as &$record) {
            $record['is_disabled'] = $billingDisabled;
        }

        return new Falcon_Message($records);
    }

    public function loadBillingPaymentType()
    {
        $logger = Falcon_Logger::getInstance();
        $records =
            Falcon_Mapper_Billing_Payment_Type::getInstance()->load(null, true);
        return new Falcon_Message($records);
    }

    public function loadBillingAccountUpdate()
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        $records = Falcon_Mapper_Billing_Account::getInstance()
            ->loadWithTariff($user->getFirmId());
        return new Falcon_Message($records);
    }

    /**
     * Needed only to trigger data request
     */
    public function loadBillingAccountChildrenUpdate()
    {
        $logger = Falcon_Logger::getInstance();
        return new Falcon_Message();
    }

    public function loadDnDoc()
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        $records = Falcon_Mapper_Dn_Doc::getInstance()
            ->loadByFirm($user->getFirmId(), true);
        return new Falcon_Message($records);
    }

    public function loadDnFeednormValue()
    {
        $logger = Falcon_Logger::getInstance();

        $feednormId = 1;
        $records = Falcon_Mapper_Dn_Feednorm_Value::getInstance()
            ->loadByFeednorm($feednormId);
        return new Falcon_Message($records);
    }

    public function loadDnMeasure()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_Dn_Measure::getInstance()->load(null, true);
        return new Falcon_Message($records);
    }

    public function loadDnProduct()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_Dn_Product::getInstance()->loadWithMeasure();
        return new Falcon_Message($records);
    }

    public function loadDnRegion()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_Dn_Region::getInstance()->load(null, true);
        return new Falcon_Message($records);
    }

    public function loadDnSupplier()
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        $firm = new Falcon_Record_X_Firm($user->getFirmId(), false, false);
        $list = $firm->getActiveClients(true, false);

        return new Falcon_Message($list);
    }

    public function loadDnRequiredvolume()
    {
        $logger = Falcon_Logger::getInstance();
        $mapper = Falcon_Mapper_Dn_Requiredvolume::getInstance();
        $records = $mapper->load([
            'state != ?' => 3
        ], true);
        return new Falcon_Message($records);
    }

    public function loadDnRequiredvolumeValue()
    {
        $logger = Falcon_Logger::getInstance();
        $requiredvolumeId = 1;
        $records = Falcon_Mapper_Dn_Requiredvolume_Value::getInstance()
            ->loadByRequiredvolume($requiredvolumeId, true);
        return new Falcon_Message($records);
    }

    public function loadDnWarehouseList($firmId)
    {
        $logger = Falcon_Logger::getInstance();
        $m = Falcon_Mapper_Dn_Account::getInstance();
        $account = $m->getAccountByIdFirmClient($firmId);
        $records = [];
        if (!$account) {
            $records = Falcon_Mapper_Dn_Warehouse::getInstance()
                ->loadByFirm($firmId, true);
        } else {
            $records = Falcon_Mapper_Dn_Warehouse::getInstance()
                ->loadByFirm($account->get('id_firm'), true);
        }
        return new Falcon_Message($records);
    }

    public function loadFees()
    {
        $logger = Falcon_Logger::getInstance();
        $records = Falcon_Mapper_X_Fee::getInstance()
            ->load(null, true);
        $answer = new Falcon_Message($records);
        return $answer;
    }

    public function loadImages()
    {
        $logger = Falcon_Logger::getInstance();
        // объект реестра
        $registry = Zend_Registry::getInstance();
        // конфиг иконок
        $config = $registry->config->icons;
        // объект ответа сервера
        $answer = new Falcon_Message();
        // шаблон пути к изображению через веб
        // smth like this: '/resource/img/icons/%s/image.png'
        $src = substr($config->path, strlen($registry->config->path->root) - 1)
            . '%s/' . $config->imageFile;
        // массив объектов изображений
        $images = [];
        // обход папок в каталоге с иконками
        $dirs = scandir($config->path);
        $i = 0;
        foreach ($dirs as $dir)
            // проверка наличия в папке файла image.png
            // и соответствия regexp, если задано
            if (is_dir($config->path . $dir)
                && is_file($config->path . $dir . '/' . $config->imageFile)
                && (!$config->regExp || preg_match($config->regExp, $dir))
            ) {
                $i++;
                // создаем объект изображения и добавляем в массив
                $image = new stdClass();
                $image->id = $i;
                $image->alias = $dir;
                $image->src = sprintf($src, $dir);
                $images[] = $image;
            }

        return $answer->addParam('data', $images);
    }

    public function loadPhones($objectId = null)
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();
        if ((int)$objectId) {
            $records = Falcon_Mapper_N_Notification_Target::getInstance()
                ->loadByNotification((int)$objectId, 'phone');
            $answer = new Falcon_Message($records);
        }
        return $answer;
    }

    public function loadProps()
    {
        $logger = Falcon_Logger::getInstance();
        return Falcon_Action_Mon_Packet::getProps();
    }

    public function loadSchedules()
    {
        $logger = Falcon_Logger::getInstance();
        // TODO
        $records = Falcon_Mapper_X_Schedule::getInstance()->load(null, true);
        return new Falcon_Message($records);
    }

    /*public function loadSensors()
    {

    }*/

    public function loadSettings()
    {
        $logger = Falcon_Logger::getInstance();
        $o = new Falcon_Action_Settings();
        return $o->load();
    }

    /**
     * Loading of events
     * @param {Date} $sdt
     * @param {Date} $edt
     * @return \Falcon_Message
     */
    public function loadEvents()
    {
        $logger = Falcon_Logger::getInstance();
        // Temporary solution
        // Just tell frontned to reload grids
        return new Falcon_Message([
            ['id' => 0]
        ]);
    }


    /**
     * Loading of objects (which objects???) dummy
     * @param {Date} $sdt [opt.]
     * @param {Date} $edt [opt.]
     */
    public function loadObjects($sdt = null, $edt = null)
    {
        $logger = Falcon_Logger::getInstance();
        return new Falcon_Message();
    }

    /**
     * Loading of packets
     * @param {Date} $sdt [opt.]
     * @param {Date} $edt [opt.]
     */
    public function loadPackets($sdt = null, $edt = null)
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        $userId = $user->getId();
        try {
            $m = Falcon_Mapper_Mon_Packet::getInstance();
            $packets = $m->loadByUser($userId, $sdt, $edt);
            if (!empty($packets)) {
                // Get packet ids
                foreach ($packets as $packet) {
                    $packetIds[] = $packet['id'];
                }
                $ms = Falcon_Mapper_Mon_Packet_Sensor::getInstance();
                // load sensors for all packets
                $sensors = $ms->loadBy(function ($sql) use ($packetIds) {
                    $sql->where('id_packet IN (?)', $packetIds);
                    $sql->join(['ms' => 'mon_sensor'],
                        'ms.id = id_sensor', []);
                    $sql->columns('name as sensor', 'ms');
                });

                // Group sensors
                $sensorMap = [];
                foreach ($sensors as $sensor) {
                    if (!isset($sensorMap[$sensor['id_packet']])) {
                        $sensorMap[$sensor['id_packet']] = [];
                    }
                    $sensorMap[$sensor['id_packet']][] = $sensor;
                }

                foreach ($packets as &$packet) {
                    if (isset($sensorMap[$packet['id']])) {
                        $packet['sensor'] = $sensorMap[$packet['id']];
                    } else {
                        $packet['sensor'] = [];
                    }
                }
            }
        } catch (Falcon_Exception $e) {
            if ($e->getCode() == 403) {
                return new Falcon_Message();
            } else {
                throw $e;
            }
        }

        return new Falcon_Message($packets);
    }

    /**
     * Loader for mon waylist route, always returns empty array
     * Needed only to subscribe on update notifications
     * @param null $sdt
     * @param null $edt
     * @return Falcon_Message
     */
    public function loadMonWaylistRouteUpdate($sdt = null, $edt = null)
    {
        $logger = Falcon_Logger::getInstance();
        return new Falcon_Message([]);
    }
}