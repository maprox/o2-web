<?php

/**
 * Class of package table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Package_Right_Level_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_package',
        'id_right_level'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_package',
        'id_right_level'
    ];

    public static $parentFieldLink = 'id_package';
}
