<?php

/**
 * Table "dn_worker_post_specialization_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Worker_Post_Specialization_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_post',
        'id_specialization'
    ];
}
