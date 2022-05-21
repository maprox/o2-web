<?php

/**
 * Table "session" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Session extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_user',
        'is_master',
        'terminated',
        'modified',
        'lifetime',
        'data'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('is_master')) {
            $this->getMapper()->terminate($this->get('id_user'));
        }
        parent::insert();
        return $this;
    }

    /**
     * Tells, whether this session is terminated
     * @return {Boolean}
     */
    public function isTerminated()
    {
        return (bool)$this->get('terminated');
    }
}
