<?php

/**
 * Table "x_notification_state" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Notification_State extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_notification',
        'param',
        'dt',
        'state',
        'data'
    ];
}
