<?php

/**
 * Common class of mapper
 *
 * @project    Maprox <http://maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Mapper_Common extends Falcon_Mapper_Abstract
{
    /**
     * Load records by firm identifier
     * @param Integer $firmId Firm identifier
     * @param Boolean $toArray Export data to an array
     * @return Falcon_Record_Abstract[]/Array[]
     */
    public function loadByFirm($firmId, $toArray = true)
    {
        $where = ['id_firm = ?' => $firmId];
        return $this->load($where, $toArray);
    }

    /**
     * Returns single field value by another field value
     * of first found record
     * @param String $field Needed field field
     * @param String $byField Field search by
     * @param Mixed $value Value of field we search by
     * TODO: we could try to use __call to allow calls like getIdBySomething
     */
    public function getSingleFieldBy($field, $byField, $value)
    {
        $records = $this->load([$byField . ' = ?' => $value]);
        if (empty($records)) {
            return null;
        }

        return $records[0]->get($field);
    }

    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $recordClass = $this->getRecordClassName();
        $records = $this->getTable()->loadBy($queryFn, $queryParams);

        $linkedRecords = $recordClass::getLinkedRecords();
        if ($addLinked && count($linkedRecords) > 0 && count($records) > 0) {
            foreach ($linkedRecords as $linked) {
                /** @var Falcon_Mapper_Common $mapper */
                $mapper = $linked['mapper']::getInstance();
                $linkRecord = $mapper->newRecord();
                $isSingle = ($linkRecord instanceof
                    Falcon_Record_Interface_Link_Single);

                $key = $linked['key'];
                // If no linked key exists in base record, skip linked record
                if (!array_key_exists($key, $records[0])) {
                    continue;
                }
                $ids = [];
                foreach ($records as $record) {
                    //if (isset($record[$key])) {
                    $ids[] = $record[$key];
                    //}
                }
                $ids = array_unique(array_filter($ids));

                $linked['fields'][] = $linkRecord->getParentFieldLink();
                if (!empty($ids)) {
                    $data = $mapper->loadBy(function ($sql)
                    use ($linkRecord, $ids, $addLinkedJoined, $mapper) {
                        $sql->where($linkRecord
                                ->getParentFieldLink() . ' in (?)', $ids
                        );

                        if ($linkRecord->hasField('state')) {
                            $sql->where('t.state != ?',
                                Falcon_Record_Abstract::STATE_DELETED);
                        }

                        if (isset($linkRecord::$checkState)) {
                            $sql->join(
                                $linkRecord::$checkState[0],
                                $linkRecord::$checkState[1],
                                []
                            );
                            $sql->where(
                                $linkRecord::$checkState[0] . '.state != ?',
                                Falcon_Record_Abstract::STATE_DELETED
                            );
                        }

                        if ($addLinkedJoined) {
                            $mapper->joinForeignTables($sql);
                        }
                    }, $linked, $addLinkedJoined);
                } else {
                    $data = [];
                }

                $link = $linkRecord->getParentFieldLink();
                $matrix = [];
                foreach ($records as &$record) {
                    $key = $record[$linked['key']];
                    if (!isset($matrix[$key])) {
                        $matrix[$key] = [];
                    }

                    if ($linked['alias']) {
                        $record[$linked['alias']] =
                            $isSingle ? new stdClass() : [];
                        $matrix[$key][] = &$record[$linked['alias']];
                    } else {
                        $matrix[$key][] = &$record;
                    }
                }
                unset($record);

                foreach ($data as $item) {
                    $key = $item[$link];
                    if (empty($matrix[$key])) {
                        continue;
                    }
                    foreach ($matrix[$key] as &$target) {
                        $join = $item;
                        unset($join[$link]);
                        if ($isSingle) {
                            $target = array_merge(
                                (array)$join,
                                (array)$target
                            );
                        } else {
                            if (!empty($linked['simple'])) {
                                $join = reset($join);
                            }
                            $target[] = $join;
                        }
                    }
                }
            }
        }

        // Get access list
        if ($this->getParam('$getaccesslist') && $this->allowAccessList) {
            $user = Falcon_Model_User::getInstance();
            if ($user->hasRight('view_access_list')) {
                // Get records' ids
                $ids = [];
                foreach ($records as $record) {
                    // If record isshared don't show $accesslist
                    if ($record['isshared']) {
                        continue;
                    }
                    if (isset($record['id'])) {
                        $ids[] = $record['id'];
                    }
                }
                if (!empty($ids)) {
                    $accessList
                        = $this->massGetAccessList($ids, $this->getName());
                    foreach ($records as &$record) {
                        if (isset($accessList[$record['id']])) {
                            $record['$accesslist'] = $accessList[$record['id']];
                        } else {
                            $record['$accesslist'] = [];
                        }
                    }
                }
            }
        }

        return $records;
    }

    /**
     * Loads list of accesible elements
     * @param Array $params Sort and paging params
     * @param Boolean $addFields add "iseditable" and other additional fields
     * @return Mixed[]
     */
    public function loadByAccess($params = [], $addFields = false)
    {
        $records = $this->getTable()->loadBy(function ($sql) use ($addFields) {
            Falcon_Access::addAccessSql($sql,
                Falcon_Model_User::getInstance()->getFirmId(),
                ['addfields' => !empty($addFields)]);
        }, $params);
        return $records;
    }

    /**
     * @param {String} $interval
     * @return int
     */
    public function intervalToSeconds($interval)
    {
        $interval = explode(':', $interval);
        return $interval[0] * 3600 + $interval[1] * 60 + $interval[2];
    }

    /**
     * Returns array of x_access entries for given id_object
     * @param Integer $id
     * @param String $alias
     * @return Mixed[]
     */
    public function queryAccessList($id, $alias)
    {
        $m = Falcon_Mapper_X_Access::getInstance();

        return $m->loadBy(function ($sql) use ($id, $alias) {
            $sql
                ->where('id_object = ?', $id)
                ->where('"right" = ?', $alias)
                ->order('sdt');
        });
    }

    /**
     * Returns array of x_access entries for given id_object
     * @param Integer $id
     * @param String $alias
     * @return Mixed[]
     */
    public function getAccessList($id, $alias)
    {
        $accessList = $this->queryAccessList($id, $alias);
        // Get firm names
        foreach ($accessList as &$access) {
            if ($access['id_firm']) {
                $firm = new Falcon_Model_Firm($access['id_firm']);
                $access['firm_name'] = $firm->get('name');
            }
        }
        return $accessList;
    }

    /**
     * Returns two-dimensional array of x_access entries for given object ids
     * @param Integer[] $ids
     * @param String $alias
     * @return Mixed[][]
     */
    public function massGetAccessList($ids, $alias)
    {
        $accessMap = [];
        if (empty($ids)) {
            return $accessMap;
        }
        $accessList = $this->massQueryAccessList($ids, $alias);
        foreach ($accessList as &$access) {
            if (!isset($accessMap[$access['id_object']])) {
                $accessMap[$access['id_object']] = [];
            }
            $accessMap[$access['id_object']][] = $access;
        }

        return $accessMap;
    }

    /**
     * Returns array of x_access entries for devices ids
     * @param Integer[] $ids
     * @param String $alias
     * @return Mixed[]
     */
    public function massQueryAccessList($ids, $alias)
    {
        $m = Falcon_Mapper_X_Access::getInstance();
        $table = $m->getTable();

        return $table->massQueryAccessList($ids, $alias);
    }

    /**
     * Get users by object
     * @param type $record
     */
    public function getUsersByObject($record)
    {
        $table = new Falcon_Table_X_Access();
        return $table->getUsersByObject($record);
    }

    /**
     * Returns total count of records
     * @param Callable $queryFn
     * @return Integer
     */
    public function getTotalCountBy($queryFn)
    {
        $RECORD_CLASS = $this->recordClassName;
        if ($RECORD_CLASS::isSimpleId()) {
            $count = 'distinct t.' . $RECORD_CLASS::getSimpleIdName();
        } else {
            $count = '*';
        }

        $rows = $this->getTable()
            ->loadBy($queryFn, ['fields' => 'count(' . $count . ')']);
        return (count($rows) > 0) ? $rows[0]['count'] : 0;
    }

    /**
     * Gets maximum value of field in table
     * @param {String} $field
     * @return {Mixed}
     */
    public function getMax($field)
    {
        return $this->getTable()->getMax($field);
    }

    /**
     * Gets minimum value of field in table
     * @param {String} $field
     * @return {Mixed}
     */
    public function getMin($field)
    {
        return $this->getTable()->getMin($field);
    }

    /**
     * Gets timestamp from database
     * @param {String} $addTime
     * @param {Boolean} $uncached
     * @return String
     */
    public function dbDate($addTime = null, $uncached = false)
    {
        return $this->getTable()->dbDate($addTime, $uncached);
    }

    /**
     * Gets multiple records by their ids
     * @param {Integer[]} $ids
     * @return {Array[]}
     */
    public function loadByIds($ids)
    {
        return $this->getTable()->loadByIds($ids);
    }

    /**
     * Gets record count for given where statement
     * @param {Mixed[]} $where
     * @param Boolean $countDeleted Count deleted
     * @return {Integer}
     */
    public function getCount($where, $countDeleted = false)
    {
        $where = $this->wherePrepare($where, $countDeleted);
        return $this->getTable()->getCount($where);
    }

    /**
     * @param Array $params
     * @param Falcon_Record_Abstract $record
     * @return Falcon_Record_Abstract[]
     */
    public function loadForOwner($params, $record)
    {
        $id = (!empty($params['key'])) ?
            $record->get($params['key']) : $record->getId();
        $linkRecord = $this->newRecord();
        $parentFieldName = $linkRecord->getParentFieldLink();

        if (!empty($id)) {
            $records = $this->loadBy(function ($sql) use ($parentFieldName, $id) {
                $sql->where($parentFieldName . ' = ?', $id);
            }, $params);
        } else {
            $records = [];
        }

        if ($linkRecord instanceof Falcon_Record_Interface_Link_Single) {
            if (count($records) > 0) {
                return $records[0];
            }
            return (object)null;
        } else {
            if (!empty($params['simple'])) {
                $records = array_map('reset', $records);
            }
        }
        return $records;
    }

    /**
     * Creates linked record for current entity
     * @param array $data Input parameters
     * @param Falcon_Record_Abstract $record Parent record
     * @param array $params Linked record config
     */
    public function setForOwner($data, $record, $params)
    {
        $logger = Falcon_Logger::getInstance();
        $id = (!empty($params['key'])) ?
            $record->get($params['key']) : $record->getId();
        $linkRecord = $this->newRecord();
        $parentFieldName = $linkRecord->getParentFieldLink();
        if ($data === null) {
            // we need to delete single record
            if ($linkRecord instanceof Falcon_Record_Interface_Link_Single) {
                $this->getTable()->delete([
                    $parentFieldName . ' = ?' => $id
                ]);
            }
            return [];
        } else {
            if (is_object($data)) {
                $data = (array)$data;
            }
            $recordClass = $this->getRecordClassName();
            $recordFields = $recordClass::getFields();
            if (in_array('id_firm', $recordFields)
                && !isset($data['id_firm'])
                && $record->get('id_firm')
            ) {
                $data['id_firm'] = $record->get('id_firm');
            }
        }
        if (!is_array($data)) {
            throw new Falcon_Exception('Invalid parameter',
                Falcon_Exception::BAD_REQUEST);
        }
        if ($linkRecord instanceof Falcon_Record_Interface_Link_Single) {
            $records = $this->load([$parentFieldName . ' = ?' => $id]);
            if (count($records) < 1) {
                $r = $this->newRecord($data);
                $r->set($parentFieldName, $id);
                $r->insert();
            } else {
                $r = $records[0];
                $r->setProps($data);
                $r->update();
            }

            // recursive setForOwner
            foreach ($r->getLinkedRecords() as $linkedRecord) {
                $m = $linkedRecord['mapper']::getInstance();
                if (isset($data[$linkedRecord['alias']])) {
                    $m->setForOwner($data[$linkedRecord['alias']],
                        $r, $linkedRecord);
                }
            }
        } else if ($linkRecord
            instanceof Falcon_Record_Interface_Link_Updatable
        ) {
            foreach ($data as $item) {
                // Set linked field to parent record id
                $item->$parentFieldName = $id;

                if (!empty($item->id)) {
                    $r = $this->newRecord(['id' => $item->id]);
                    $r->load();

                    // Check if updating item belongs to parent object
                    if ($r->get($parentFieldName) !== $id) {
                        $logger->log('warn', 'Trying update linked record'
                            . ' that non belongs to parent: '
                            . $parentFieldName
                        );
                        continue;
                    }
                    // Check direct access to linked record
                    // If parent item is shared it could be no access
                    /*if (isset($params['check_access'])
                        && $params['check_access']
                        && is_numeric($item->id)
                        && isset($params['check_access_table']))
                    {
                        if (!Falcon_Access::innerCheckWrite(
                            $params['check_access_table'],
                            $item->id,
                            Falcon_Model_User::getInstance()->getId()
                        )) {
                            continue;
                        }
                    }*/

                    $r->setProps((array)$item);
                    $r->update();
                    $r->load();
                } else {
                    unset($item->id);
                    $r = $this->newRecord((array)$item);
                    $r->insert();
                }

                // recursive setForOwner
                $item = (array)$item;
                foreach ($r->getLinkedRecords() as $linkedRecord) {
                    $m = $linkedRecord['mapper']::getInstance();
                    $m->setForOwner($item[$linkedRecord['alias']],
                        $r, $linkedRecord);
                }
            }
        } else {
            $this->getTable()->delete([$parentFieldName . ' = ?' => $id]);
            foreach ($data as $item) {
                if (isset($item->id)) {
                    // changing of an id is not allowed
                    // here must be a primary key ?
                    unset($item->id);
                }
                if (!empty($params['simple']) && !is_array($item)) {
                    // Checking write access for specified item
                    if (isset($params['check_access'])
                        && $params['check_access']
                        && is_numeric($item)
                        && isset($params['check_access_table'])
                    ) {
                        Falcon_Access::checkRead(
                            $params['check_access_table'],
                            $item
                        );
                    }
                    $item = [$params['fields'][0] => $item];
                } else {
                    $item = (array)$item;
                }
                $item[$parentFieldName] = $id;

                $r = $this->newRecord($item);
                $r->insert();

                // recursive setForOwner
                foreach ($r->getLinkedRecords() as $linkedRecord) {
                    $m = $linkedRecord['mapper']::getInstance();
                    $m->setForOwner($item[$linkedRecord['alias']],
                        $r, $linkedRecord);
                }
            }
        }
        return $this->loadForOwner($params, $record);
    }

    /**
     * Checks if user has access to foreign table identifier.
     * For example, if we have mon_waylist record (there is a id_vehicle
     * field), we must check if user can set id_vehicle to 34 (for ex.) - it
     * can be an id of a foreign firm vehicle.
     * @param string $accessType (read | write)
     * @param string $fieldName
     * @param mixed $value
     * @throws Falcon_Exception::ACCESS_VIOLATION
     */
    public function checkFieldAccess($accessType, $fieldName, $value)
    {
        $RECORD_CLASS = $this->getRecordClassName();
        if (!$RECORD_CLASS::isForeignKey($fieldName)) {
            // if it is not a foreign key, then we assume that
            // this is a field of the current table
            if ($accessType == 'read') {
                Falcon_Access::checkRead(
                    $RECORD_CLASS::getTableName(),
                    $value
                );
            } else {
                Falcon_Access::checkWrite(
                    $RECORD_CLASS::getTableName(),
                    $value
                );
            }
            return true;
        }
        $foreignKeys = $RECORD_CLASS::getForeignKeys();
        $foreignFieldConfig = $foreignKeys[$fieldName];
        $foreignTableName = key($foreignFieldConfig);

        $m = $RECORD_CLASS::getMapperByTableName($foreignTableName);
        return $m->checkFieldAccess($accessType, $fieldName, $value);
    }

    /**
     * Checks if user has a read access to foreign table identifier.
     * @param string $fieldName
     * @param mixed $value
     * @return boolean True if has access
     * @throws Falcon_Exception::ACCESS_VIOLATION
     */
    public function checkReadForeignKey($fieldName, $value)
    {
        return $this->checkFieldAccess('read', $fieldName, $value);
    }

    /**
     * Checks if user has a write access to foreign table identifier.
     * @param string $fieldName
     * @param mixed $value
     * @return boolean True if has access
     * @throws Falcon_Exception::ACCESS_VIOLATION
     */
    public function checkWriteForeignKey($fieldName, $value)
    {
        return $this->checkFieldAccess('write', $fieldName, $value);
    }

    /**
     * Joins foreign tables if they exists
     * @param Zend_Db_Select $sql
     */
    public function joinForeignTables($sql)
    {
        $RECORD_CLASS = $this->getRecordClassName();
        $foreignKeys = $RECORD_CLASS::getForeignKeys();
        foreach ($foreignKeys as $fieldName => $foreignFieldConfig) {
            $foreignTableName = key($foreignFieldConfig);
            $foreignFieldName = current($foreignFieldConfig);
            // let's get foreign table name for join if specified
            //$FOREIGN_RECORD_CLASS = 'Falcon_Record_' .
            if (isset($foreignFieldConfig['joined'])) {
                $foreignTableName = key($foreignFieldConfig['joined']);
                $foreignFieldName = current($foreignFieldConfig['joined']);
            }
            // let's get foreign table field aliases
            $foreignTableFields = [];
            if (isset($foreignFieldConfig['fields'])) {
                foreach ($foreignFieldConfig['fields'] as $fieldAlias => $field) {
                    $joinedFieldName = $fieldName . '$' . $field;
                    if (is_string($fieldAlias)) {
                        $joinedFieldName = $fieldAlias;
                    }
                    $foreignTableFields[$joinedFieldName] = $field;
                }
            }

            // Get query postfix
            $queryPostfix = '';
            if (isset($foreignFieldConfig['queryPostfix'])) {
                $queryPostfix = ' ' . $foreignFieldConfig['queryPostfix'];
            }
            // Apply parameters to query string
            $this->fillInQuery($queryPostfix);

            // Get table alias
            if (isset($foreignFieldConfig['tablealias'])) {
                $alias = $foreignFieldConfig['tablealias'];
            } else {
                $alias = $foreignTableName . '_' . $fieldName;
            }

            $sql->joinLeft(
                [$alias => $foreignTableName], 't.' .
                $fieldName . ' = ' .
                $alias . '.' . $foreignFieldName . $queryPostfix,
                $foreignTableFields
            );
        }
    }

    /**
     * Fills in query
     * @param type $query
     */
    public function fillInQuery(&$query)
    { /* in childs */
    }
}
