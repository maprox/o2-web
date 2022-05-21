<?php

/**
 * Table "mon_device_sensor_conversion"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Device_Sensor_Conversion extends Falcon_Table_Common
{
    /**
     * Udates conversion for specified sensor
     * @param int $sensorId
     * @param array $conversion
     */
    public function updateBySensorId($sensorId, $conversion)
    {
        if ($conversion && is_array($conversion)) {
            $this->query('delete from mon_device_sensor_conversion
				where id_sensor = ?', $sensorId);
            foreach ($conversion as $point) {
                if (isset($point->x) && isset($point->y)) {
                    $this->insert([
                        'id_sensor' => $sensorId,
                        'x' => $point->x,
                        'y' => $point->y
                    ]);
                }
            }
        }
    }
}