<?php

/**
 * Table "x_person_phone" record class
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person_Phone extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Multiple
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_person',
        'number',
        'note',
        'isprimary',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_person', 'number', 'note'];

    public static $parentFieldLink = 'id_person';
}
