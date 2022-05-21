<?php

/**
 * Table "sdesk_service_time_detail" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Service_Time_Detail extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_service_time',
        'stime',
        'etime',
        'dow',
        'state'
    ];
}
