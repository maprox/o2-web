<?php

/**
 * Abstract class of table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Record_Abstract
{
    // State values
    const
        STATE_UNAPPROVED = 0,
        STATE_ACTIVE = 1,
        STATE_INACTIVE = 2,
        STATE_DELETED = 3,
        STATE_INCORRECT = 4;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = ['id'];

    /**
     * Table fields information (types, constraints, etc.)
     * @var String[]
     */
    public static $fieldsInfo = [];

    /**
     * Changed record fields
     */
    protected $changed = [];

    /**
     * Last changes
     */
    protected $lastChanges = [];

    /**
     * Last operation
     */
    protected $lastOperation = null;

    /**
     * Original record fields
     */
    protected $original = [];

    /**
     * Original record fields that must be fetched from database
     */
    protected $originalToFetch = [];

    /**
     * Params for converting id to string representation
     */
    public static $nameConvertParams = [];

    /**
     * Foreign keys array.
     * Used to check user access for foreign table records.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id'];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = [];

    /**
     * Table fields that should not leave Back-end.
     * When toArray is called, they are removed
     * @var String[]
     */
    public static $privateFields = [];

    /**
     * Table fields that should not be known through shared access
     * When toSharedArray is called, they are removed
     * @var String[]
     */
    public static $protectedFields = [];

    /**
     * Table fields that should not be modified through shared access
     * @var String[]
     */
    public static $readonlyFields = [];

    /**
     * Table fields that need special access to be modified
     * Format is 'field' => access needed
     * @var String[]
     */
    public static $restrictedFields = [];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [];

    /**
     * Record properties
     * @var Mixed[]
     */
    protected $props = [];

    /**
     * Original primary key
     * Sets only when primary key passed to the constructor
     * Updates after update was called
     * @var type
     */
    protected $originalId = null;

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id';

    /**
     * Loaded flag.
     * True if record is found by id.
     * @var bool
     */
    private $_isLoaded;

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = [];

    /**
     * Triggers instances
     * @var Falcon_Record_Trigger_Abstract[]
     */
    protected $triggersInstances = [];

    /**
     * Key for joining inheriting table
     * See Falcon_Action_Rest_Inheritable
     * @var String
     */
    public static $inheritJoinKey = false;

    /**
     * Fields to grab from inherited table
     * See Falcon_Action_Rest_Inheritable
     * @var String
     */
    public static $extendedFields = [];

    /**
     * Fields that not required for creating and sending update
     * @var Array
     */
    public static $ignoredFieldsOnUpdate = [];

    /**
     * Use another entity for access check
     * $checkAccessField should be specified
     * @var String
     */
    public static $checkAccessAlias = null;

    /**
     * Field of record contains reference on another record
     * @var String
     */
    public static $checkAccessField = null;

    /**
     * @construct
     * @param Integer /Mixed[] $props Identifier/Record properties
     * @param Integer $createState create record in DB with state, if it doesn't exist
     * @param Boolean $autoLoad Load data for record on instantiation
     */
    public function __construct($props = null,
                                $createState = false, $autoLoad = true)
    {
        foreach ($this->getFields() as $field) {
            $this->props[$field] = null;
        }
        if (is_int($props) || ctype_digit($props)) {
            $primaryKeyValue = (int)$props;
            $props = [];
            $primaryKey = $this->getPrimaryKey();
            if (count($primaryKey) !== 1) {
                throw new Falcon_Exception(
                    'Incorrect primary key request ' . get_class($this),
                    Falcon_Exception::SERVER_ERROR);
            }
            $props[$primaryKey[0]] = $primaryKeyValue;
        }
        if ($autoLoad && is_array($props) && $this->propsHasPrimaryKey($props)) {
            $props = $this->loadById($props, $createState);
        }
        if (is_array($props)) {
            $this->setProps($props);
            // Save primary key
            if ($this->propsHasPrimaryKey($props)) {
                // Save original primary key
                $this->updateOriginalId();
            }
        }

        $this->resetChanges();
        $this->addTrigger($this->triggers);
    }

    /**
     * Updates original ID
     */
    public function updateOriginalId()
    {
        $this->originalId = null;
        $this->originalId = $this->getId();
    }

    /**
     * Get original ID
     * @return type
     */
    public function getOriginalId()
    {
        return $this->originalId;
    }

    /**
     * Set original ID
     * @return type
     */
    public function setOriginalId($id)
    {
        $this->originalId = $id;
    }

    /**
     * Checks if properties array has primary key
     * @param array $props
     * @return bool
     */
    public function propsHasPrimaryKey($props)
    {
        $propKeys = array_keys($props);
        $primKeys = $this->getPrimaryKey();
        return count(array_intersect($propKeys, $primKeys))
        === count($primKeys);
    }

    /**
     * Return true if record is loaded from database
     * @return bool
     */
    public function isLoaded()
    {
        return $this->_isLoaded;
    }

    /**
     * Load data from table by id
     * @param Integer /Mixed[] $props Identifier
     * @param Integer $createState create record in DB with state,
     *        if it doesn't exist
     * @return {Array}
     */
    protected function loadById($props, $state = false)
    {
        $data = $this->getMapper()->loadRecord($props, true);
        $this->_isLoaded = !empty($data);
        if (!$this->isLoaded()) {
            if ($state !== false) {
                if (!is_array($props)) {
                    $props = [$this->getSimpleId() => $props];
                }

                $className = get_class($this);
                $record = new $className;
                //$props['state'] = $state;
                $record->setProps($props)->insert();

                if ($this->isSimpleId()) {
                    $props[$this->getSimpleId()] = $record->getId();
                } else {
                    $keyData = $record->getId();
                    foreach ($this->getPrimaryKey() as $key) {
                        $props[$key] = $keyData[$key];
                    }
                }
            }

            $data = $props;
        }
        return $data;
    }

    /**
     * Load data from table
     * @return this
     */
    public function load()
    {
        $key = [];
        foreach ($this->getPrimaryKey() as $field) {
            $value = $this->get($field);
            if (empty($value)) {
                return $this;
            }
            $key[$field] = $value;
        }

        $props = $this->loadById($key);

        if (is_array($props)) {
            $this->setProps($props);
        }

        $this->resetChanges();
        return $this;
    }

    /**
     * Get property
     * @param String $prop Property
     * @return Mixed
     */
    public function get($prop)
    {
        return array_key_exists($prop, $this->props) ?
            $this->props[$prop] : null;
    }

    /**
     * Get record identifier
     * @return Mixed
     */
    public function getId()
    {
        // If primary key setted by constructor
        if ($this->getOriginalId()) {
            return $this->getOriginalId();
        }

        if ($this->isSimpleId()) {
            return $this->getSimpleId();
        }

        $return = [];
        foreach ($this->getPrimaryKey() as $key) {
            $value = $this->get($key);
            if ($value === null) {
                $return = [];
                break;
            }
            $return[$key] = $this->get($key);
        }

        return $return;
    }

    /**
     * Get record identifier for tables with simple Primary Key
     * @return Integer
     */
    public function getSimpleId()
    {
        return $this->get($this->getSimpleIdName());
    }

    /**
     * Set property
     * @param Mixed []/Object $props Properties
     * @return Falcon_Record_Abstract
     */
    public function setProps(array $props = null)
    {
        if (!is_array($props)) {
            return $this;
        }
        foreach ($props as $prop => $value) {
            if (array_key_exists($prop, $this->props)) {
                if ($prop === $this->getSimpleId() && !$value) {
                    $value = null;
                }
                // empty string spike-nail
                if (($value === '') && (
                        (strpos($prop, 'dt') !== false)
                        || (strpos($prop, 'time') !== false)
                        || (strpos($prop, 'id_') !== false)
                    )
                ) {
                    $value = null;
                }
                // Save original value or mark it to be fetched before update
                if (!isset($this->original[$prop])) {
                    /*			if (isset($this->props[$prop])) {
                                    $this->original[$prop] = $this->props[$prop];
                                } else {*/
                    $this->originalToFetch[] = $prop;
                    // Add array-key to prevent further updates of original array
                    $this->original[$prop] = false;
                    //			}
                }
                $this->props[$prop] = !is_bool($value) ?
                    $value : ($value ? 1 : 0);
                // Add value to changed array
                $this->changed[$prop] = $this->props[$prop];
            }
        }
        return $this;
    }

    /**
     * Set property
     * @param String $prop Property
     * @param Mixed $value Value
     * @return Falcon_Record_Abstract
     */
    public function set($prop, $value = null)
    {
        $props = [
            $prop => $value
        ];
        return $this->setProps($props);
    }

    /**
     * Returns true, if record don't has state column,
     * or it is equal to STATE_ACTIVE
     * @return {Boolean}
     */
    public function isActive()
    {
        $state = $this->get('state');
        return ($state === NULL || $state == self::STATE_ACTIVE);
    }

    /**
     * Returns true, if record don't has state column,
     * or it is equal to STATE_ACTIVE
     * @return {Boolean}
     */
    public function isDeleted()
    {
        $state = $this->get('state');
        return ($state === NULL || $state == self::STATE_DELETED);
    }

    /**
     * Clear property
     * @param String $prop Property
     * @return Falcon_Record_Abstract
     */
    public function clear($prop)
    {
        return $this->set($prop);
    }

    /**
     * Reset changed properties
     */
    public function resetChanges()
    {
        $this->changed = [];
        $this->original = [];
        $this->originalToFetch = [];
    }

    /**
     * Current changed fields
     * Resets after saving record
     * @return Array
     */
    public function getChanged()
    {
        return $this->changed;
    }

    /**
     * Returns changes that have been made recently
     * @param Boolean $showPrivate return privite fields too
     */
    public function getLastChanges($showPrivate = false)
    {
        $changes = $this->lastChanges;
        if ($showPrivate) {
            return $this->lastChanges;
        }

        foreach ($this->getPrivateFields() as $field) {
            if (array_key_exists($field, $changes)) {
                unset($changes[$field]);
            }
        }
        return $changes;
    }

    /**
     * Returns recent changes for creating and sending update
     * @return Array
     */
    public function getChangesForUpdate()
    {
        $changes = $this->getLastChanges();
        foreach (static::$ignoredFieldsOnUpdate as $fieldName) {
            if (array_key_exists($fieldName, $changes)) {
                unset($changes[$fieldName]);
            }
        }
        return $changes;
    }

    /**
     * Returns changes that will be ignored for sending update
     * @return Array
     */
    /*public function getIgnoredChangesForUpdate()
    {
        $changes = $this->getLastChanges();
        $ignoredChanges = array();
        foreach (static::$ignoredFieldsOnUpdate as $fieldName) {
            if (array_key_exists($fieldName, $changes)) {
                $ignoredChanges[$fieldName] = $changes[$fieldName];
            }
        }

        return $ignoredChanges;
    }*/

    /**
     * Shared changes?
     */
    public function getLastSharedChanges()
    {
    }

    /**
     * Set last changes
     * @param Array $changes
     */
    public function setLastChanges($changes)
    {
        $this->lastChanges = $changes;
    }

    /**
     * Get last operation
     * @param Integer $operation
     */
    public function getLastOperation()
    {
        return $this->lastOperation;
    }

    /**
     * Set last operation
     * @param Integer $operation
     */
    public function setLastOperation($operation)
    {
        $this->lastOperation = $operation;
    }

    /**
     * Returns original, fetches if needed
     */
    public function getOriginal()
    {
        if (!empty($this->originalToFetch)) {
            $key = [];
            foreach ($this->getPrimaryKey() as $field) {
                $value = $this->get($field);
                if (empty($value)) {
                    return $this->original;
                }
                $key[$field] = $value;
            }

            $data = $this->getMapper()->loadRecordFields($key,
                $this->originalToFetch);
            $this->original = array_replace($this->original, $data);
            $this->originalToFetch = [];
        }

        return $this->original;
    }

    /**
     * Export data to associative array
     * @return Mixed[]
     */
    public function toArray()
    {
        $props = $this->props;
        foreach ($this->getPrivateFields() as $field) {
            if (array_key_exists($field, $props)) {
                unset($props[$field]);
            }
        }
        return $props;
    }

    /**
     * Export data to associative array in context of being shared object
     * @return Mixed[]
     */
    public function toSharedArray()
    {
        $props = $this->toArray();
        foreach ($this->getProtectedFields() as $field) {
            if (array_key_exists($field, $props)) {
                unset($props[$field]);
            }
        }
        return $props;
    }

    /**
     * Export data to JSON string
     * @return Falcon_Record_Abstract
     */
    public function toJson()
    {
        return json_encode($this->toArray());
    }

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        $this->executeTriggers('onBeforeInsert');
        $id = $this->getMapper()->insertRecord($this);
        if ($this->isSimpleId()) {
            if ($id > 0) {
                $this->set($this->getSimpleIdName(), $id);
            }
        } else {
            $this->setProps($id);
        }
        // Set last changes
        $this->setLastChanges($this->changed);
        // Reset active changes
        $this->resetChanges();
        // Set last operation
        $this->autoloadClass('Falcon_Record_X_History');
        $this->setLastOperation(Falcon_Record_X_History::OPERATION_CREATE);
        // Execute triggers
        $this->executeTriggers('onAfterInsert');
        return $this;
    }

    /**
     * Remove record from the table
     * @return Falcon_Record_Abstract
     */
    public function delete()
    {
        $this->executeTriggers('onBeforeDelete');
        $this->getMapper()->deleteRecord($this->getId());
        $this->clear($this->getSimpleId());
        $this->executeTriggers('onAfterDelete');
        return $this;
    }

    public function autoloadClass($className)
    {
        // [FIX START]
        // Dirty fix for session's $className autoload issue
        $autoloader = Zend_Loader_Autoloader::getInstance();
        if (!$autoloader->autoload($className)) {
            die("$className not found!");
        }
        // [FIX END]
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $this->autoloadClass('Falcon_Record_X_History');
        $this->executeTriggers('onBeforeUpdate');
        $lastOperation = Falcon_Record_X_History::OPERATION_EDIT;
        $data = $this->getChanged();
        if (!empty($data)) {
            // Check if record is restoring from trash
            if (self::hasField('state') && isset($this->changed['state'])) {
                $currentData
                    = $this->getMapper()->loadRecord($this->getId(), true);
                $currentState = $currentData['state'];
                if (
                    $currentState == self::STATE_DELETED
                    && in_array($this->changed['state'], [
                        self::STATE_ACTIVE,
                        self::STATE_INACTIVE
                    ])
                ) {
                    $lastOperation = Falcon_Record_X_History::OPERATION_RESTORE;
                }
            }

            $this->getMapper()->updateRecord($this->getId(), $data);
            $this->setLastChanges($this->changed);
            $this->resetChanges();
            $this->updateOriginalId();
        }

        // Set last operation
        $this->setLastOperation($lastOperation);
        $this->executeTriggers('onAfterUpdate');
        return $this;
    }

    /**
     * Trash record in the table
     * @return Falcon_Record_Abstract
     */
    public function trash()
    {
        $this->executeTriggers('onBeforeTrash');
        $this->getMapper()->trashRecord($this->getId());
        // Set last changes
        $this->setLastChanges([
            'state' => Falcon_Record_Abstract::STATE_DELETED
        ]);
        // Set lastOperation
        $this->setLastOperation(Falcon_Record_X_History::OPERATION_DELETE);
        $this->executeTriggers('onAfterTrash');
        return $this;
    }

    /**
     * Gets timestamp from database     *
     * @param {String} $addTime
     * @param {Boolean} $uncached
     * @return String
     */
    public function dbDate($addTime = null, $uncached = false)
    {
        return $this->getMapper()->dbDate($addTime);
    }

    /**
     * Returns record history info (from x_history table) -
     * last row if has many rows of the same $operation
     * @param int $operationId Operation {@see Falcon_Record_X_History}
     * @param string $columnName Column name (optional)
     * @return mixed
     */
    public function getHistoryInfo($operationId, $columnName = null)
    {
        return $this->getMapper()
            ->getHistoryInfo($this->getId(), $operationId, $columnName);
    }

    /**
     * Add trigger(s) to a list of record's triggers
     * @param Mixed $data
     * Can be string or array like:
     * <pre>
     *    // Adds trigger Falcon_Record_Trigger_Logged
     *    addTrigger(new Falcon_Record_Trigger_Logged())
     *
     *    // Adds trigger Falcon_Record_Trigger_Logged if
     *    // it does not already exist
     *    addTrigger('logged')
     *
     *    // Adds trigger Falcon_Record_Trigger_Logged with some params if
     *    // it does not already exist
     *    addTrigger(array(
     *      'logged' => array(
     *         // any trigger parameters
     *      )
     *    )
     *
     *    // Adds triggers Falcon_Record_Trigger_Logged
     *    // Falcon_Record_Trigger_Journaled with parameters
     *    // if they do not already exist
     *    addTrigger(array(
     *      'logged',
     *      'journaled' => array(
     *         'exclude' => array(
     *            'delete'
     *         )
     *      )
     *    ))
     * </pre>
     */
    protected function addTrigger($data)
    {
        if (is_string($data)) {
            return $this->addTrigger([$data]);
        }
        if ($data instanceof Falcon_Record_Trigger_Abstract) {
            $this->triggersInstances[] = $data;
            return true;
        }
        if (!is_array($data)) {
            return false;
        }
        foreach ($data as $key => $params) {
            if (!is_string($key) && is_string($params)) {
                $key = $params;
                $params = null;
            }
            $TRIGGER_CLASS = $this->getTriggerClassName($key);
            if (class_exists_warn_off($TRIGGER_CLASS)) {
                $this->addTrigger(new $TRIGGER_CLASS($params));
            }
        }
        return true;
    }

    /**
     * Removes all triggers
     */
    public function clearTriggers()
    {
        $this->triggersInstances = [];

        return $this;
    }

    /**
     * Returns trigger class name by its name
     * 'logger_group' returns 'Falcon_Record_Trigger_Logger_Group'
     * @param string $name
     * @return string
     */
    private function getTriggerClassName($name)
    {
        return 'Falcon_Record_Trigger_' .
        ucwords_custom(strtolower($name), '_');
    }

    /**
     * Executes triggers method by its name
     * @param string $method
     */
    protected function executeTriggers($method)
    {
        foreach ($this->triggersInstances as $trigger) {
            if (method_exists($trigger, $method)) {
                $trigger->$method($this);
            }
        }
    }

    /**
     * Returns trigger instance by its name
     * For example getTrigger('logger') returns an instance of
     * Falcon_Record_Trigger_Logged
     * @param string $name
     * @return Falcon_Record_Trigger_Abstract (or null if not found)
     */
    public function getTrigger($name)
    {
        foreach ($this->triggersInstances as $trigger) {
            if (get_class($trigger) == $this->getTriggerClassName($name)) {
                return $trigger;
            }
        }
        return null;
    }

// ----------------------------------------------------------------------------
// STATIC GETTERS
// ----------------------------------------------------------------------------

    /**
     * Retrieve record fields
     * @param bool $includePrimaryKey If false primaryKey is not returned
     * @return array
     */
    public static function getFields($includePrimaryKey = true)
    {
        return $includePrimaryKey ? static::$fields :
            array_diff(static::$fields, static::getPrimaryKey());
    }

    /**
     * Returns field type by name.
     * If field is not found, or type is not defined returns null
     * @param string $fieldName
     * @return string {@see Falcon_Table_Field_Type}
     */
    public static function getFieldType($fieldName)
    {
        if (isset(static::$fieldsInfo[$fieldName])) {
            if (isset(static::$fieldsInfo[$fieldName]['type'])) {
                return static::$fieldsInfo[$fieldName]['type'];
            }
        }
    }

    /**
     * Checks, if conversion is avaiable for field
     * @param $field
     * @return bool
     */
    public function haveConversionFor($field)
    {
        return (self::getConversionTableFor($field)
            || self::getConversionValuesFor($field));
    }

    /**
     * Checks, if conversion is avaiable for field, returns
     * @param string $field
     * @return Boolean|Mixed[]
     */
    public static function getConversionTableFor($field)
    {
        if (
            self::isSimpleId()
            && $field == self::getSimpleIdName()
            && !isset(static::$fieldsInfo[$field]['convert_name'])
        ) {
            return self::getTableName();
        }

        return isset(static::$fieldsInfo[$field]['convert_name']) ?
            static::$fieldsInfo[$field]['convert_name'] : false;
    }

    /**
     * Checks, if conversion is avaiable for field, returns
     * @param string $field
     * @return Boolean|Mixed[]
     */
    public static function getConversionValuesFor($field)
    {
        return isset(static::$fieldsInfo[$field]['convert_values']) ?
            static::$fieldsInfo[$field]['convert_values'] : false;
    }

    /**
     * Returns field converted to name. Actual for transforming ids like id_person,
     * id_firm, etc to string representation
     * @param string $field
     * @return String
     */
    public function getConvertedName($field = null)
    {
        if ($field === null) {
            if ($this->isSimpleId()) {
                $field = $this->getSimpleIdName();
            } else {
                return '';
            }
        }

        if ($field != $this->getSimpleIdName()
            || isset(static::$fieldsInfo[$field]['convert_name'])
        ) {

            $value = $this->get($field);
            return $this->getMapper()->getConvertedNameForValue($field, $value);
        }

        return $this->getMapper()->getConvertedNameForRecord($field, $this);
    }

    /**
     * @return String
     */
    public function __toString()
    {
        return (string)$this->getConvertedName();
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getForeignKeys()
    {
        return static::$foreignKeys;
    }

    /**
     * Returns true, if specified $fieldName is in foreignKeys array
     * @param string $fieldName
     */
    public static function isForeignKey($fieldName)
    {
        $foreignKeys = self::getForeignKeys();
        return isset($foreignKeys[$fieldName]);
    }

    /**
     * Return true if record has field
     * @param string $fieldName
     */
    public static function hasField($fieldName)
    {
        return in_array($fieldName, static::getFields());
    }

    /**
     * Checks, if this table uses simple primary key
     * @return Boolean
     */
    public static function isSimpleId()
    {
        return count(static::getPrimaryKey()) === 1;
    }

    /**
     * Return simple id name
     * @return string
     */
    public static function getSimpleIdName()
    {
        $primaryKey = static::getPrimaryKey();
        return (count($primaryKey) > 0) ? $primaryKey[0] : 'id';
    }

    /**
     * Retrieve record primary key
     * @return array
     */
    public static function getPrimaryKey()
    {
        return static::$primaryKey;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getRequiredFields()
    {
        return static::$requiredFields;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getRestrictedFields()
    {
        return static::$restrictedFields;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getProtectedFields()
    {
        return static::$protectedFields;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getPrivateFields()
    {
        return static::$privateFields;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getReadonlyFields()
    {
        return static::$readonlyFields;
    }

    /**
     * Getter for static fields array
     * @return string[]
     */
    public static function getLinkedRecords()
    {
        $result = [];
        $records = static::$linkedRecords;
        foreach ($records as $record) {
            $params = [];
            if (is_string($record) || is_numeric($record)) {
                $tableName = static::getTableName();
                $params['table'] = $tableName . '_' . (string)$record;
                $params['alias'] = (string)$record;
            } else {
                $params = (array)$record;
            }
            if (!isset($params['table'])) {
                $params['table'] = '';
            }
            if (!isset($params['alias'])) {
                if ($params['table'] &&
                    'Falcon_Record_' .
                    $params['table'] instanceOf Falcon_Record_Interface_Link_Single
                ) {
                    $params['alias'] = false;
                } else {
                    $params['alias'] = $params['table'];
                }
            }
            if (!isset($params['fields'])) {
                $params['fields'] = ['*'];
            }
            if (!isset($params['key'])) {
                $params['key'] = self::$primaryKey[0];
            }
            if (!isset($params['mapper'])) {
                $tableName = $params['table'];
                if ($tableName) {
                    $params['mapper'] =
                        'Falcon_Mapper_' . ucwords_custom($tableName);
                }
            }
            $result[] = $params;
        }
        return $result;
    }

    /**
     * Returns record table name
     */
    final public static function getTableName()
    {
        return strtolower(str_replace(
            'Falcon_Record_', '', get_called_class()));
    }

    /**
     * Get mapper for a specified table name
     * @param type $tableName
     */
    final public static function getMapperByTableName($tableName)
    {
        $MAPPER_CLASS = 'Falcon_Mapper_' .
            ucwords_custom(strtolower($tableName), '_');
        return $MAPPER_CLASS::getInstance();
    }

    /**
     * Get table mapper
     * @return Falcon_Mapper_Abstract
     */
    final public static function getMapper()
    {
        return self::getMapperByTableName(self::getTableName());
    }

    /**
     *
     * @return String
     */
    public static function getParentFieldLink()
    {
        return static::$parentFieldLink;
    }

    /**
     * Returns data about column types
     * @return mixed
     */
    public function getColumnTypes()
    {
        return $this->getMapper()->getColumnTypes();
    }

    /**
     * @return Integer
     */
    public function getIdFirm()
    {
        return $this->getMapper()->getIdFirmForId($this->getId());
    }
}
