<?php

/**
 * Table "sdesk_issue" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Sdesk_Issue extends Falcon_Record_Abstract
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
        'state'
    ];

    /**
     * Table fields
     * @var String[]
     */
    public static $requiredFields = [
        'description',
        'id_client_firm',
        'id_contact_person',
        'id_issue_type',
        'id_service',
        'id_priority',
        'id_source',
        'id_state'
    ];

    /**
     * Returns next available number for issue
     * @param type $firmId
     * @return int
     */
    public function getNextNum($firmId)
    {
        return $this->getMapper()->getNextNum($firmId);
    }
}
