<?php

/**
 * Table "x_person_driver_license" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person_Driver_License extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
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
        'has_category_a',
        'has_category_b',
        'has_category_c',
        'has_category_d',
        'has_category_e',
        'valid_until_dt',
        'driver_experience_from_dt',
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
