<?php

/**
 * Class of "mon_device_sensor_convertion" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Sensor_Conversion extends Falcon_Mapper_Common
{
    /**
     * Udates conversion for specified sensor
     * @param int $sensorId
     * @param array $conversion
     */
    public function updateBySensorId($sensorId, $conversion)
    {
        $this->getTable()->updateBySensorId($sensorId, $conversion);
    }
}