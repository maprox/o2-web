<?php

/**
 * Table "x_person_passport" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person_Passport extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_person',
        'num',
        'issue_dt',
        'issuer',
        'images'
    ];

    /**
     * Primary key
     * @var String[]
     */
    public static $primaryKey = ['id_person'];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_person';
}
