<?php

/**
 * Table "z_lock_item" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Z_Lock_Item extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_item',
        'id_lock',
        'locked_at',
        'last_start',
        'last_end'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_item', 'id_lock'];

    /**
     * Снимает лок
     */
    public function removeLock()
    {
        $this->set('locked_at', date(DB_DATE_FORMAT, 0));
        $this->set('last_end', $this->dbDate());
        $this->update();
    }
}
