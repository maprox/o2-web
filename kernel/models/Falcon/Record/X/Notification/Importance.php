<?php

/**
 * Class of notification importance table record
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Notification_Importance extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'state'
    ];
}
