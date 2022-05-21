<?php

/**
 * Abstract class of mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Mapper_Abstract extends Falcon_Singleton
{
    /**
     * Belonged table
     * @var instanceof Falcon_Table_Abstract
     */
    private $table;

    /**
     * Record class name
     * @var String
     */
    protected $recordClassName;

    /**
     * Allow to create records with given id
     * @var Boolean
     */
    protected $allowInsertId = false;

    /**
     * Hash array of cached data
     * @var array
     */
    protected $_cache = [];

    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = true;

    /**
     * Can return access list
     * @var type
     */
    protected $allowAccessList = true;

    /**
     * Any additional data
     * @var array
     */
    protected $params = [];

    /**
     * True to enable caching of the whole mapper's table (false by default).
     * @var bool
     */
    protected $caching = false;

    /**
     * @construct
     */
    protected function __construct()
    {
        parent::__construct();
        $tableClassName = str_replace('Mapper', 'Table', get_class($this));
        $this->recordClassName =
            str_replace('Mapper', 'Record', get_class($this));
        $this->table = new $tableClassName();
    }

    /**
     * Get table
     * @return instanceof Falcon_Table_Abstract
     */
    final protected function getTable()
    {
        return $this->table;
    }

    /**
     * Get record class name
     * @return String
     */
    final public function getRecordClassName()
    {
        return $this->recordClassName;
    }

    /**
     * Get new record instance
     * @param Mixed[] $props Record properties
     * @return Falcon_Record_Abstract
     */
    final public function newRecord(Array $props = null)
    {
        // Setting props like this causes resetChanged()
        $record = new $this->recordClassName($props, false, false);
        return $record;
        //return $record->setProps($props);
    }

    /**
     * Where condition prepare
     * @param String [] [$where] Condition
     * @param Boolean [$loadDeleted]
     * @return Mixed[]
     *
     * @throws Exception
     */
    final protected function wherePrepare($where = null, $loadDeleted = false)
    {
        if (!$where && $loadDeleted) {
            return null;
        }
        if ($where === null) {
            $where = [];
        } elseif (!is_array($where)) {
            throw new Exception('Invalid $where argument');
        }
        $RECORD_CLASS = $this->recordClassName;
        if (!$loadDeleted && $RECORD_CLASS::hasField('state')) {
            $where['state != ?'] = Falcon_Record_Abstract::STATE_DELETED;
        }
        $adapter = $this->getTable()->getAdapter();
        $return = [];
        foreach ($where as $condition => $value) {
            $return[] = $adapter->quoteInto($condition, $value);
        }
        return $return;
    }

    /**
     * Getting table name
     * @return String
     */
    public function getName()
    {
        return $this->getTable()->getName();
    }

    /**
     * Load record by ID
     * @param Integer $id Record identifier
     * @param Boolean $toArray Export record data to array
     * @return Falcon_Record_Abstract/Mixed[]
     */
    public function loadRecord($id, $toArray = false)
    {
        $where = $this->getWhereById($id);
        $records = $this->load($where, true, true);
        if (!isset($records[0])) {
            return null;
        }
        return $toArray ? $records[0] : $this->newRecord($records[0]);
    }

    /**
     * Load record fields by ID
     * @param Integer $id Record identifier
     * @param String[] $fields Fields to load
     * @return Mixed[]
     */
    public function loadRecordFields($id, $fields)
    {
        $where = $this->getWhereById($id);
        $data = $this->getTable()->loadBy(
            function ($sql) use ($where, $fields) {
                /** @var Zend_Db_Select $sql */
                foreach ($where as $condition => $value) {
                    $sql->where($condition, $value);
                    $sql->limit(1);
                    $sql->reset(Zend_Db_Select::COLUMNS);
                    $sql->columns($fields);
                }
            });
        return isset($data[0]) ? $data[0] : [];
    }

    /**
     * Returns field converted to name. Actual for transforming ids like id_person,
     * id_firm, etc to string representation
     * @param string $field
     * @param mixed $defaultValue
     * @return Mixed
     */
    public function getConvertedNameForValue($field, $defaultValue)
    {
        $recordClass = $this->getRecordClassName();
        $values = $recordClass::getConversionValuesFor($field);

        if ($values) {
            if (isset($values[$defaultValue])) {
                return $values[$defaultValue];
            } else {
                return $defaultValue;
            }
        }

        $parent = $recordClass::getConversionTableFor($field);
        if (!$parent) {
            return $defaultValue;
        }

        $params = $this->getNameConversionParams($parent);

        if (!$params['convert_name']) {
            $mapperName = 'Falcon_Mapper_' . ucwords_custom($params['table']);
            $convertedValue = $mapperName::getInstance()
                ->loadRecordFields($defaultValue, $params['field']);
        } else {
            $recordName = 'Falcon_Record_' . ucwords_custom($params['table']);
            $record = new $recordName($defaultValue);

            $convertedValue = [];
            foreach ($params['field'] as $field) {
                $convertedValue[] = $record->getConvertedName($field);
            }
        }

        if (empty($convertedValue)
            || ($params['strict']
                && array_search(null, $convertedValue, true) !== false)
        ) {

            return $defaultValue;
        }

        return vsprintf($params['tpl'], $convertedValue);
    }

    /**
     * Returns field converted to name. Actual for transforming ids like id_person,
     * id_firm, etc to string representation
     * @param string $field
     * @param Falcon_Record_Abstract $record
     * @return Mixed
     */
    public function getConvertedNameForRecord($field, $record)
    {
        $defaultValue = $record->get($field);

        $params = $this->getNameConversionParams($record->getTableName());

        $convertedValue = [];
        foreach ($params['field'] as $field) {
            $convertedValue[] = $record->getConvertedName($field);
        }

        if (empty($convertedValue)
            || ($params['strict']
                && array_search(null, $convertedValue, true) !== false)
        ) {

            return $defaultValue;
        }

        return vsprintf($params['tpl'], $convertedValue);
    }

    /**
     * @param String $table
     * @return Mixed[]
     */
    protected function getNameConversionParams($table)
    {
        $className = 'Falcon_Record_' . ucwords_custom($table);

        $params = ['table' => $table];
        $params = array_merge($params, $className::$nameConvertParams);

        $params = array_replace([
            'field' => ['name'],
            'convert_name' => false,
            'tpl' => '%s',
            'strict' => true
        ], $params);

        if (!is_array($params['field'])) {
            $params['field'] = [$params['field']];
        }

        return $params;
    }

    /**
     * Load list of records
     * @param Mixed[] $where Condition
     * @param String $sortBy Sort by field. Can be omitted
     * @param Boolean $toArray Export record data to array
     * @param Boolean $loadDeleted Load deleted
     * @return Falcon_Record_Abstract[]/Array[]
     */
    public function load(Array $where = null, $sortBy = null,
                         $toArray = false, $loadDeleted = false)
    {
        if (is_bool($sortBy)) {
            $loadDeleted = $toArray;
            $toArray = $sortBy;
            $sortBy = null;
        }
        if (is_string($sortBy)
            && !preg_match('/\s(a|de)sc\s*^/ui', $sortBy)
        ) {
            $sortBy .= ' ASC';
        }

        $where = $this->wherePrepare($where, $loadDeleted);

        $rows = null;
        if ($this->caching) {
            $cacheKey = md5($this->getName() . '::' . json_encode([
                    'where' => $where,
                    'sort' => $sortBy
                ]));
            $cache = Falcon_Cacher::getInstance();
            $rows = $cache->get('table', $cacheKey);
        }

        if (!$rows) {
            $rows = $this->getTable()->fetchAll($where, $sortBy)->toArray();
            $this->getTable()->tryToCastRowsToInt($rows);

            if ($this->caching) {
                $cache->set($rows, 'table', $cacheKey);
            }
        }

        $records = [];
        foreach ($rows as $row) {
            $records[] = $toArray ? $row : $this->newRecord($row);
        }
        return $records;
    }

    /**
     * Insert new record to the table
     * @param instanceof Falcon_Record_Abstract $record New record
     * @return Integer Identifier of new record
     */
    public function insertRecord(Falcon_Record_Abstract $record)
    {
        $data = $record->toArray();
        foreach ($data as $key => $value) {
            if ($value === null) {
                unset($data[$key]);
            }
        }
        return $this->getTable()->insert($data);
    }

    /**
     * Bulk insert new records to the table
     * @param {Array} array Falcon_Record_Abstract $records records to add
     */
    public function insert($records)
    {
        foreach ($records as &$record) {
            $record = $record->toArray();
            unset($record['id']);
        }
        unset($record);
        $keys = reset($records);
        $keys = array_keys($keys);
        $name = $this->getName();
        $query = 'INSERT INTO ' . $name .
            ' (' . implode(',', $keys) . ') VALUES ';
        foreach ($records as &$record) {
            $query .= "('" . implode("','", $record) . "'),";
        }
        $query = rtrim($query, ',');
        return $this->getTable()->query($query);
    }

    /**
     * Remove record from the table by ID
     * @param Integer $id Record identifier
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function deleteRecord($id)
    {
        $where = $this->getWhereById($id);
        $this->delete($where);
        return $this;
    }

    /**
     * Remove records from the table
     * @param Mixed[] $where Condition
     * @param Boolean $loadDeleted Load deleted
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function delete(Array $where = null, $loadDeleted = false)
    {
        $where = $this->wherePrepare($where, $loadDeleted);
        $this->getTable()->delete($where);
        return $this;
    }

    /**
     * Update record in the table by identifier
     * @param Integer $id Record identifier
     * @param Mixed[] $data New fields values
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function updateRecord($id, Array $data = null)
    {
        $where = $this->getWhereById($id);
        $this->update($where, $data, true);
        return $this;
    }

    /**
     * Update records in the table
     * @param Mixed[] $where Condition
     * @param Mixed[] $data New fields values
     * @param Boolean $loadDeleted Load deleted
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function update(Array $where = null, Array $data = null,
                           $loadDeleted = false)
    {
        $where = $this->wherePrepare($where, $loadDeleted);
        if ($data !== null) {
            unset($data['id']);
            $this->getTable()->update($data, $where);
        }
        return $this;
    }

    /**
     * Trash record in the table by ID
     * @param Integer $id Record identifier
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function trashRecord($id)
    {
        $where = $this->getWhereById($id);

        $this->trash($where, true);
        return $this;
    }

    /**
     * Trash records in the table
     * @param Mixed[] $where Condition
     * @param Boolean $loadDeleted Load deleted
     * @return instanceof Falcon_Mapper_Abstract
     */
    public function trash(Array $where = null, $loadDeleted = false)
    {
        $RECORD_CLASS = $this->recordClassName;
        if (!$RECORD_CLASS::hasField('state')) {
            return $this;
        }
        $where = $this->wherePrepare($where, $loadDeleted);
        $this->getTable()->update([
            'state' => Falcon_Record_Abstract::STATE_DELETED
        ], $where);
        return $this;
    }

    /**
     * Prepares where array based on record key
     * @param Mixed $id record key
     * @return Array[]
     */
    protected function getWhereById($id)
    {
        $RECORD_CLASS = $this->recordClassName;
        $where = [];
        if (is_array($id)) {
            foreach ($id as $key => $value) {
                $where['"' . $key . '" = ?'] = $value;
            }
        } else {
            $idName = $RECORD_CLASS::getSimpleIdName();
            $where['"' . $idName . '" = ?'] = $id;
        }
        return $where;
    }

    /**
     * Returns firm restriction param
     * @return Boolean
     */
    public function getFirmRestriction()
    {
        return $this->firmRestriction;
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building or false to get default prefix
     * @param {Zend_Db_Select} [opt.]
     * @return String|Boolean
     */
    public function addFirmJoin($sql = null)
    {
        return false;
    }

    /**
     * Set options
     * @param type $options
     */
    public function setParams($params)
    {
        $this->params = $params;
    }

    /**
     * Get options
     * @return array
     */
    public function getParams()
    {
        return $this->params;
    }

    /**
     * Get specified option by it's name
     */
    public function getParam($name, $default = null)
    {
        if (is_array($this->params)) {
            if (isset($this->params[$name])) {
                return $this->params[$name];
            } else {
                return $default;
            }
        } else {
            $this->params;
        }
    }

    /**
     * Returns record history info (from x_history table) -
     * last row if has many rows of the same $operation
     * @param int $recordId Record identifier
     * @param int $operationId Operation {@see Falcon_Record_X_History}
     * @param string $columnName Column name (optional)
     * @return mixed
     */
    public function getHistoryInfo($recordId, $operationId, $columnName = null)
    {
        $tableName = $this->getName();
        $m = Falcon_Mapper_X_History::getInstance();
        $records = $m->loadBy(function ($sql)
        use ($recordId, $operationId, $tableName) {
            $sql
                ->where('id_entity = ?', $recordId)
                ->where('id_operation = ?', $operationId)
                ->where('entity_table = ?', $tableName);
        });
        if (empty($records)) {
            return null;
        }
        $result = $records[0];
        if ($columnName) {
            return isset($result[$columnName])
                ? $result[$columnName] : null;
        }
        return $result;
    }

    /**
     * Returns record comlumn value by it identifier
     * @param int $id Record identifier
     * @param string $propName Property name
     * @return mixed
     */
    public function getPropById($id, $propName)
    {
        $record = $this->loadRecord($id);
        return $record ? $record->get($propName) : null;
    }

    /**
     * Returns data about column types
     * @return mixed
     */
    public function getColumnTypes()
    {
        return $this->getTable()->getColumnTypes();
    }

    /**
     * @param Integer $id
     * @return Integer
     */
    public function getIdFirmForId($id)
    {
        $self = $this;
        $recordClassName = $this->recordClassName;
        $key = 't.' . $recordClassName::getSimpleIdName();
        $data = $this->getTable()->loadBy(function ($sql) use ($id, $self, $key) {
            $table = call_user_func([$self, 'addFirmJoin'], $sql);
            $sql->where($key . ' = ?', $id);
            $sql->columns('id_firm', $table ? $table : 't');
        });

        return empty($data[0]['id_firm']) ? 0 : $data[0]['id_firm'];
    }
}