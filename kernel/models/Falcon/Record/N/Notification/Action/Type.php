<?php

/**
 * Class of tariff option table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_N_Notification_Action_Type extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'identifier',
        'frontend_send',
        'singleton',
        'state'
    ];
}
