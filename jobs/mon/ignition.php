<?php

class Job_Mon_Ignition extends Job_Abstract
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
    protected $channel = 'mon.ignition';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'create';

    public static $keys = [
        'check.onpacket',
        'create.onpacket',
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
    {/*
		$device = (int) $params['device'];

		$devices = Falcon_Mapper_Mon_Device::getInstance()->loadBy(
			function ($sql) use ($device) {
				$sql->where('t.state != ?',
					Falcon_Record_Abstract::STATE_DELETED);
				$sql->join('mon_device_setting',
					'mon_device_setting.id_device = t.id and
					mon_device_setting.id_protocol = 0', 'value');
				$sql->where('mon_device_setting.option = ?', 'ignition');
				$sql->where('t.id = ?', (int) $device);
			}, array(
				'fields' => array('id', 'mon_device_setting.value')
			)
		);

		if (empty($devices)) {
			return;
		}

		$device = $devices[0];

		if (empty($device['value'])) {
			return;
		}

		$locker = Falcon_Locker::getInstance();
		if ($locker->isLocked('write_ignition', $device['id'])) {
			return;
		}

		// unlock нигде не вызывается - это специально.
		// Поскольку lock вызывается с false ввиде третьего аргумента, умирать никто не будет,
		// просто до завершения unlock time периода нельзя создавать новые таски
		$locker->lock('write_ignition', $device['id'], false);

		Falcon_Amqp::sendTo('mon.ignition', 'create.onpacket',
			array('device' => $device['id'], 'sensor' => $device['value']));*/
    }

    /**
     * Performs new item creation
     * @param $params
     */
    protected function create($params)
    {/*
		$device = (int) $params['device'];
		$sensor = (int) $params['sensor'];

		$mapper = Falcon_Mapper_Mon_Device_Ignition::getInstance();
		$startDate = $mapper->getEdtForDevice($device);

		$worker = new Falcon_Action_Calculate_Mon_Device_Ignition($device,
			$startDate, array('sensor' => $sensor));
		$worker->process();*/
    }
}
