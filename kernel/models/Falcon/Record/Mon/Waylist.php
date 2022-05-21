<?php

/**
 * Table "mon_waylist" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Waylist extends Falcon_Record_Abstract
{
    // Status values
    const
        STATUS_CREATED = 0,
        STATUS_STARTED = 1,
        STATUS_CLOSED = 2;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_company_owner',
        'serial_num',
        'num',
        'dt',
        'sdt',
        'edt',
        's_point',
        'e_point',
        'distance',
        'actual_distance',
        'fuel_expense',
        's_odometer',
        'e_odometer',
        'id_vehicle',
        'id_trailer',
        'id_driver',
        'id_driver2',
        's_id_mechanic',
        's_id_dispatcher',
        'e_id_mechanic',
        'e_id_dispatcher',
        'refuel_list_number',
        'refuel_amount',
        'id_fuel',
        's_fuel',
        'e_fuel',
        'fuel_norm',
        'fuel_fact',
        'medician',
        'id_company_disposal',
        'id_point_submission',
        'note',
        'id_type',
        'auto_close_fence',
        'status',
        'state'
    ];

    /**
     * Table fields information (types, constraints, etc.)
     * @var String[]
     */
    public static $fieldsInfo = [
        'id_firm' => [
            'convert_name' => 'x_firm'
        ],
        'id_company_owner' => [
            'convert_name' => 'x_firm'
        ],
        's_point' => [
            'convert_name' => 'mon_geofence'
        ],
        'e_point' => [
            'convert_name' => 'mon_geofence'
        ],
        'id_vehicle' => [
            'convert_name' => 'mon_vehicle'
        ],
        'id_trailer' => [
            'convert_name' => 'mon_vehicle'
        ],
        'id_driver' => [
            'convert_name' => 'x_person'
        ],
        'id_driver2' => [
            'convert_name' => 'x_person'
        ],
        's_id_mechanic' => [
            'convert_name' => 'x_person'
        ],
        's_id_dispatcher' => [
            'convert_name' => 'x_person'
        ],
        'e_id_mechanic' => [
            'convert_name' => 'x_person'
        ],
        'e_id_dispatcher' => [
            'convert_name' => 'x_person'
        ],
        'id_company_disposal' => [
            'convert_name' => 'x_company'
        ],
        'id_point_submission' => [
            'convert_name' => 'mon_geofence'
        ],
        'id_fuel' => [
            'convert_name' => 'mon_fuel'
        ],
        'id_type' => [
            'convert_name' => 'mon_waylist_type'
        ],
        'status' => [
            'convert_values' => ['created', 'started', 'closed']
        ],
        'auto_close_fence' => [
            'convert_values' => ['no', 'yes']
        ]
    ];

    /**
     * Params for converting id to string representation
     */
    public static $nameConvertParams = [
        'field' => ['serial_num', 'num'],
        'tpl' => '%s/%s'
    ];

    /**
     * Required fields
     * @var String[]
     *//*
	public static $requiredFields = array(
		'num'
	);*/

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        //'id_company_owner' => array('x_company' => 'id'),
        'id_driver' => [
            // access mapper config
            'dn_worker' => 'id_person',
            // joined view config
            'joined' => ['x_person' => 'id'],
            'fields' => [
                'firstname',
                'secondname',
                'lastname'
            ]
        ],
        'id_vehicle' => [
            // access mapper config
            'mon_vehicle' => 'id',
            // joined view config
            'fields' => [
                'name',
                'license_number',
                'id_device',
                'id_fuel',
                'car_model'
            ]
        ],
        'id_type' => [
            // access mapper config
            'mon_waylist_type' => 'id',
            // joined view config
            'fields' => [
                'id',
                'name',
                'alias'
            ]
        ],
        'id_company_disposal' => [
            // access mapper config
            'x_company' => 'id',
            // joined view config
            'fields' => ['name']
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        if ($this->get('id_vehicle')) {
            if (!$this->get('fuel_expense')) {
                $this->fetchFuelExpense();
            }
            if (!$this->get('id_fuel')) {
                $this->fetchIdFuel();
            }
            if (!$this->get('s_odometer')) {
                $this->fetchStartOdometer();
            }
        }

        return parent::insert();
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        if (isset($this->changed['e_point'])) {
            $this->calculateDistance(false);
        }

        if (isset($this->changed['id_vehicle'])) {
            if (!$this->get('fuel_expense')) {
                $this->fetchFuelExpense();
            }
            if (!$this->get('id_fuel')) {
                $this->fetchIdFuel();
            }
        }

        if (isset($this->changed['id_vehicle']) ||
            isset($this->changed['sdt'])
        ) {
            if (!$this->get('s_odometer')) {
                $this->fetchStartOdometer();
            }
        }

        if (isset($this->changed['status'])
            && $this->get('status') == self::STATUS_CLOSED
        ) {
            $this->fetchDataOnClose();
        }

        return parent::update();
    }

    /**
     * Performs status updates by packet
     * @param Integer[] $idFences
     */
    public function updateByGeofences($idFences)
    {
        // Get next point to be cleared
        $routes = $this->getUnclosedRoutes();

        $idDevice = $this->getIdDevice();
        $presences = [];
        $mapper = Falcon_Mapper_Mon_Geofence_Presence::getInstance();
        foreach ($idFences as $id) {
            $data = $mapper->loadBy(function ($sql) use ($id, $idDevice) {
                $sql->where('id_geofence = ?', $id);
                $sql->where('id_device = ?', $idDevice);
                $sql->order('sdt desc');
                $sql->limit(1);
            });
            if ($data) {
                $presences[$id] = reset($data);
            }
        }

        foreach ($routes as $key => $route) {
            if (
                !in_array($route->get('id_point'), $idFences)
                || !isset($presences[$route->get('id_point')])
            ) {
                continue;
            }

            $presence = $presences[$route->get('id_point')];

            // Если эта информация уже есть, или если пытаемся записать выход из зоны,
            // где еще не отметились о появлении - пропускаем
            if (
                ($presence['state'] == 0 && $route->get('exit_dt'))
                || ($presence['state'] == 0 && !$route->get('enter_dt'))
                || ($presence['state'] == 1 && $route->get('enter_dt'))
            ) {
                continue;
            }

            $last = $this->getLastClosedRoute();

            if (
                $presence['state'] == 1
                && $last
                && ($last->get('id_point') == $route->get('id_point'))
            ) {
                continue;
            }

            if ($last) {
                $start = $last->get('enter_dt');
            } else {
                $start = $this->get('sdt');
            }

            // If we have received a packet placed in next points fence, then that point is cleared
            if ($presence['state'] == 1) {
                $route->set('enter_dt', $presence['sdt']);

                $distance = Falcon_Mapper_Mon_Packet::getInstance()
                    ->getOdometerByTimeForDevice($this->getIdDevice(), $start,
                        $presence['sdt']);

                if ($distance !== null) {
                    $route->set('actual_distance', $distance);
                }
            } else {
                $route->set('exit_dt', $presence['sdt']);
            }

            $route->update();

            // Remove from queue to check if queue is empty later
            unset($routes[$key]);
        }

        if (empty($routes)) {
            $this->checkAutoClose($presences);
        }
    }

    /**
     * Checks auto close condition
     * @param Mixed[][] $presences
     */
    public function checkAutoClose($presences)
    {
        $autoClose = $this->get('auto_close_fence');
        $idFence = $this->get('e_point');

        if (
            empty($autoClose)
            || empty($idFence)
            || !isset($presences[$idFence])
        ) {
            return;
        }

        $presence = $presences[$idFence];

        if ($presence['state'] != 1) {
            return;
        }

        $this->set('status', self::STATUS_CLOSED);
        $this->update();
    }

    /**
     * Fetches next unclosed route point
     * @return Falcon_Record_Mon_Waylist_Route[]
     */
    protected function getUnclosedRoutes()
    {
        return $this->getRoutes();
    }

    /**
     * Fetches next unclosed route point
     * @return Falcon_Record_Mon_Waylist_Route|Boolean
     */
    protected function getLastClosedRoute()
    {
        $routes = $this->getRoutes(true, 1);
        return $routes ? $routes[0] : false;
    }

    /**
     * Fetches next unclosed route point
     * @param bool $closed
     * @param int|bool $limit
     * @return Falcon_Record_Mon_Waylist_Route[]
     */
    protected function getRoutes($closed = false, $limit = false)
    {
        $id = $this->getId();
        $mapper = Falcon_Mapper_Mon_Waylist_Route::getInstance();
        $routes = $mapper->loadBy(function ($sql) use ($id, $closed, $limit) {
            $sql->where('id_waylist = ?', $id);
            $sql->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
            if ($closed) {
                $sql->where('enter_dt is not null');
                $sql->order('enter_dt DESC');
            } else {
                $sql->where('enter_dt is null or exit_dt is null');
                $sql->order('num');
            }
            if ($limit) {
                $sql->limit($limit);
            }
        });

        $routes = array_reverse($routes);
        foreach ($routes as &$route) {
            $route = $mapper->newRecord($route);
        }

        return $routes;
    }

    /**
     * Sets distance based on routes
     * @param bool $doUpdate
     */
    public function calculateDistance($doUpdate = true)
    {
        $distance = $this->getMapper()->calculateDistance($this->getId());

        // Если есть гараж возвращения, добавим расстояние до него от последней точки пути
        $ePoint = $this->get('e_point');
        if ($ePoint) {
            $id = $this->getId();
            $mapper = Falcon_Mapper_Mon_Waylist_Route::getInstance();
            $route = $mapper->loadBy(function ($sql) use ($id) {
                $sql->where('id_waylist = ?', $id);
                $sql->order('num desc');
                $sql->limit(1);
            });
            if (!empty($route) && !empty($route[0]['id_point'])) {
                $sPoint = new Falcon_Record_Mon_Geofence($route[0]['id_point']);
                $ePoint = new Falcon_Record_Mon_Geofence($ePoint);
                $osrm = new Falcon_Osrm($sPoint->get('center_lat'),
                    $sPoint->get('center_lon'), $ePoint->get('center_lat'),
                    $ePoint->get('center_lon'));
                if ($osrm->isSuccess()) {
                    $distance += $osrm->getDistance();
                }
            }
        }

        $this->set('distance', $distance);
        if ($doUpdate) {
            $this->update();
        }
    }

    /**
     * Sets distance based on actual packets
     */
    public function fetchDataOnClose()
    {
        $id = $this->getIdDevice();
        if (!$id || !$this->get('sdt') || !$this->get('edt')) {
            return;
        }

        $distance = Falcon_Mapper_Mon_Packet::getInstance()
            ->getOdometerByTimeForDevice($id, $this->get('sdt'),
                $this->get('edt'));

        if ($distance !== null) {
            $this->set('actual_distance', $distance);
        }

        $start = Falcon_Mapper_Mon_Packet::getInstance()
            ->getPacketAtIndexFromDt($id, 0, $this->get('sdt'), true, false);
        $end = Falcon_Mapper_Mon_Packet::getInstance()
            ->getPacketAtIndexFromDt($id, 0, $this->get('edt'), true, false);

        if ($this->get('s_odometer') === null && $start->get('odometer')) {
            $this->set('s_odometer', $start->get('odometer'));
        }
        if ($this->get('s_fuel') === null && $start->get('fuel')) {
            $this->set('s_fuel', $start->get('fuel'));
        }
        if ($this->get('e_odometer') === null && $end->get('odometer')) {
            $this->set('e_odometer', $end->get('odometer'));
        }
        if ($this->get('e_fuel') === null && $end->get('fuel')) {
            $this->set('e_fuel', $end->get('fuel'));
        }
    }

    /**
     * Returns id of associated device
     * @return int|null
     */
    protected function getIdDevice()
    {
        $idVehicle = $this->get('id_vehicle');
        if (!$idVehicle) {
            return null;
        }

        $vehicle = new Falcon_Record_Mon_Vehicle($this->get('id_vehicle'));
        return $vehicle->get('id_device');
    }

    /**
     * Fetches fuel expense from vehicle
     */
    public function fetchFuelExpense()
    {
        $vehicle = new Falcon_Record_Mon_Vehicle($this->get('id_vehicle'));
        $expense = $vehicle->get('fuel_expense');
        if ($expense) {
            $this->set('fuel_expense', $expense);
        }
    }

    /**
     * Fetches id fuel from vehicle
     */
    public function fetchIdFuel()
    {
        $vehicle = new Falcon_Record_Mon_Vehicle($this->get('id_vehicle'));
        $fuel = $vehicle->get('id_fuel');
        if ($fuel) {
            $this->set('id_fuel', $fuel);
        }
    }

    /**
     * Fetches start odometer from previous waylist or device odometer
     */
    public function fetchStartOdometer()
    {
        $idVehicle = $this->get('id_vehicle');
        if (!$idVehicle) {
            return;
        }

        $sdt = $this->get('sdt');
        $mapper = Falcon_Mapper_Mon_Waylist::getInstance();
        $prev = $mapper->loadBy(function ($sql) use ($idVehicle, $sdt) {
            $sql->where('id_vehicle = ?', $idVehicle);
            if ($sdt) {
                $sql->where('sdt < ?', $sdt);
            }
            $sql->order('sdt desc');
            $sql->limit(1);
        });

        if ($prev && isset($prev[0]) && isset($prev[0]['e_odometer'])) {
            $this->set('s_odometer', $prev[0]['e_odometer']);
            return;
        }

        // Previous waylist not found, searching for last packet
        $idDevice = $this->getIdDevice();
        if (!$idDevice) {
            return;
        }

        $packet = Falcon_Mapper_Mon_Packet::getInstance()->
        getLastForDevice($idDevice);
        if ($packet) {
            $this->set('s_odometer', $packet->get('odometer'));
        }
    }

    /**
     * Builds full serial for waylist
     * @return String
     */
    public function getSerial()
    {
        return $this->getConvertedName();
    }
}
