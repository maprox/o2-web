<?php

/**
 * @project    Maprox <http://maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Rest_Common extends Falcon_Action_Rest
{
    /**
     * List of the required params
     * @var type
     */
    public static $requiredParams = [
        'doGetList' => [],
        'doGetItem' => [],
        'doCreate' => [],
        'doUpdate' => [],
        'doDelete' => []
    ];

    /**
     * Need to perform check read
     * @var Boolean
     */
    protected $checkRead = true;

    /**
     * Need to perform check write
     * @var Boolean
     */
    protected $checkWrite = true;

    /**
     * If need to add access sql
     * @var Boolean
     */
    protected $addAccessSql = true;

    /**
     * Need to perform check create
     * @var Boolean
     */
    protected $checkCreate = true;

    /**
     * If given, limits number of records in list, despite user requests
     * @var Integer
     */
    protected $upperLimit = false;

    /**
     * States that should not be shown
     * @var Boolean
     */
    protected $excludeStates = [
        Falcon_Record_Abstract::STATE_DELETED
    ];

    /**
     * Performed access actions
     * @var Array
     */
    protected $accessActions = [];

    /**
     *
     * @param type $itemName
     * @param type $instance
     */
    public function setItem($itemName, $instance)
    {
        $m = $this->getEntityMapper();
        $m->setItem($itemName, $instance, $this->getParam($itemName));
    }

    /**
     *
     * @param type $itemName
     * @param type $instance
     */
    public function getItem($itemName, $instance)
    {
        $m = $this->getEntityMapper();
        $m->getItem($itemName, $instance);
    }

    /**
     * List of fields not in record, which can also be edited
     * @var {String[]}
     */
    protected $additionalFields = [];

    /**
     * Tries to retrieve package id according to input params
     * @return int
     */
    public function getPackageId()
    {
        $packageId = $this->getParam('id_package');
        if (!$packageId) {
            $packageAlias = $this->getParam('package');
            if ($packageAlias) {
                // try to find package by its name
                $packageId = Falcon_Mapper_X_Package::getInstance()
                    ->getPackageIdByAlias($packageAlias);
                // prevent sql request in future
                if ($packageId) {
                    $this->setParam('id_package', $packageId);
                }
            }
        }
        return $packageId;
    }

    /**
     * Returns supplied firm identifier
     * @return int
     */
    public function getFirmId()
    {
        $user = Falcon_Model_User::getInstance();
        if ($this->getParam('$firm') &&
            Falcon_Access::haveAdminRight($user->getId())
        ) {
            return $this->getParam('$firm');
        }
        return $this->getParam('id_firm', $user->getFirmId());
    }

    /**
     * Returns current user identifier
     * @return int
     */
    public function getUserId()
    {
        return Falcon_Model_User::getInstance()->getId();
    }

    /**
     * Returns entity name
     * @param {boolean} $actual redundant, used in children
     * @return string
     */
    public function getEntityName()
    {
        $className = get_class($this);
        return preg_replace('/^Falcon_Action_/', '', $className);
    }

    /**
     * Creates helper for access checking
     * @return {Falcon_Action_Rest_Helper_Access}
     */
    protected function createAccessHelper()
    {
        $id = $this->getParam('id', false);
        $access = new Falcon_Action_Rest_Helper_Access(
            $this->getEntityName(), $id);
        if ($id) {
            $access->setRecord($this->getEntityRecord($id));
        }
        return $access;
    }

    /**
     * Creates helper for history writing
     * @return {Falcon_Action_Rest_Helper_History}
     */
    protected function createHistoryHelper()
    {
        return new Falcon_Action_Rest_Helper_History(
            $this->getEntityName(),
            $this->getParam('id', false)
        );
    }

// ----------------------------------------------------------------------------

    /**
     * Returns mapper instance of current entity
     * @return Falcon_Mapper_Abstract
     */
    public function getEntityMapper()
    {
        $mClass = 'Falcon_Mapper_' . $this->getEntityName();
        return $mClass::getInstance();
    }

    /**
     * Returns record instance of current entity
     * @return Falcon_Record_Abstract
     */
    public function getEntityRecord($primaryKey = null)
    {
        $rClass = 'Falcon_Record_' . $this->getEntityName();
        return new $rClass($primaryKey);
    }


    /**
     * Returns a mapper or a record to work with
     * @param array $params
     * @return mixed
     */
    public function getInstance($params)
    {
        $id = $this->getParam('id');
        switch ($params['method']) {
            case 'doGetList':
            case 'doGetItem':
                $m = $this->getEntityMapper();
                break;
            case 'doCreate':
                $m = $this->getEntityRecord();
                break;
            case 'doUpdate':
            case 'doDelete':
                $m = $this->getEntityRecord($id);
                break;
        }
        return $m;
    }


    /**
     * Returns get query function
     * @param array $params Array of params
     * @return function
     */
    public function getQueryFn($params = [])
    {
        $params = array_merge($params, $this->getQueryParams());
        switch ($params['method']) {
            case 'doGetList':
                $fn = $this->getQueryListFn($params);
                break;
            case 'doGetItem':
                $fn = $this->getQueryItemFn($params);
                break;
        }
        return $fn;
    }

    /**
     * Returns get query function parameters
     * @return Mixed[]
     */
    protected function getQueryParams()
    {
        return ['firm' => $this->getFirmId()];
    }

    /**
     * Returns get query function for list
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryListFn($params)
    {
        $record = $this->getEntityRecord();
        $data = [
            'record' => $record,
            'firmId' => $params['firm'],
            'joined' => $this->getParam('$joined'),
            'quick' => $this->getParam('$quick'),
            'filter' => $this->getParam('$filter'),
            'showTrashed' => $this->getParam('$showtrashed'),
            'hasState' => $record->hasField('state'),
            //'getAccessList' => $this->getParam('$getaccesslist'),
            'total' => isset($params['total']) ? $params['total'] : false
        ];
        $excludeStates = $this->excludeStates;
        $self = $this;
        $fn = function ($sql) use ($self, $data, $excludeStates) {
            $self->makeQueryListSql($sql, $data);
            $sql->distinct();
            if ($data['hasState'] && !$data['showTrashed']) {
                $sql->where('t.state NOT IN (?)', $excludeStates);
            }
            if ($data['joined'] && !$data['total']) {
                $data['record']->getMapper()->joinForeignTables($sql);
            }
            Falcon_Odata_Filter::apply($data['filter'], $sql);
            if ($self->getAddAccessSql()) {
                Falcon_Access::addAccessSql($sql, $data['firmId'], [
                    'addfields' => !$data['total']
                ]);
            }
        };
        return $fn;
    }

    /**
     * Returns get query function for single item
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryItemFn($params)
    {
        $record = $this->getEntityRecord();
        $data = [
            'record' => $record,
            'firmId' => $params['firm'],
            'joined' => $this->getParam('$joined'),
            'primaryKey' => $this->getParam('id'),
            'primaryKeyName' => $this->getEntityRecord()->getSimpleIdName()
        ];
        $self = $this;
        $fn = function ($sql) use ($self, $data) {
            $self->makeQueryItemSql($sql, $data);
            $sql
                ->where("t." . $data['primaryKeyName'] . ' = ?',
                    $data['primaryKey']);
            if ($data['joined']) {
                $data['record']->getMapper()->joinForeignTables($sql);
            }
            if ($self->getAddAccessSql()) {
                Falcon_Access::addAccessSql($sql, $data['firmId']);
            }
        };
        return $fn;
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryListSql($sql, $data)
    {
        /* do something in childs */
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryItemSql($sql, $data)
    {
        /* do something in childs */
    }

    /**
     * Creates joined records if supplied
     * @param type $c
     */
    public function instanceCreateJoinedItems($c)
    {
        $foreignKeys = $c->getForeignKeys();
        foreach ($foreignKeys as $fieldName => $foreignFieldConfig) {
            $param = $this->getParam($fieldName . '$new');
            if ($param === NULL) {
                continue;
            }
            // foreign key "new" command is found
            // let's create instance of this item
            $foreignTableName = key($foreignFieldConfig);
            $ACTION = getFalconClassName('Falcon_Action_', $foreignTableName);
            $params = array_merge($this->getParams(), ['name' => $param]);
            $foreignAction = new $ACTION($params);
            $answer = $foreignAction->doCreate(false, false);
            if ($answer->isSuccess()) {
                $data = $answer->getData();
                if (count($data) > 0) {
                    $this->setParam($fieldName, $data['id']);
                }
            }
        }
    }

    /**
     * Create instance
     * @param Falcon_Record_Abstract $c
     */
    public function instanceCreate($c)
    {
        if (false === $this->onBeforeCreate($c)) {
            return;
        }

        $this->checkRestrictedFields($c);
        $this->checkForeignKeys($c);

        // check for required fields
        $supplied = $this->requiredFieldsSupplied($c);

        if ($supplied->isFailure()) {
            throw new Falcon_Exception('Incorrect input parameters',
                Falcon_Exception::ACCESS_VIOLATION,
                $supplied->getLastError());
        }

        // create foreign instances if supplied
        $this->instanceCreateJoinedItems($c);

        // let's create new instance
        foreach ($c->getFields(!$c->isSimpleId()) as $field) {
            if ($c->get($field) === null
                && $this->getParam($field) !== null
            ) {
                $c->set($field, $this->getParam($field));
            }
        }

        $c->insert();

        $ac_data = $this->onAfterCreate($c);

        if ($c->isSimpleId()) {
            $this->setParam('id', $c->getId());
            $data = $this->doGetItem()->getData();
        } else {
            $data = [];
            $data = array_merge($c->load()->toArray(), $data);
        }

        if (isset($ac_data) && is_array($ac_data)) {
            $data = array_merge($ac_data, $data);
        }

        foreach ($c->getLinkedRecords() as $linkedRecord) {
            $data[$linkedRecord['alias']] =
                $this->createLinkedRecord($c, $linkedRecord);
        }

        return $data;
    }

    /**
     * Creates linked record
     * @param type $instance
     * @param type $linkedRecord
     */
    public function createLinkedRecord($instance, $linkedRecord)
    {
        return $this->updateLinkedRecord($instance, $linkedRecord);
    }

    /**
     * Updates linked record
     * @param type $instance
     * @param type $linkedRecord
     */
    public function updateLinkedRecord($instance, $linkedRecord,
                                       $params = null)
    {
        $m = $linkedRecord['mapper']::getInstance();
        $paramName = $linkedRecord['alias'];
        if ($this->hasParam($paramName, $params)) {
            $data = $this->getParam($paramName, null, (array)$params);
            return $m->setForOwner($data, $instance, $linkedRecord);
        } else {
            return $m->loadForOwner($linkedRecord, $instance);
        }
    }

    /**
     * Update instance
     * @param Falcon_Record_Abstract $c
     */
    public function instanceUpdate($c)
    {
        if ($this->onBeforeUpdate($c) === false) return;
        $user = Falcon_Model_User::getInstance();
        // isshared
        $isShared = $this->getAccessHelper()->isShared();
        $params = $this->getParams();

        if (!empty($params['$moveToFirm'])
            && $user->hasRight('transfer_object')
        ) {
            $this->moveToFirm($c, json_decode($params['$moveToFirm'], true));
            // If moving to firm update record immediately
            // and don't perform any other actions
            $c->update();
            return $c->toArray();
        }
        if (!empty($params['$accessGrant']) && !$isShared) {
            $this->accessGrant($c, json_decode($params['$accessGrant'], true));
            $this->accessActions[] = 'grant';
        }
        if (!empty($params['$accessRevoke']) && !$isShared) {
            $this->accessRevoke($c, json_decode($params['$accessRevoke'], true));
            $this->accessActions[] = 'revoke';
        }
        if (!empty($params['$accessEdit']) && !$isShared) {
            $this->accessEdit($c, json_decode($params['$accessEdit'], true));
            $this->accessActions[] = 'edit';
        }

        $this->checkRestrictedFields($c);
        $this->checkForeignKeys($c);

        // create foreign instances if supplied
        $this->instanceCreateJoinedItems($c);

        // fill in record params
        $fields = array_merge($c->getFields(false), $this->additionalFields);

        // If isshared, exclude protected and readonly fields
        if ($isShared) {
            $fields = array_diff($fields, $c->getProtectedFields(),
                $c->getReadonlyFields()
            );
        }

        foreach ($fields as $field) {
            if ($field == 'id_firm') {
                continue;
            }
            if (!$this->hasParam($field)) {
                continue;
            }
            $param = $this->getParam($field);

            /*if ($param === NULL)
            {
                continue;
            }*/

            $continue = true;
            $methodName = 'onUpdate' . ucfirst($field);
            if (method_exists($this, $methodName)) {
                $continue = $this->$methodName($c, $param);
            }

            if ($continue !== false) {
                $c->set($field, $param);
            }
        }

        // If some linked record will be updated
        // set ignoreChangesForUpdate flag on logged trigger
        // We need it because probably no actual record fields will be updated
        // but we still need an frontend update to be sended
        foreach ($c->getLinkedRecords() as $linkedRecord) {
            $paramName = $linkedRecord['alias'];
            if ($this->hasParam($paramName, (array)$this->getParams())) {
                $loggedTrigger = $c->getTrigger('logged');
                if ($loggedTrigger) {
                    $loggedTrigger->setIgnoreChangesForUpdate(true);
                }

                break;
            }
        }

        $c->update();

        $ac_data = $this->onAfterUpdate($c);
        $data = $this->doGetItem()->getData();
        if (isset($ac_data) && is_array($ac_data)) {
            $data = array_merge($data, $ac_data);
        }

        $params = (array)$this->getParams();
        foreach ($c->getLinkedRecords() as $linkedRecord) {
            $data[$linkedRecord['alias']] =
                $this->updateLinkedRecord($c, $linkedRecord, $params);
        }

        return $data;
    }

    /**
     * Filters given params
     * @param array $params Array of params
     * @param integer $type Action type
     */
    protected function filterParams($params, $type)
    {
    }

    /**
     * Grants access on given object
     * @param type $c
     * @param type $grant
     */
    protected function moveToFirm($c, $params)
    {
        $user = Falcon_Model_User::getInstance();
        // Save current access
        $table = new Falcon_Table_X_Access();
        $users = $table->getUsersByObject($c);

        $logged = $c->getTrigger('logged');
        // Write updates in any case
        $logged->setIgnoreChangesForUpdate(true);

        // Set additional logged users because actual access could be changed
        if ($logged) {
            $logged->setAdditionalUsers($users);
        }

        if (!empty($params['share'])) {
            if ($params['share']) {
                $access = new Falcon_Record_X_Access([
                    'id_object' => $c->getId(),
                    'right' => strtolower($this->getEntityName()),
                    'id_firm' => $user->getFirmId(),
                    'auto' => 1
                ]);
                $access->insert();
            }
        }

        $c->set('id_firm', $params['id_firm']);
    }

    /**
     * Grants access on given object
     * @param type $c
     * @param type $grant
     */
    protected function accessGrant($c, $grant)
    {
        $name = strtolower($this->getEntityName());
        $this->getAccessHelper()->checkGrant();

        $loggedTrigger = $c->getTrigger('logged');
        if ($loggedTrigger) {
            $loggedTrigger->setIgnoreChangesForUpdate(true);
        }

        $grantedIds = [];
        foreach ($grant as $item) {
            $record = new Falcon_Record_X_Access([
                'id_firm' => empty($item['id_firm']) ? 0 : $item['id_firm'],
                'id_user' => empty($item['id_user']) ? 0 : $item['id_user'],
                'shared' => empty($item['shared']) ? 1 : $item['shared'],
                'writeable' => empty($item['write']) ? 0 : $item['write'],
                'right' => $name,
                'sdt' => empty($item['sdt']) ? null : $item['sdt'],
                'edt' => empty($item['edt']) ? null : $item['edt'],
                'id_object' => $c->getId(),
                // Pending by default
                'status' => Falcon_Record_X_Access::STATUS_PENDING
            ]);

            // Before access granted
            $this->beforeAccessGrant($record);

            // Insert record
            $record->insert();

            // Add x_history entry
            $this->getHistoryHelper()->accessGrant($record->getId());

            // Save inserted id
            $grantedIds[] = $record->get('id');

            // After x_access entry created
            $this->afterAccessGrant($item, $record, $c);
        }

        return $grantedIds;
    }

    /**
     * After access has been granted
     * Access not existed or was closed
     * And no other access presented
     * @param type $item
     * @param type $record
     */
    protected function afterAccessGrant($item, $record, $c)
    {
        $logger = Falcon_Logger::getInstance();
        $record->confirmationRequest($c);
    }

    /**
     * Before x_access entry created
     * @param type $record
     * @return boolean
     */
    protected function beforeAccessGrant(&$record)
    {
        return true;
    }

    /**
     * Revokes access on given object
     * @param type $c
     * @param type $revoke
     */
    protected function accessRevoke($c, $revoke)
    {
        $logger = Falcon_Logger::getInstance();
        $name = strtolower($this->getEntityName());
        $this->getAccessHelper()->checkGrant();

        foreach ($revoke as $item) {
            $idFirm = empty($item['id_firm']) ? 0 : $item['id_firm'];
            $idUser = empty($item['id_user']) ? 0 : $item['id_user'];

            $records = Falcon_Mapper_X_Access::getInstance()->load([
                'id_firm = ?' => $idFirm,
                'id_user = ?' => $idUser,
                '"right" = ?' => $name,
                'id_object = ?' => $c->getId()
            ]);
            foreach ($records as $record) {
                $record->delete();
            }

            // Add x_history entry
            $this->getHistoryHelper()->accessRevoke($item['id_user']);
        }
    }

    /**
     * Edit access for given object
     * @param type $c
     * @param type $edit
     */
    protected function accessEdit($c, $edit)
    {
        $this->getAccessHelper()->checkGrant();
        $logger = Falcon_Logger::getInstance();

        $loggedTrigger = $c->getTrigger('logged');
        $groupedTrigger = $c->getTrigger('grouped');

        // Set users before access edit as additional
        $table = new Falcon_Table_X_Access();
        if ($loggedTrigger) {
            $loggedTrigger->setIgnoreChangesForUpdate(true);
            $loggedTrigger->setAdditionalUsers($table->getUsersByObject($c));
        }

        if ($groupedTrigger) {
            $groupedTrigger->addAccessActions($edit);
        }

        foreach ($edit as $item) {
            if (empty($item['data'])) {
                continue;
            }

            if (empty($item['id'])) {
                continue;
            }

            $record = new Falcon_Record_X_Access($item['id']);

            if (empty($record)) {
                continue;
            }

            $allowEdit = ['sdt', 'edt', 'writeable'];
            foreach ($item['data'] as $field => $value) {
                if (in_array($field, $allowEdit)) {
                    $record->set($field, $value);
                }
            }

            $record->update();

            // Add x_history entry
            $this->getHistoryHelper()->accessEdit($record->get('id'));
        }
    }

    /**
     * Delete instance
     * @param type $c
     */
    public function instanceDelete($c)
    {
        $continue = $this->onBeforeDelete($c);
        if ($continue === false) {
            return;
        }

        $c->trash();
        $this->onAfterDelete($c);
    }

// ----------------------------------------------------------------------------

    /**
     * Actions to perform before getting list of instance
     * @return bool
     */
    protected function onBeforeGetList()
    {
        if ($this->checkRead) {
            $this->getAccessHelper()->checkReadList();
        }
        return true;
    }

    /**
     * Actions to perform before getting an instance
     * @param int /array $primaryKey
     * @return bool
     */
    protected function onBeforeGetItem($primaryKey)
    {
        if ($this->checkRead) {
            $this->getAccessHelper()->checkRead();
        }

        return true;
    }

    /**
     * Checks access for the restricted fields of the record $c
     * @param type $c
     */
    protected function checkRestrictedFields($c)
    {
        $params = $this->getParams();
        // check access for the restricted fields
        $restrictedFields = $c->getRestrictedFields();
        foreach ($restrictedFields as $fieldName => $value) {
            if (!array_key_exists($fieldName, $params)) {
                continue;
            }
            try {
                if ($this->checkWrite) {
                    $this->getAccessHelper()->checkWrite();
                }
            } catch (Falcon_Exception $e) {
                if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                    $this->unsetParam($fieldName);
                }
            }
        }
    }

    /**
     * Checks access for the restricted fields of the record $c
     * @param Falcon_Record_Abstract $c
     */
    protected function checkForeignKeys($c)
    {
        $params = $this->getParams();
        // check access for the foreign fields
        $foreignKeys = $c->getForeignKeys();
        foreach ($foreignKeys as $fieldName => $fieldConfig) {
            if (!array_key_exists($fieldName, $params)) {
                continue;
            }
            try {
                $value = $params[$fieldName];
                $c->getMapper()->checkReadForeignKey($fieldName, $value);
            } catch (Falcon_Exception $e) {
                if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                    $this->unsetParam($fieldName);
                }
            }
        }
    }

    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeCreate($c)
    {
        $params = $this->getParams();
        $this->filterParams($params, Falcon_Access::ACCESS_CREATE);
        if ($this->checkCreate) {
            $this->getAccessHelper()->checkCreate();
        }

        return true;
    }

    /**
     * Actions to perform before updating instance
     * @param type $c
     */
    protected function onBeforeUpdate($c)
    {
        $params = $this->getParams();
        $this->filterParams($params, Falcon_Access::ACCESS_WRITE);
        if ($this->checkWrite) {
            $this->getAccessHelper()->checkWrite();

            // If item is shared then
            // check if user have right access shared devices
            $user = Falcon_Model_User::getInstance();
            if ($this->getAccessHelper()->isShared()) {
                if (!$user->hasRight('view_shared_for_firm')) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Actions to perform before deleting instance
     * @param type $c
     */
    protected function onBeforeDelete($c)
    {
        if ($this->checkWrite) {
            $this->getAccessHelper()->checkWrite();

            // If item is shared
            // check if user have right to access shared devices
            $user = Falcon_Model_User::getInstance();
            if ($this->getAccessHelper()->isShared()) {
                if (!$user->hasRight('view_shared_for_firm')) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Actions to perform after getting list
     * @return bool
     */
    protected function onAfterGetList()
    {
        return true;
    }

    /**
     * Actions to perform after getting item
     * @return bool
     */
    protected function onAfterGetItem()
    {
        return true;
    }

    /**
     * Actions to perform after creating instance
     * @param type $c
     */
    protected function onAfterCreate($c)
    {
        return true;
    }

    /**
     * Actions to perform after updating instance
     * @param type $c
     */
    protected function onAfterUpdate($c)
    {
        return true;
    }

    /**
     * Actions to perform after deleting instance
     * @param type $c
     */
    protected function onAfterDelete($c)
    {
        return true;
    }

// ----------------------------------------------------------------------------

    /**
     * Prepare input parameters
     * @param array $params
     */
    public function prepareInputParams($methodParams)
    {
        $rec = $this->getEntityRecord();
        foreach ($rec->getLinkedRecords() as $linkedRecord) {
            $alias = $linkedRecord['alias'];
            $param = $this->getParam($alias);
            if ($param && is_string($param)) {
                $this->setParam($alias, json_decode($param));
            }
        }
    }

    /**
     * Returns a list of items
     * @param bool $writeResponseHeaders [opt. defaults to true]
     * @return Falcon_Message
     */
    public function doGetList($writeResponseHeaders = true)
    {
        $this->prepareInputParams(['method' => __FUNCTION__]);
        $params = $this->getParam('pageAndOrderParams');
        $this->checkUpperLimit($params);
        if ($this->getParam('$fields')) {
            $params['fields'] = json_decode($this->getParam('$fields'));
        }

        $joined = $this->getParam('$joined');

        if (!$this->onBeforeGetList()) {
            return $this->getAnswer();
        }

        $m = $this->getInstance(['method' => __FUNCTION__]);
        $m->setParams($this->getParams());

        $records = $m->loadBy($this->getQueryFn([
            'method' => __FUNCTION__,
            'total' => false
        ]), $params, (bool)$joined);

        $this->getAnswer()->addParam('data', $this->processRecords($records));

        if ($this->getParam('$showtotalcount')) {
            $totalCount = $m->getTotalCountBy($this->getQueryFn([
                'method' => __FUNCTION__,
                'total' => true
            ]));
            $this->getAnswer()->addParam('count', $totalCount);
        }

        $this->onAfterGetList();

        return $this->getAnswer();
    }

    /**
     * Checks if action have upper limit for list and applies if needed
     * @param {Mixed[]} $params
     */
    protected function checkUpperLimit(&$params)
    {
        if (
            $this->upperLimit
            && !$this->getParam('$nolimit')
            && (
                empty($params['page']['count'])
                || $params['page']['count'] > $this->upperLimit
            )
        ) {
            if (!isset($params['page'])) {
                $params['page'] = ['start' => 0];
            }
            $params['page']['count'] = $this->upperLimit;
        }
    }

    /**
     * Processes read records before giving them away
     * @param {Mixed[]} $records
     */
    protected function processRecords($records)
    {
        $this->unsetPrivateFields($records);
        $this->unsetProtectedFields($records);

        // Filter dublicate records
        return $this->filterDuplicateRecords($records);
    }

    /**
     * Returns an item data by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doGetItem($writeResponseHeaders = true)
    {
        $methodParams = ['method' => __FUNCTION__];
        $this->prepareInputParams($methodParams);
        $joined = $this->getParam('$joined');

        $primaryKey = $this->getParam('id');
        if (!$this->onBeforeGetItem($primaryKey)) {
            return $this->getAnswer();
        }

        if ($primaryKey) {
            $m = $this->getInstance($methodParams);
            $m->setParams($this->getParams());
            $records = $m->loadBy(
                $this->getQueryFn($methodParams),
                [],
                (bool)$joined
            );
            $records = $this->processRecords($records);
            if (count($records) < 1) {
                $this->getAnswer()->error(Falcon_Exception::OBJECT_NOT_FOUND,
                    ['Item with id "' . $primaryKey . '" not found']);
                if ($writeResponseHeaders) {
                    $this->getResponse()->setHttpResponseCode(
                        Falcon_Exception::OBJECT_NOT_FOUND);
                }
            } else {
                $returnRecord = $this->findMaxWriteable($records);
                $this->getAnswer()->addParam('data', $returnRecord);
            }
        } else {
            $entity = strtolower($this->getEntityName());
            $this->getAnswer()->error(Falcon_Exception::BAD_REQUEST,
                ["Please, specify item id '/$entity/:id'"]);
            if ($writeResponseHeaders) {
                $this->getResponse()->setHttpResponseCode(
                    Falcon_Exception::BAD_REQUEST);
            }
        }

        $this->onAfterGetItem();
        return $this->getAnswer();
    }

    /**
     * Filters dublicate records by max writeable value
     * @param type $records
     * @return type
     */
    protected function filterDuplicateRecords($records)
    {
        // Select one with max writeable from dublicates
        $recordMap = [];
        foreach ($records as $record) {
            if (!isset($record['id'])) {
                break;
            }

            if (!isset($recordMap[$record['id']])) {
                $recordMap[$record['id']] = [];
            }

            $recordMap[$record['id']][] = $record;
        }

        if (empty($recordMap)) {
            // If no dublicates found
            $returnRecords = $records;
        } else {
            $returnRecords = [];
            foreach ($recordMap as $recordArr) {
                if (count($recordArr) > 1) {
                    $returnRecords[] = $this->findMaxWriteable($recordArr);
                } else {
                    $returnRecords[] = $recordArr[0];
                }
            }
        }

        return $returnRecords;
    }

    /**
     * Unsets private fields
     * @param type $records
     */
    protected function unsetPrivateFields(&$records)
    {
        $privateFields = $this->getEntityRecord()->getPrivateFields();
        if (!empty($privateFields)) {
            foreach ($records as &$record) {
                foreach ($privateFields as $fieldName) {
                    unset($record[$fieldName]);
                }
            }
        }
    }

    /**
     * Unset protected fields
     * @param type $records
     */
    protected function unsetProtectedFields(&$records)
    {
        // unset protected fields for shared records
        $protectedFields = $this->getEntityRecord()->getProtectedFields();
        if (!empty($protectedFields)) {
            foreach ($records as &$record) {
                if (!isset($record['isshared'])) {
                    continue;
                }
                if (!$record['isshared']) {
                    continue;
                }
                foreach ($protectedFields as $fieldName) {
                    unset($record[$fieldName]);
                }
            }
        }
    }

    /**
     * Find record with max writeable value
     * @param type $records
     */
    protected function findMaxWriteable($records)
    {
        $returnRecord = $records[0];
        foreach ($records as $record) {
            if (!isset($record['iseditable'])) {
                continue;
            }

            if ($record['iseditable']) {
                $returnRecord = $record;
                break;
            }
        }

        return $returnRecord;
    }

    /**
     * Checks if supplied all required fields
     * @param type $c
     * @return Falcon_Message
     */
    public function requiredFieldsSupplied($c)
    {
        $answer = new Falcon_Message();
        $requiredFields = $c->getRequiredFields();
        foreach ($requiredFields as $field) {
            if (!$this->getParam($field)) {
                $answer->error(Falcon_Exception::BAD_REQUEST,
                    ["Please, specify correct " . $field]);
                return $answer;
            }
        }
        return $answer;
    }

    /**
     * Creates an item
     * @param bool $writeResponseHeaders [opt. defaults to true]
     * @param bool $startTransaction [opt. defaults to true]
     */
    public function doCreate(
        $writeResponseHeaders = true,
        $startTransaction = true)
    {
        $methodParams = ['method' => __FUNCTION__];
        $this->prepareInputParams($methodParams);

        $c = $this->getInstance($methodParams);
        $supplied = $this->requiredFieldsSupplied($c);
        if ($supplied->isSuccess()) {
            //$db = Zend_Db_Table::getDefaultAdapter();
            if ($startTransaction) {
                $this->startTransaction();
            }
            try {
                // let's create new instance
                $this->getAnswer()->addParam('data', $this->instanceCreate($c));

                // commit changes
                if ($startTransaction) {
                    $this->commitTransaction();
                }
            } catch (Exception $e) {
                if ($startTransaction) {
                    $this->rollbackTransaction();
                }
                throw $e;
            }
            if ($writeResponseHeaders) {
                // 201 Created
                $this->getResponse()->setHttpResponseCode(201);
            }
        } else {
            if ($writeResponseHeaders) {
                $this->getResponse()->setHttpResponseCode(
                    Falcon_Exception::BAD_REQUEST);
            }
        }
        return $this->getAnswer();
    }

    /**
     * Updates item by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     * @param bool $startTransaction [opt. defaults to true]
     */
    public function doUpdate(
        $writeResponseHeaders = true,
        $startTransaction = true)
    {
        $methodParams = ['method' => __FUNCTION__];
        $this->prepareInputParams($methodParams);

        $primaryKey = $this->getParam('id');
        if ($primaryKey) {
            // update instance
            $c = $this->getInstance($methodParams);
            if (!$c->isLoaded()) {
                $this->getAnswer()->error(Falcon_Exception::NO_CONTENT);
                if ($writeResponseHeaders) {
                    // 204 tells the server to immediately
                    // termiante this request.
                    $this->getResponse()->setHttpResponseCode(
                        Falcon_Exception::NO_CONTENT);
                }
            } else {
                //$db = Zend_Db_Table::getDefaultAdapter();
                if ($startTransaction) {
                    $this->startTransaction();
                }
                try {
                    $this->getAnswer()->addParam('data',
                        $this->instanceUpdate($c));
                    // commit changes
                    if ($startTransaction) {
                        $this->commitTransaction();
                    }
                } catch (Exception $e) {
                    if ($startTransaction) {
                        $this->rollbackTransaction();
                    }
                    throw $e;
                }
            }
        } else {
            $entity = strtolower($this->getEntityName());
            $this->getAnswer()->error(Falcon_Exception::BAD_REQUEST,
                ["Please, specify item id '/$entity/:id'"]);
            if ($writeResponseHeaders) {
                $this->getResponse()->setHttpResponseCode(
                    Falcon_Exception::BAD_REQUEST);
            }
        }
        return $this->getAnswer();
    }

    /**
     * Deletes item by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     * @param bool $startTransaction [opt. defaults to true]
     */
    public function doDelete(
        $writeResponseHeaders = true,
        $startTransaction = true)
    {
        $methodParams = ['method' => __FUNCTION__];
        $this->prepareInputParams($methodParams);

        $primaryKey = $this->getParam('id');
        if ($primaryKey) {
            // delete instance
            $c = $this->getInstance($methodParams);
            if (!$c->isLoaded()) {
                $this->getAnswer()->error(Falcon_Exception::NO_CONTENT);
                if ($writeResponseHeaders) {
                    // 204 tells the server to immediately
                    // termiante this request.
                    $this->getResponse()->setHttpResponseCode(
                        Falcon_Exception::NO_CONTENT);
                }
            } else {
                //$db = Zend_Db_Table::getDefaultAdapter();
                if ($startTransaction) {
                    $this->startTransaction();
                }
                try {
                    $this->instanceDelete($c);
                    // commit changes
                    if ($startTransaction) {
                        $this->commitTransaction();
                    }
                } catch (Exception $e) {
                    if ($startTransaction) {
                        $this->rollbackTransaction();
                    }
                    throw $e;
                }
            }
        } else {
            $entity = strtolower($this->getEntityName());
            $this->getAnswer()->error(Falcon_Exception::BAD_REQUEST,
                ["Please, specify item id '/$entity/:id'"]);
            if ($writeResponseHeaders) {
                $this->getResponse()->setHttpResponseCode(
                    Falcon_Exception::BAD_REQUEST);
            }
        }
        return $this->getAnswer();
    }

    /**
     * Returns true if need to check read
     * @return Boolean
     */
    public function needCheckRead()
    {
        return $this->checkRead;
    }

    public function getAddAccessSql()
    {
        return $this->addAccessSql;
    }
}
