<?php

/**
 * Class of "mon_fuel_consumption_report_item" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Fuel_Consumption_Report_Item extends Falcon_Mapper_Common
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
            $sql->join(
                'mon_fuel_consumption_report',
                'mon_fuel_consumption_report.id = t.id_fuel_consumption_report',
                []
            );
        }
        return 'mon_fuel_consumption_report';
    }
}