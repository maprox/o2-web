<?php

/**
 * Table "dn_worker" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Worker extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Inherited
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_person',
        'employee_number',
        'id_post'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_person'
    ];

    /**
     * Key for joining inheriting table
     * @var String
     */
    public static $inheritJoinKey = 'id_person';
    /**
     * Fields to grab from inheriting table
     * @var String
     */
    public static $extendedFields = ['*'];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_post' => [
            // access mapper config
            'dn_worker_post' => 'id',
            'fields' => [
                'name'
            ]
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Returns parent table name
     * @return string
     */
    public function getParentTableName()
    {
        return 'x_person';
    }
}
