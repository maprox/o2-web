<?php

/**
 * Table "x_notification_action" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Notification_Action extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_notification',
        'id_action_type',
        'activate_state',
        'state'
    ];

    public static $parentFieldLink = 'id_notification';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_notification_action_param',
            'alias' => 'params',
            'fields' => ['name', 'value']
        ]
    ];

}
