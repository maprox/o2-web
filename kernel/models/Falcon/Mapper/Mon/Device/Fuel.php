<?php

/**
 * Class of "mon_device_fuel" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Fuel extends Falcon_Mapper_Common
{
    /**
     * Returns last track edt for device
     * @param int $deviceId
     * @param int $tankNumber
     * @return String
     */
    public function getEdtForDevice($deviceId, $tankNumber = 1)
    {
        $edt = $this->getTable()->getEdtForDevice($deviceId, $tankNumber);
        if (!empty($edt)) {
            return $edt;
        }

        $packet = Falcon_Mapper_Mon_Packet::getInstance()
            ->getFirstForDevice($deviceId);

        if (empty($packet)) {
            return false;
        }

        return $packet->get('time');
    }
}