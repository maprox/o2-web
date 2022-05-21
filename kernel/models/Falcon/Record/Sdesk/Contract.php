<?php

/**
 * Table "sdesk_contract" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Contract extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_contract',
        'id_user',
        'id_group',
        'id_service',
        'id_service_time',
        'id_service_level'
    ];
}
