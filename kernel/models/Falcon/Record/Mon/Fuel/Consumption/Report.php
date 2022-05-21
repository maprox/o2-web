<?php

/**
 * Table "mon_fuel_consumption_report" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Fuel_Consumption_Report extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'dt',
        'id_division',
        'status',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_division' => [
            // access mapper config
            'dn_division' => 'id',
            // joined view config
            'fields' => [
                'id',
                'name'
            ]
        ]
    ];

}
