<?php

/**
 * Class of offer table record
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Dn_Offer extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_firm_for',
        'id_user',
        'sdt',
        'edt',
        'num',
        'state'
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        $this->set('sdt', date(DB_DATE_FORMAT));
        return parent::insert();
    }

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_firm',
            'alias' => 'firm',
            'key' => 'id_firm',
            'fields' => ['*']
        ],
    ];
}