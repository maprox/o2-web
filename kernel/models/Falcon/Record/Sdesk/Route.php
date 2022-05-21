<?php

/**
 * Table "sdesk_route" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Route extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_service',
        'id_issue_type',
        'id_state',
        'id_state_next',
        'id_executer',
        'state'
    ];
}
