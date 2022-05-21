<?php

/**
 * Class of address country table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: $
 * @link       $HeadURL: $
 */
class Falcon_Record_A_City extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_city',
        'id_lang',
        'id_country',
        'name',
        'state',
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id_city',
        'id_lang'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('id_city')) {
            $this->set('id_city', $this->getMapper()->getNextId());
        }
        return parent::insert();
    }
}
