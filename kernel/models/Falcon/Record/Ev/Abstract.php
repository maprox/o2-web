<?php

/**
 * Common class for event tables ev_
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id$
 * @link       $HeadURL$
 */
abstract class Falcon_Record_Ev_Abstract extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_obj',
        'id_event',
        'val',
        'dt'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_obj',
        'id_event',
        'dt'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {

        if ($this->get('dt') == NULL) {
            $this->set('dt', $this->dbDate());
        }

        parent::insert();

        return $this;
    }
}
