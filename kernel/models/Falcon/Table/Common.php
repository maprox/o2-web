<?php

/**
 * Common class of table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Table_Common extends Falcon_Table_Abstract
{
    /**
     * Found db date results
     * @var String[]
     */
    private static $dateResult = [];

    /**
     * Gets maximum value of field in table
     * @param {String} $field
     * @return {Mixed}
     */
    public function getMax($field)
    {
        if (!is_string($field) || preg_match('/[^a-z_\d]/ui', $field)) {
            return 0;
        }
        $sql = "select max(" . $field . ") from " . $this->getName();
        return $this->queryCell($sql);
    }

    /**
     * Gets minimum value of field in table
     * @param {String} $field
     * @return {Mixed}
     */
    public function getMin($field)
    {
        if (!is_string($field) || preg_match('/[^a-z_\d]/ui', $field)) {
            return 0;
        }
        $sql = "select min(" . $field . ") from " . $this->getName();
        return $this->queryCell($sql);
    }

    /**
     * Gets timestamp from database
     * @param {String} $addTime - time to add, i.e. '4 days', '1 month' etc
     * @param {Boolean} $uncached
     * @return String
     */
    public function dbDate($addTime = null, $uncached = false)
    {
        if ($addTime) {
            $query = 'select localtimestamp + ? as servertime';
            $params = [$addTime];
        } else {
            $query = 'select localtimestamp as servertime';
            $params = [];
        }
        return $this->getDbDate($query, $params, $uncached);
    }

    /**
     * Clears cache for dbDate functions
     */
    public static function clearDbDateCache()
    {
        self::$dateResult = [];
    }

    /**
     * Searches db timestamp in cache, if not found fetches from db
     * @param {String} $query - query string
     * @param {Array} $params - query params
     * @param {Boolean} $uncached
     * @return String
     */
    private function getDbDate($query, $params, $uncached)
    {
        $hash = md5(serialize($params) . $query);
        if ($uncached || !isset($this->dateResult[$hash])) {
            $data = $this->query($query, $params);
            $this->dateResult[$hash] = current(current($data));
        }
        return $this->dateResult[$hash];
    }

    /**
     * Gets multiple records by their ids
     * @param {Integer[]} $ids
     * @return {Mixed}
     */
    public function loadByIds($ids)
    {
        $sql = "SELECT * FROM " . $this->getName() . " WHERE id IN(";
        foreach ($ids as $key => $id) {
            $id = (int)$id;
            if ($id < 1) {
                unset($ids[$key]);
                continue;
            }
            $sql .= "?,";
        }
        $sql = rtrim($sql, ",") . ")";
        return $this->query($sql, $ids);
    }

    /**
     * Gets record count for given where statement
     * @param {String[]} $where
     * @return {Integer}
     */
    public function getCount($where)
    {
        $db = $this->_db;
        $sql = $db->select()->from($this->getName(), ['count(*)']);
        foreach ($where as $condition) {
            $sql->where($condition);
        }
        $column = $db->query($sql)->fetchColumn();
        return (int)$column;
    }
}
