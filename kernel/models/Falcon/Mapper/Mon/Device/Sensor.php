<?php

/**
 * Class of "mon_device_sensor" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Sensor extends Falcon_Mapper_Common
{
    /**
     * Load sensor conversion points by sensorId
     * @param int $sensorId
     * @return array
     */
    public function loadConversion($sensorId)
    {
        $m = Falcon_Mapper_Mon_Device_Sensor_Conversion::getInstance();
        return $m->loadBy(function ($sql) use ($sensorId) {
            $sql
                ->where('id_sensor = ?', $sensorId);
        }, ['fields' => ['x', 'y']]);
    }

    /**
     * Sets the conversion list to the specified sensor
     * @param int $sensorId
     * @param array $conversionList
     */
    public function setConversion($sensorId, $conversion)
    {
        $m = Falcon_Mapper_Mon_Device_Sensor_Conversion::getInstance();
        $m->updateBySensorId($sensorId, $conversion);
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('mon_device', 'mon_device.id = t.id_device', []);
        }
        return 'mon_device';
    }
}
