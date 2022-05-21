<?php

/**
 * Table "x_notification_action_param" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Notification_Action_Param extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_action',
        'name',
        'value'
    ];

    public static $parentFieldLink = 'id_action';
}
