<?php

/**
 * Table "mon_sim_card" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Sim_Card extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_client_firm',
        'id_device_protocol',
        'account_number',
        'phone_number',
        'tariff',
        'imei_sim',
        'imei_tracker',
        'provider',
        'connection_date',
        'creation_date',
        'settings_key',
        'note',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Foreign keys
     * @var type
     */
    public static $foreignKeys = [
        //'id_company_owner' => array('x_company' => 'id'),
        'id_client_firm' => [
            // access mapper config
            'x_firm' => 'id',
            'tablealias' => 'f',
            // joined view config
            'fields' => [
                'id_company'
            ]
        ]
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_company',
            'alias' => 'x_company',
            'key' => 'id_client_firm$id_company',
            'fields' => ['name']
        ]
    ];
}
