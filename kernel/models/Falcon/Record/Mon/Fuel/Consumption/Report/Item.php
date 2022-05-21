<?php

/**
 * Table "mon_fuel_consumption_report_item" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Fuel_Consumption_Report_Item extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_fuel_consumption_report',
        'num',
        'id_vehicle',
        'id_responsible_person',
        'consumption_rate',
        'consumption_limit',
        'mileage_waylist',
        'mileage_track',
        'consumption_by_norm',
        'consumption_fact',
        'previous_month_remainder',
        'received',
        'next_month_remainder',
        'overrun',
        'state'
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = [
        'id_fuel_consumption_report',
        'num'
    ];


    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_vehicle' => [
            // access mapper config
            'mon_vehicle' => 'id',
            // joined view config
            'fields' => [
                'license_number',
                'car_model'
            ]
        ],
        'id_fuel_consumption_report'
        => ['mon_fuel_consumption_report' => 'id']
    ];


}
