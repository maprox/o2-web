<?php

/**
 * Table "mon_vehicle" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Vehicle extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
        'id_fuel',
        'license_number',
        'garage_number',
        'fuel_expense',
        'bus_license_type',
        'bus_license_reg_num',
        'bus_license_series',
        'bus_license_number',
        'id_device',
        'id_driver',
        'dt_production',
        'state',
        'vin',
        'car_model',
        'car_type',
        'category',
        'engine',
        'frame',
        'body',
        'body_color',
        'engine_power',
        'engine_power_measure',
        'engine_displacement',
        'engine_type',
        'max_mass',
        'unladen_mass',
        'id_division',
        'id_responsible'
    ];

    /**
     * Required fields
     * @var String[]
     */
    public static $requiredFields = [
        'name'
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
        //'id_company_owner' => array('x_company' => 'id'),
        'id_fuel' => [
            // access mapper config
            'mon_fuel' => 'id',
            'fields' => [
                'name'
            ]
        ],
        'id_division' => [
            // access mapper config
            'dn_division' => 'id',
            // joined view config
            'fields' => [
                'name'
            ]
        ]
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_vehicle_attachment_link',
            'alias' => 'attachments',
            'fields' => ['*']
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

}
