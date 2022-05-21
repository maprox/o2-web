<?php

/**
 * Class of address table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_A_Address extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_address',
        'id_lang',
        'id_street',
        'house',
        'flat',
        'floor',
        'index',
        'shortname',
        'fullname',
        'state',
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = ['id_street'];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_address',
        'id_lang'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('id_address')) {
            $this->set('id_address', $this->getMapper()->getNextId());
        }
        return parent::insert();
    }
}