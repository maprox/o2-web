<?php

/**
 * Table "x_person_email" record class
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Person_Email extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Multiple
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_person',
        'address',
        'note',
        'isprimary',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_person', 'address', 'note'];

    public static $parentFieldLink = 'id_person';

}
