<?php

/**
 * Table "ev_all"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Ev_All extends Falcon_Table_Common
{
    /**
     * Готовит базовый запрос для работы с событиями
     * @param {Integer[]} $objectIds Айдишники объектов, чьи события надо собрать
     * @param {String} $start Дата начала периода
     * @param {String} $end Дата завершения периода
     * @param {Integer[]} $ignoredEvents Айдишники типов событий которые надо отсеять
     * @param {Mixed[]} $values Значения которые надо достать из базы
     * @return Zend_Db_Statement
     */
    protected function getBaseQuery($objectIds, $start, $end,
                                    $ignoredEvents, $values)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from(['e' => 'ev_all'], $values)
            ->where('e.id_obj in(?)', $objectIds)
            ->where('e.dt >= ?', $start)
            ->where('e.dt <= ?', $end);

        foreach ($ignoredEvents as $ignored) {
            $sql->where('e.id_event <> ?', $ignored);
        }

        return $sql;
    }

    /**
     * Return sql for workaround
     */
    public function getBaseQueryFiltered($ids, $start, $end,
                                         $ignored, $values)
    {
        $sql = "select " . implode(', ', $values) . " from ev_all e "
            . "where (";

        if (isset($ids['users'])) {
            $sql .= "(e.id_obj in (" . implode(', ', $ids['users']) . ")"
                . " AND NOT e.id_event in(" . implode(', ', $ignored['devices'])
                . ")) OR ";
        }

        $sql .= "(e.id_obj in(" . implode(', ', $ids['devices']) . ")"
            . " AND NOT e.id_event in(" . implode(', ', $ignored['users'])
            . ")))"
            . " AND e.dt >= '" . $start . "' AND e.dt <= '" . $end . "'";

        return $sql;
    }

    /**
     * Возвращает страницу из списка событий за период
     * @param {Integer[]} $objectIds Айдишники объектов, чьи события надо собрать
     * @param {String} $start Дата начала периода
     * @param {String} $end Дата завершения периода
     * @param {Integer} $page Номер страницы
     * @param {Integer} $limit Количество событий на страницу
     * @param {String} $sortProp Свойство, по которому сортировка
     * @param {String} $sortDirection Направление сортировки
     * @param {Integer[]} $ignoredEvents Айдишники типов событий которые надо отсеять
     * @return Array[]
     */
    public function loadEvents($objectIds, $start, $end, $page, $limit,
                               $sortProp, $sortDirection, $ignoredEvents)
    {
        $db = $this->_db;
        $values = ['id_event as eventid', 'val as eventval', 'dt',
            'id_obj as ownerid'];
        // Workaround
        //if (isset($objectIds['users'])) {
        $sql = $this->getBaseQueryFiltered($objectIds, $start, $end,
            $ignoredEvents, $values);
        $sql .= ' order by ' . $sortProp . ' ' . $sortDirection;
        $sql .= ' limit ' . $limit . ' offset ' . ($limit * ($page - 1));
        /*} else {
            $objectIds = $objectIds['devices'];
            $ignoredEvents = $ignoredEvents['default'];
            $sql = $this->getBaseQuery($objectIds, $start, $end,
                $ignoredEvents, $values);
            $sql->order($sortProp . ' ' . $sortDirection)->limitPage($page, $limit);
        }*/
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Возвращает количество событий за период
     * @param {Integer[]} $objectIds Айдишники объектов, чьи события надо собрать
     * @param {String} $start Дата начала периода
     * @param {String} $end Дата завершения периода
     * @param {Integer[]} $ignoredEvents Айдишники типов событий которые надо отсеять
     * @return Array[]
     */
    public function countEvents($objectIds, $start, $end, $ignoredEvents)
    {
        $db = $this->_db;
        $values = [new Zend_Db_Expr('count(*)')];
        //if (isset($objectIds['users'])) {
        $values = ['count(*)'];
        $sql = $this->getBaseQueryFiltered($objectIds, $start, $end,
            $ignoredEvents, $values);
        /*} else {
            $objectIds = $objectIds['devices'];
            $ignoredEvents = $ignoredEvents['default'];
            $sql = $this->getBaseQuery($objectIds, $start, $end,
            $ignoredEvents, $values);
        }*/

        $count = $db->query($sql)->fetchColumn();
        return (int)$count;
    }
}
