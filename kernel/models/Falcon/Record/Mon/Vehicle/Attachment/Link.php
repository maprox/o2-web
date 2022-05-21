<?php

/**
 * Table "mon_vehicle_attachment_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Vehicle_Attachment_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_mon_vehicle',
        'id_x_attachment'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_mon_vehicle',
        'id_x_attachment'
    ];

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id_mon_vehicle';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    /*public static $linkedRecords = array(
        array(
            'table' => 'x_attachment',
            'alias' => 'files',
            'key' => 'id_x_attachment',
            'fields' => array('*'),
            'single' => true
        )
    );*/

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_x_attachment' => [
            // access mapper config
            'x_attachment' => 'id',
            // joined view config
            'fields' => [
                'id' => 'id',
                'name' => 'name',
                'mime' => 'mime',
                'dt' => 'dt',
                'state' => 'state'
            ]
        ]
    ];


    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged', 'journaled');

}
