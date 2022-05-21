<?php

/**
 * Class of notification setting type table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Record_X_Notification_Setting_Type extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'single',
        'state'
    ];
}
