<?php

/**
 * Table "z_lock" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Z_Lock extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'type',
        'kill_time',
        'unlock_time',
        'locked_at',
        'last_start',
        'last_end'
    ];

    /**
     * Устанавливает лок. Возвращает время смерти для текущего процесса.
     * @param {Integer} $id id залоченной сущности
     * @return String
     */
    public function setLock($id)
    {
        $offset = date_parse($this->get('kill_time'));
        $offset = $offset['hour'] * 3600 +
            $offset['minute'] * 60 + $offset['second'];

        $currTime = date(DB_DATE_FORMAT);
        $killTime = date(DB_DATE_FORMAT, time() + $offset);

        $item = Falcon_Mapper_Z_Lock_Item::getInstance()->load([
            'id_lock = ?' => $this->getId(),
            'id_item = ?' => $id
        ]);

        if (!$item) {
            $item = new Falcon_Record_Z_Lock_Item([
                'id_lock' => $this->getId(),
                'id_item' => $id,
            ]);
            $item->insert();
        } else {
            $item = $item[0];
        }

        $item->set('locked_at', $currTime);
        $item->set('last_start', $currTime);
        $item->update();

        return $killTime;
    }
}
