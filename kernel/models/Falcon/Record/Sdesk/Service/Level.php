<?php

/**
 * Table "sdesk_service_level" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Service_Level extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
        'minutes_idle',
        'minutes_between_incidents',
        'state'
    ];
}
