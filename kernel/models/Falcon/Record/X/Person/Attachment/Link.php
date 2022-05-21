<?php

/**
 * Table "x_person_attachment_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person_Attachment_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_x_person',
        'id_x_attachment'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_x_person',
        'id_x_attachment'
    ];

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id_x_person';

    // TODO: may be create parent class for "attachment_link" records
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

}
