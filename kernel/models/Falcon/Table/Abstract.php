<?php

/**
 * Abstract class of table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Table_Abstract extends Zend_Db_Table_Abstract
{
    /**
     * True to force casting query rows values to numbers
     * @var type
     */
    protected $forceCastRowsToInt = false;

    /**
     * @construct
     */
    public function __construct()
    {
        $this->setOptions([
            self::NAME => self::getName(),
//			self::METADATA_CACHE => Falcon_Cacher::getInstance()->getWorker(),
        ]);
        parent::__construct();
    }

    /**
     * Get table name
     * @return String
     */
    final public static function getName()
    {
        return strtolower(str_replace(
            'Falcon_Table_', '', get_called_class()));
    }

    /**
     * Perform a custom query, return an array of an associative arrays
     * @param $sql String Query string
     * @param $bind Mixed[] Query params
     * @return Array[] Result data
     */
    final public function query($sql, $bind = [])
    {
        $data = $this->_db->query($sql, $bind);
        $rows = $data->fetchAll(Zend_Db::FETCH_ASSOC);
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Perform a custom update/insert query, return affected count
     * @param $sql String Query string
     * @param $bind Mixed[] Query params
     * @return Array[] Result data
     */
    final public function queryWrite($sql, $bind = [])
    {
        $data = $this->_db->query($sql, $bind);
        return $data->rowCount();
    }

    /**
     * Tries to cast rows to int/float
     * @param type $rows
     * @param Boolean $force
     * @return type
     */
    public function tryToCastRowsToInt(&$rows, $force = false)
    {
        // если 32-разрядная ОС
        // (ну или, по крайней мере, так написано в конфиге)
        if ($this->forceCastRowsToInt
            || $force
            || !Zend_Registry::get('config')->is64
        ) {
            $types = [];
            $RECORD_CLASS = self::getRecordClass();
            foreach ($rows as &$row) {
                foreach ($row as $key => &$field) {
                    if (!isset($types[$key])) {
                        $types[$key] = $RECORD_CLASS::getFieldType($key);
                    }
                    if (($types[$key] == null)
                        || ($types[$key] == Falcon_Table_Field_Type::INTEGER)
                        || ($types[$key] == Falcon_Table_Field_Type::SMALLINT)
                        || ($types[$key] == Falcon_Table_Field_Type::BIGINT)
                    ) {
                        if ((string)(int)$field === $field) {
                            $field = (int)$field;
                        } elseif ((string)(float)$field === $field) {
                            $field = (float)$field;
                        }
                    }
                }
            }
        }
        return $rows;
    }

    /**
     * Force cast rows to int
     * @param type $rows
     * @return type
     */
    public function castRowsToInt(&$rows)
    {
        return $this->tryToCastRowsToInt($rows, true);
    }

    /**
     * Perform a custom query, return a row (associative array)
     * @param $sql String Query string
     * @param $bind Mixed[] Query params
     * @param $rowIndex Integer Row index
     * @return Mixed[] Result data
     */
    final protected function queryRow($sql, $bind = [], $rowIndex = 0)
    {
        $data = $this->query($sql, $bind);
        return isset($data[$rowIndex]) ? $data[$rowIndex] : null;
    }

    /**
     * Perform a custom query, return a column (array)
     * @param $sql String Query string
     * @param $bind Mixed[] Query params
     * @param $colIndex String Column index
     * @return Mixed[] Result data
     */
    final protected function queryCol($sql, $bind = [], $colIndex = null)
    {
        $data = $this->query($sql, $bind);
        $col = [];
        foreach ($data as $row) {
            if (!count($row)) {
                return null;
            }
            if ($colIndex === null) {
                $col[] = array_shift($row);
                continue;
            }
            if (!isset($row[$colIndex])) {
                return null;
            }
            $col[] = $row[$colIndex];
        }
        return $col;
    }

    /**
     * Perform a custom query, return a cell
     * @param $sql String Query string
     * @param $bind Mixed[] Query params
     * @param $colIndex Integer Column index
     * @param $rowIndex Integer Row index
     * @return Mixed Result data
     */
    final protected function
    queryCell($sql, $bind = [], $colIndex = null, $rowIndex = 0)
    {
        $data = $this->query($sql, $bind);
        if (!isset($data[$rowIndex]) || !count($data[$rowIndex])) {
            return null;
        }
        if ($colIndex === null) {
            return array_shift($data[$rowIndex]);
        }
        if (!isset($data[$rowIndex][$colIndex])) {
            return null;
        }
        return $data[$rowIndex][$colIndex];
    }

    /**
     * Load records by a specified callback function
     * @param Callable $queryFn
     * @param array $params Order and paging params
     * @return Mixed[]
     */
    public function loadBy($queryFn, $params = [])
    {
        $db = $this->_db;
        $queryFields = '*';
        if (isset($params['fields'])) {
            $queryFields = $params['fields'];
        }
        // compile base sql
        $sql = $db->select()->from(
            ['t' => $this->getName()],
            $queryFields
        );
        if (isset($queryFn)) {
            $queryFn($sql);
        }
        // prepare query
        $this->prepareQuery($sql, $params);

        // execute query
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }

    /**
     * Apply sort and paging to query
     * @param Zend_Db_Select $query
     * @param array $params
     * @example <pre>
     * prepareQuery($query, array(
     *   'order' => array(
     *     (object)array(
     *       'property' => 'dt',
     *       'direction' => 'desc'
     *     ),
     *     (object)array(
     *       'property' => 'name',
     *       'direction' => 'asc'
     *     )
     *   ),
     *   'page' => array(
     *     'start' => 0,
     *     'count' => 25
     *   )
     * );
     * </pre>
     */
    public function prepareQuery(&$query, $params = [])
    {
        if (!isset($params) || !is_array($params)) {
            return $this;
        }
        // add ordering
        if (isset($params['order']) && is_array($params['order'])) {
            $orderBy = [];
            foreach ($params['order'] as $orderItem) {
                if (isset($orderItem->property)) {
                    $direction = isset($orderItem->direction) ?
                        $orderItem->direction : 'asc';
                    $orderBy[] = $orderItem->property . ' ' . $direction;
                }
            }
            if (count($orderBy) > 0) {
                $query->order($orderBy);
            }
        }
        // add paging
        if (isset($params['page'])) {
            $p = $params['page'];
            $start = isset($p['start']) ? $p['start'] : 0;
            $count = isset($p['count']) ? $p['count'] : 25;
            $query->limit($count, $start);
        }
        return $this;
    }

    /**
     * Returns record class name for this table
     * @return string
     */
    public static function getRecordClass()
    {
        return 'Falcon_Record_' . ucwords_custom(self::getName(), '_');
    }

    /**
     * Returns data about column types
     * @return mixed
     */
    public function getColumnTypes()
    {
        $data = $this->info(self::METADATA);
        array_walk($data, function (&$item) {
            $item = $item['DATA_TYPE'];
        });
        return $data;
    }
}
