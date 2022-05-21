<?php

/**
 * Class of "mon_device_sensor_history_setting" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Sensor_History_Setting extends Falcon_Mapper_Common
{
    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('x_user', 'x_user.id = t.id_user', []);
        }
        return 'x_user';
    }
}