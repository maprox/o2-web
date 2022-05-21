<?php

/**
 * Table "x_person" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'firstname',
        'secondname',
        'lastname',
        'gender',
        'birth_dt',
        'birth_place',
        'residential_address',
        'note',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Params for converting id to string representation
     */
    public static $nameConvertParams = [
        'field' => ['firstname', 'lastname', 'secondname'],
        'tpl' => '%s %s %s',
        'strict' => false
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = ['lastname'];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_person_email',
            'alias' => 'email',
            'fields' => ['address', 'note', 'isprimary', 'state']
        ],
        [
            'table' => 'x_person_phone',
            'alias' => 'phone',
            'fields' => ['number', 'note', 'isprimary', 'state']
        ],
        [
            'table' => 'x_person_attachment_link',
            'alias' => 'attachments',
            'fields' => ['*']
        ],
        'passport',
        'driver_license'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id';
}
