<?php

/**
 * Класс для того, чтобы "лочить" выполнение определенных участков
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Locker extends Falcon_Db_Singleton
{
    /**
     * Возвращает, залочен ли участок.
     * В простых случаях можно не вызывать и сразу дернуть функцию lock.
     * В случае если уже не занято будет "die"
     * @param {String} $type Тип лока
     * @param {Integer} $id id залоченной сущности
     * @return Boolean
     */
    public function isLocked($type, $id)
    {
        $mapper = Falcon_Mapper_Z_Lock::getInstance();
        $lock = $mapper->load(['type = ?' => $type]);

        if (!$lock) {
            return false;
        }

        $unlock = $mapper->intervalToSeconds($lock[0]->get('unlock_time'));

        return (bool)Falcon_Mapper_Z_Lock_Item::getInstance()->getCount([
            'id_lock = ?' => $lock[0]->getId(),
            'id_item = ?' => $id,
            'locked_at > ?' => date(DB_DATE_FORMAT, time() - $unlock)
        ]);
    }

    /**
     * Лочит участок, вызывать в начале
     * @param {String} $type Тип лока
     * @param {Integer} $id id залоченной сущности
     * @param {Callback} $callback функция для вызова при неудаче
     */
    public function lock($type, $id, $callback = 'dieOnLock')
    {
        if ($callback && $this->isLocked($type, $id)) {
            call_user_func($callback);
        }

        $records = Falcon_Mapper_Z_Lock::getInstance()
            ->load(['type = ?' => $type]);

        if (empty($records)) {
            return;
        }

        $record = $records[0];
        $killTime = $record->setLock($id);

        if ($callback) {
            register_tick_function([$this, 'testKillTime'],
                strtotime($killTime), $callback);
        }
    }

    /**
     * Снимает лок, вызывать в конце
     * @param {String} $type Тип лока
     * @param {Integer} $id id залоченной сущности
     */
    public function unlock($type, $id)
    {
        $lock = Falcon_Mapper_Z_Lock::getInstance()
            ->load(['type = ?' => $type]);

        if (empty($lock)) {
            return;
        }

        $records = Falcon_Mapper_Z_Lock_Item::getInstance()->load([
            'id_lock = ?' => $lock[0]->getId(),
            'id_item = ?' => $id
        ]);

        if (empty($records)) {
            return;
        }

        $record = $records[0];
        $record->removeLock();
    }

    /**
     * Проверяет не время ли умирать.
     * @param {Date} $killTime Время смерти
     * @param {Callback} $callback функция для завершения
     */
    public function testKillTime($killTime, $callback)
    {
        if ($killTime < time()) {
            call_user_func($callback);
        }
    }
}
