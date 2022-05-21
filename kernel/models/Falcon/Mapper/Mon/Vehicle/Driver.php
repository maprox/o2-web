<?php

/**
 * Class of "mon_vehicle_driver" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Mapper_Mon_Vehicle_Driver extends Falcon_Mapper_Common
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
            $sql->join('mon_vehicle',
                'mon_vehicle.id = t.id_vehicle', []);
        }
        return 'mon_vehicle';
    }
}