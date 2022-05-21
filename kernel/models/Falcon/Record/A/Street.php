<?php

/**
 * Class of address street table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: $
 * @link       $HeadURL: $
 */
class Falcon_Record_A_Street extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_street',
        'id_lang',
        'id_city',
        'name',
        'state',
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_street',
        'id_lang'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('id_street')) {
            $this->set('id_street', $this->getMapper()->getNextId());
        }
        return parent::insert();
    }
}
