<?php

/**
 * Table "sdesk_view_issue" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_View_Issue extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'num',
        'description',
        'id_client_firm',
        'id_contact_person',
        'id_issue_type',
        'id_service',
        'id_priority',
        'deadline_dt',
        'id_responsible_user',
        'id_source',
        'id_state',
        'source_raw_data',
        'create_id_user',
        'create_dt',
        'close_id_user',
        'close_dt',
        'state',
        'source',
        'sourcename',
        'servicename',
        'issuetype',
        'priorityname',
        'priorityposition',
        'priorityposition_display',
        'statename',
        'statetype',
        'attachments_count',
        'comments_count',
        'clientfirm',
        'clientfirm_display',
        'contactperson'
    ];
}
