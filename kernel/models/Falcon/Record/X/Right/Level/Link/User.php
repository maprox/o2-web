<?php

/**
 * Table "x_right_level_link_user" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Right_Level_Link_User extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_user',
        'id_right_level'
    ];

    public static $parentFieldLink = 'id_user';
}
