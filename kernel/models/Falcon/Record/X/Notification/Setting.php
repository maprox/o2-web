<?php

/**
 * Class of notification setting table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Notification_Setting extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_user',
        'id_type',
        'address',
        'active',
        'state'
    ];
}
