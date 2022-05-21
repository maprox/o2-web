<?php

/**
 * Class of "x_access" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Access extends Falcon_Mapper_Common
{
    /**
     * Returns all entries for given object id and right
     * @param type $id_object
     * @param type $right
     * @return type
     */
    public function getForObject($id_object, $right)
    {
        $records = $this->loadBy(
            function ($sql) use ($id_object, $right) {
                $sql
                    ->where('id_object = ?', $id_object)
                    ->where('"right" = ?', $right)
                    ->order('sdt desc');
            }
        );

        return $records;
    }

    /**
     * Returns all entries for given ids and right
     * @param Array $ids
     * @param type $right
     * @return type
     */
    public function getForObjects($ids, $right, $active = false)
    {
        $records = $this->loadBy(
            function ($sql) use ($ids, $right, $active) {
                $sql
                    ->where('id_object IN (?)', $ids)
                    ->where('"right" = ?', $right);

                if ($active) {
                    $sql
                        ->where('sdt <= current_timestamp')
                        ->where('edt > current_timestamp OR edt IS NULL')
                        ->where('status = ?',
                            Falcon_Record_X_Access::STATUS_ACTIVE);
                }

                $sql->order('sdt desc');
            }
        );

        return $records;
    }

    /**
     * Returns only active entries for given object id and right
     * @param type $id_object
     * @param type $right
     * @return array
     */
    public function getActiveForObject($id_object, $right)
    {
        $records = $this->loadBy(
            function ($sql) use ($id_object, $right) {
                $sql
                    ->where('id_object = ?', $id_object)
                    ->where('"right" = ?', $right)
                    ->where('sdt <= current_timestamp')
                    ->where('edt > current_timestamp OR edt IS NULL')
                    ->where('status = ?', Falcon_Record_X_Access::STATUS_ACTIVE)
                    ->order('sdt desc');
            }
        );

        return $records;
    }

    /**
     * Returns an array of object firms
     * @param Falcon_Record_Abstract $entity
     * @param string $time
     * @return int[]
     */
    public function getObjectSharedFirmIds($entity, $time = null)
    {
        return $this->getTable()->getObjectSharedFirmIds($entity, $time);
    }

    /**
     * Returns an array of object users
     * @param Falcon_Record_Abstract $entity
     * @param string $time
     * @return int[]
     */
    public function getObjectSharedUserIds($entity, $time = null)
    {
        return $this->getTable()->getObjectSharedUserIds($entity, $time);
    }

}
