<?php

/**
 * Table "mon_vehicle_driver" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Vehicle_Driver extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_vehicle',
        'id_driver',
        'sdt',
        'edt',
        'state'
    ];


    /**
     * Required fields
     * @var String[]
     */
    public static $requiredFields = [
        'id_vehicle',
        'id_driver'
    ];

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id_vehicle';

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
            'fields' => ['*']
        ],
        'id_driver' => [
            // access mapper config
            'dn_worker' => 'id_person',
            // joined view config
            'fields' => ['*']
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged'];
}
