<?php

class Job_Mon_Fuel extends Job_Abstract
{
    /**
     * Should have single instance for each key
     * @var {Boolean}
     */
    public static $isSingle = true;

    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'mon.fuel';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'create';

    public static $keys = [
        'check.onpacket',
        'create.onpacket.worker0',
        'create.onpacket.worker1',
        'create.onpacket.worker2',
        'create.onpacket.worker3',
        'create.onpacket.worker4',
        'create.onpacket.worker5',
        'create.onpacket.worker6',
        'create.onpacket.worker7',
        'create.onpacket.worker8',
        'create.onpacket.worker9',
        'create.onpacket.workerA',
        'create.onpacket.workerB',
        'create.onpacket.workerC',
        'create.onpacket.workerD',
        'create.onpacket.workerE',
        'create.onpacket.workerF',
    ];

    /**
     * Methods for keys
     * @var {String[]|false}
     */
    protected $keysMethod = [
        'check.onpacket' => 'check'
    ];

    /**
     * Checks, if creation is needed
     * @param $params
     */
    protected function check($params)
    {
        $m = Falcon_Mapper_Mon_Device::getInstance();
        $devices = $m->loadBy(function ($sql) use ($params) {
            $sql
                ->where('t.id = ?', (int)$params['device'])
                ->where('t.state != ?', Falcon_Record_Abstract::STATE_DELETED)
                ->join(
                    ['st1' => 'mon_device_setting'],
                    'st1.id_device = t.id and
					 st1.option = \'fuel_level_sensor\' and
					 st1.id_protocol = 0',
                    ['sensor_tank1' => 'value']
                )
                ->joinLeft(
                    ['st2' => 'mon_device_setting'],
                    'st2.id_device = t.id and
					 st2.option = \'fuel_level_sensor_tank2\' and
					 st2.id_protocol = 0',
                    ['sensor_tank2' => 'value']
                );
        }, ['fields' => ['id']], false, false);

        if (empty($devices)) {
            return;
        }

        $device = $devices[0];

        if (!$device['sensor_tank1']) {
            return;
        }

        $locker = Falcon_Locker::getInstance();
        if ($locker->isLocked('write_fuel', $device['id'])) {
            return;
        }

        // unlock нигде не вызывается - это специально.
        // Поскольку lock вызывается с false ввиде третьего аргумента,
        // умирать никто не будет, просто до завершения
        // unlock time периода нельзя создавать новые таски
        $locker->lock('write_fuel', $device['id'], false);

        $hash = md5($device['id']);
        $routingKey = 'create.onpacket.worker' . strtoupper($hash{0});
        Falcon_Amqp::sendTo('mon.fuel', $routingKey, [
            'device' => $device['id'],
            'sensor_tank1' => $device['sensor_tank1'],
            'sensor_tank2' => $device['sensor_tank2']
        ]);
    }

    /**
     * Performs new item creation
     * @param $params
     */
    protected function create($params)
    {
        $deviceId = (int)$params['device'];

        $fuelSensors = [];
        for ($tankNumber = 1; $tankNumber < 3; $tankNumber++) {
            $sensorName = 'sensor_tank' . $tankNumber;
            if (isset($params[$sensorName]) && $params[$sensorName]) {
                $fuelSensors[] = [
                    'sensor' => (int)$params[$sensorName],
                    'tank_number' => $tankNumber
                ];
            }
        }

        Falcon_Mapper_Mon_Device_Setting::getInstance()->dropCache();

        $mapper = Falcon_Mapper_Mon_Device_Fuel::getInstance();

        // start calculations for the first fuel tank
        foreach ($fuelSensors as $fuelSensor) {
            $tankNumber = $fuelSensor['tank_number'];
            $sdt = $mapper->getEdtForDevice($deviceId, $tankNumber);
            $worker = new Falcon_Action_Calculate_Mon_Device_Fuel(
                $deviceId, $sdt, $fuelSensor);
            $worker->process();
        }
    }
}
