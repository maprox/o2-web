<?php

/**
 * Class of "mon_device_ignition" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Ignition extends Falcon_Mapper_Common
{
    /**
     * Returns last data edt for device
     * @param int $deviceId
     * @return String
     */
    public function getEdtForDevice($deviceId)
    {
        $edt = $this->getTable()->getEdtForDevice($deviceId);
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