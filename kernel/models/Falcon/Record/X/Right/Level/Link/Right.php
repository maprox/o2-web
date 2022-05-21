<?php

/**
 * Table "x_right_level_link_right" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Right_Level_Link_Right extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_right',
        'id_right_level'
    ];

    public static $parentFieldLink = 'id_right_level';

    /**
     * Join condition for state check
     * @var @var String[]
     */
    public static $checkState = [
        'x_right',
        'x_right.id = t.id_right'
    ];
}
