<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Rest controller
 */
class Mon_Device_FuelController extends Falcon_Controller_Action_Rest
{
    /**
     * Creates new fuel entries for every device
     */
    public function kostylAction()
    {
//             Falcon_Locker::getInstance()->lock('write_fuel', 1);
        $maxLaunches = $this->_getParam('launch', 1);
        $device = $this->_getParam('device', false);
        $skipPackets = $this->_getParam('skip', 0);

        $devices = Falcon_Mapper_Mon_Device::getInstance()->loadBy(
            function ($sql) use ($device) {
                $sql->where('t.state != ?',
                    Falcon_Record_Abstract::STATE_DELETED);
                $sql->join('mon_device_setting',
                    'mon_device_setting.id_device = t.id and
					   mon_device_setting.id_protocol = 0', 'value');
                $sql->where('mon_device_setting.option = ?',
                    'fuel_level_sensor');
                if (!empty($device)) {
                    $sql->where('t.id = ?', (int)$device);
                }
            }, [
                'fields' => ['id', 'mon_device_setting.value']
            ]
        );

        foreach ($devices as $device) {
            $startDate = Falcon_Mapper_Mon_Device_Fuel::getInstance()
                ->getEdtForDevice($device['id']);
            $startDate = '2013-07-01 09:00:00';//$this->_getParam('start');28. 17:23
            $launches = 0;
            $mapper = Falcon_Mapper_Mon_Device_Fuel::getInstance();
            $haveRecords = $mapper->getCount(['id_device = ?' => $device['id']]);

            while ($startDate !== false
                && (
                    ++$launches <= $maxLaunches
                    || (
                        !$haveRecords
                        && $launches <= 500
                    )
                )) {
                $startDate = Falcon_Action_Mon_Device_Fuel::parseLatest(
                    $device['id'], $startDate, $device['value']);

                $haveRecords = $mapper->getCount(['id_device = ?' => $device['id']]);
            }
        }

//             Falcon_Locker::getInstance()->unlock('write_fuel', 1);

        $this->sendAnswer();
    }
}