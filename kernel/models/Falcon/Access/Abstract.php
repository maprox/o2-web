<?php

/**
 * Abstract server access manager class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Access_Abstract
{
    /**
     * Alias for rightcheck variable
     * @var String
     */
    private static $_rightCheckAlias = 'enableRightCheck';

    /**
     * Stores fetched information about global user rights
     * @cfg Integer[]
     */
    protected static $rightsCache = [];

    const
        ACCESS_READ = 1,
        ACCESS_WRITE = 2,
        ACCESS_CREATE = 4,
        ACCESS_GRANT = 8;

    const SUPERADMIN_RIGHT = 'superadmin';

    /**
     * Performs access check based on parameters given
     * @param Array $params
     */
    public static function check($params)
    {
        list($item, $user, $id) = self::parseParams($params);

        switch ($params['access']) {
            case 'read':
                return self::checkRead($item, $id, $user);
            case 'write':
                return self::checkWrite($item, $id, $user);
            case 'create':
                return self::checkCreate($item, $user);
            case 'grant':
                return self::checkGrant($item, $id, $user);
            default:
                self::throwError();
        }
    }

    /**
     * Prepares parameters given as array
     * @param Array $params
     * @return Array
     */
    protected static function parseParams($params)
    {
        if (empty($params['access']) || empty($params['item'])) {
            self::throwError();
        }

        $params['user'] = empty($params['user']) ? false : $params['user'];
        $params['id'] = empty($params['id']) ? false : $params['id'];

        return [$params['item'], $params['user'], $params['id']];
    }

    /**
     * Tests if user have read right on given instance or object
     * @param String $item instance type
     * @param Integer $id object id
     * @param Integer $user user id
     * @param Boolean $shared allow shared access
     */
    public static function checkRead($item, $id = false, $user = false,
                                     $shared = true)
    {
        if (is_array($item)) {
            list($item, $user, $id) = self::parseParams($item);
        }

        $user = self::checkUser($user);

        if (self::innerCheckRead(self::SUPERADMIN_RIGHT, false, $user)) {
            return;
        }

        $haveRight = self::innerCheckRead($item, $id, $user, $shared);
        if (empty($haveRight)) {
            self::throwError();
        }
    }

    /**
     * Tests if user have read right on given instance or object
     * @param String $item instance type
     * @param Integer $id object id
     * @param Integer $user user id
     * @param Boolean $shared allow shared access
     * @return Boolean
     */
    protected static function innerCheckRead($item, $id, $user, $shared = true)
    {
        $userRecord = new Falcon_Record_X_User($user);
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        $haveRight = self::checkGlobalRights($item, $user, self::ACCESS_READ);

        if ($haveRight && !empty($id)) {
            $haveRight = self::testFirmId($user, $item, $id);
        }

        if (empty($haveRight)) {
            $where = [
                'id_user = ?' => $user,
                '"right" = ?' => $item,
                'status = ?' => Falcon_Record_X_Access::STATUS_ACTIVE
            ];
            if (!empty($id)) {
                $where['id_object = ?'] = $id;
            }
            if (empty($shared)) {
                $where['shared = ?'] = 0;
            }

            $count = Falcon_Mapper_X_Access::getInstance()->getCount($where);
            $haveRight = $count > 0;
        }

        if (empty($haveRight)) {
            $where = [
                'id_firm = ?' => $userRecord->get('id_firm'),
                '"right" = ?' => $item,
                'status = ?' => Falcon_Record_X_Access::STATUS_ACTIVE
            ];
            if (!empty($id)) {
                $where['id_object = ?'] = $id;
            }
            if (empty($shared)) {
                $where['shared = ?'] = 0;
            }
            $count = Falcon_Mapper_X_Access::getInstance()->getCount($where);
            $haveRight = $count > 0;
        }

        if (empty($haveRight)) {
            $db = Zend_Db_Table::getDefaultAdapter();

            $query = $db->select()
                ->from(['xa' => 'x_access'])
                ->join(
                    ['xgil' => 'x_group_item_link'],
                    'id_group = xa.id_object'
                )
                ->where('id_user = ?', $user)
                ->where('"right" = ?', 'x_group_' . $item)
                ->where('status = ?', Falcon_Record_X_Access::STATUS_ACTIVE);

            if (!empty($id)) {
                $query->where('id_item = ?', $id);
            }
            if (empty($shared)) {
                $query->where('shared = ?', 0);
            }

            $rows = $db->query($query);
            $result = $rows->fetchAll();

            $haveRight = count($result) > 0;
        }

        if (empty($haveRight)) {
            $db = Zend_Db_Table::getDefaultAdapter();

            $query = $db->select()
                ->from(['xa' => 'x_access'])
                ->join(
                    ['xgil' => 'x_group_item_link'],
                    'id_group = xa.id_object'
                )
                ->where('id_firm = ?', $userRecord->get('id_firm'))
                ->where('"right" = ?', 'x_group_' . $item)
                ->where('status = ?', Falcon_Record_X_Access::STATUS_ACTIVE);

            if (!empty($id)) {
                $query->where('id_item = ?', $id);
            }
            if (empty($shared)) {
                $query->where('shared = ?', 0);
            }

            $rows = $db->query($query);
            $result = $rows->fetchAll();

            return (count($result) > 0);
        }

        return $haveRight;
    }

    /**
     * Transforms sql adding access limitations and edit information to output
     * @param {Zend_Db_Select} $sql
     * @param {Integer} $firmId
     * @param {Array} $params Additional params
     */
    public static function addAccessSql($sql, $firmId = -1, $params = [])
    {
        $user = Falcon_Model_User::getInstance();
        $sqlInfo = $sql->getPart(Zend_Db_Select::FROM);
        $keys = array_keys($sql->getPart(Zend_Db_Select::FROM));
        $prefix = reset($keys);
        $sqlInfo = reset($sqlInfo);
        $className = 'Falcon_Mapper_' . ucwords_custom($sqlInfo['tableName']);
        $mapper = $className::getInstance();

        $actionClassName = 'Falcon_Action_'
            . ucwords_custom($sqlInfo['tableName']);

        $exists = class_exists_warn_off($className);
        $actionExists = class_exists_warn_off($actionClassName);

        // Can I add a condition to sql which allow
        // not to join x_access entries with id_firm equeals
        // requesed object's id_firm
        // We need this if user shared some object to his own firm
        $canExcludeShareMyself = true;
        if ($exists) {
            if ($mapper->getFirmRestriction() == false) {
                $firmCondition = 'True';
                $canExcludeShareMyself = false;
            } else {
                $firmTable = $mapper->addFirmJoin($sql);
                if (empty($firmTable)) {
                    $firmTable = $prefix;
                }

                $needCheckRead = true;
                // Read check may be disabled in action
                if ($actionExists) {
                    $action = new $actionClassName;
                    if (!$action->needCheckRead()) {
                        $needCheckRead = false;
                    }
                }
                if ($needCheckRead) {
                    $haveRight = self::checkGlobalRights($mapper->getName(),
                        self::getUser(), self::ACCESS_READ);
                } else {
                    $haveRight = true;
                }

                if ($haveRight) {
                    $firmCondition = $firmTable . '.id_firm = ' . (int)$firmId;
                } else {
                    $firmCondition = 'False';
                    //$canExcludeShareMyself = false;
                }
            }
        } else {
            $firmCondition = 'False';
            $canExcludeShareMyself = false;
        }

        if (empty($firmTable) || $firmTable == $prefix) {
            $firmTable = $prefix;
            $tableName = $sqlInfo['tableName'];
        } else {
            $tableName = $firmTable;
        }

        $className = 'Falcon_Mapper_' . ucwords_custom($tableName);
        $mapper = $className::getInstance();
        $recordClass = $mapper->getRecordClassName();

        $recordPrimaryKey = $recordClass::getPrimaryKey();
        $haveAccessJoin = (count($recordPrimaryKey) == 1);

        $groupClassName = 'Falcon_Mapper_' .
            ucwords_custom('X_Group_' . $tableName);
        $groupExists = class_exists_warn_off($groupClassName);

        // If we don't need to join access table
        if (!$haveAccessJoin) {
            $sql->where($firmCondition);
        } else {
            $sharedForFirm = '';
            $primaryKey = $recordPrimaryKey[0];

            // Do not include shared for current user objects,
            // if another firmId given
            if (Falcon_Model_User::getInstance()->getFirmId() !== $firmId) {
                $accessString = '(x_access.id_firm = ' . (int)$firmId . ')';

                $accessGroupCondition =
                    'id_firm = ' . $firmId;

            } else {
                if ($user->hasRight('view_shared_for_firm')) {
                    $sharedForFirm = ' OR '
                        . 'x_access.id_firm = '
                        . (int)$firmId;
                }

                $accessString = '(x_access.id_user = ' . self::getUser()
                    . $sharedForFirm . ')';

                $accessGroupCondition =
                    'id_user = ' . self::getUser() . ' OR id_firm = ' . $firmId;
            }

            $joinAccess = $firmTable . '.' . $primaryKey . ' = x_access.id_object' .
                ' AND x_access.sdt < current_timestamp ' .
                ' AND (x_access.edt IS NULL OR x_access.edt > current_timestamp) ' .
                ' AND x_access."right" = \'' . $tableName . '\'' .
                ' AND x_access.status = '
                . Falcon_Record_X_Access::STATUS_ACTIVE .
                ' AND ' . $accessString;

            // Exclude x_access entries shared for current device's firm
            if ($sharedForFirm && $canExcludeShareMyself) {
                $joinAccess .=
                    ' AND ' . $firmTable . '.id_firm <> x_access.id_firm';
            }

            $sql->joinLeft('x_access', $joinAccess, []);

            if ($groupExists) {
                // Join group access
                $db = Zend_Db_Table::getDefaultAdapter();

                $selectAccessGroups = $db->select()
                    ->from('x_access')
                    ->where($accessGroupCondition)
                    ->where('"right" = ?', 'x_group_' . $tableName)
                    ->where('status = ?', Falcon_Record_X_Access::STATUS_ACTIVE);

                $xgil = $db->select()
                    ->from(['xgil' => 'x_group_item_link'])
                    ->join(['xag' => $selectAccessGroups],
                        'xgil.id_group = xag.id_object'
                    );

                $xgil->join(['xgt' => 'x_group_' . $tableName],
                    'xgil.id_group = xgt.id'
                )
                    ->where('xgt.state = 1');


                $sql->joinLeft(['gi' => $xgil],
                    'gi.id_item = t.id',
                    []
                );
            }

            $where = $firmCondition . ' OR ' . 'x_access.id_object > 0';

            // Additional where if group exists
            if ($groupExists) {
                $where .= ' OR gi.id_item > 0';
            }

            $sql->where($where);
        }


        $isAdmin = self::innerCheckWrite(
            self::SUPERADMIN_RIGHT, false, self::getUser());
        if ($isAdmin) {
            $globalEditablePart = 'True';
        } else {
            // This write access will work only if object belongs to user's firm
            // So writeable seems to be allways correct value
            $globalWriteAccess = self::innerCheckWrite($tableName,
                false, self::getUser());

            if ($globalWriteAccess) {
                $globalEditablePart = $firmCondition;
            } else {
                $globalEditablePart = 'False';
            }
        }

        $addFieldsFlag = true;
        if (isset($params['addfields'])) {
            $addFieldsFlag = $params['addfields'];
        }

        if ($addFieldsFlag) {
            if ($haveAccessJoin) {
                $sql->columns('coalesce((' . $globalEditablePart .
                    ' OR x_access.writeable > 0), False) as iseditable');
                // False if no x_access entries joined
                $userFirmId = $user->getFirmId();
                if ($mapper->getFirmRestriction() == true) {
                    if (!$isAdmin) {
                        $sql->columns('(x_access.writeable = 0 and ' .
                            $firmTable . '.id_firm != ' . $userFirmId .
                            ') as isshared');
                    } else {
                        $sql->columns('(' . 'False' . ') as isshared');
                    }
                    $sql->columns('(' . $firmTable . '.id_firm != ' . $userFirmId .
                        ') as foreign');
                }
            } else {
                $sql->columns('(' . $globalEditablePart . ') as iseditable');
                $sql->columns('(' . 'False' . ') as isshared');
                // Additional info
                //$sql->columns('(' . 'False' . ') as share_type');
            }
        }
    }

    /**
     * Tests if user have read right on given instance
     * @param String $item instance type
     * @param Integer $id object id
     * @return Boolean
     */
    public static function checkGlobalRead($item, $user = false)
    {
        if (is_array($item)) {
            list($item, $user) = self::parseParams($item);
        }
        $user = self::checkUser($user);
        return self::innerCheckRead($item, false, $user);
    }

    /**
     * Tests if user have write right on given instance
     * @param String $item instance type
     * @param Integer $id object id
     * @return Boolean
     */
    public static function checkGlobalWrite($item, $user = false)
    {
        if (is_array($item)) {
            list($item, $user) = self::parseParams($item);
        }
        $user = self::checkUser($user);
        return self::innerCheckWrite($item, false, $user);
    }

    /**
     * Tests if user have write right on given instance or object
     * @param String $item instance type
     * @param Integer $id object id
     * @param Integer $user user id
     */
    public static function checkWrite($item, $id = false, $user = false)
    {
        if (is_array($item)) {
            list($item, $user, $id) = self::parseParams($item);
        }

        $user = self::checkUser($user);

        if (self::innerCheckWrite(self::SUPERADMIN_RIGHT, false, $user)) {
            return true;
        }

        $haveRight = self::innerCheckWrite($item, $id, $user);

        if (empty($haveRight)) {
            self::throwError();
        }
    }

    /**
     * Tests if user have write right on given instance or object
     * @param String $item instance type
     * @param Integer $id object id
     * @param Integer $user user id
     * @return Boolean
     */
    protected static function innerCheckWrite($item, $id, $user)
    {
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        $haveRight = self::checkGlobalRights($item, $user, self::ACCESS_WRITE);

        if ($haveRight && !empty($id)) {
            $haveRight = self::testFirmId($user, $item, $id);
        }

        if (empty($haveRight) && !empty($id)) {
            $where = [
                'id_user = ?' => $user,
                '"right" = ?' => $item,
                'writeable = ?' => 1,
                'id_object = ?' => $id,
                'status = ?' => Falcon_Record_X_Access::STATUS_ACTIVE
            ];

            $count = Falcon_Mapper_X_Access::getInstance()->getCount($where);

            $haveRight = $count > 0;
        }

        if (empty($haveRight) && !empty($id)) {
            $user = new Falcon_Record_X_User($user);
            $where = [
                'id_firm = ?' => $user->get('id_firm'),
                '"right" = ?' => $item,
                'writeable = ?' => 1,
                'id_object = ?' => $id,
                'status = ?' => Falcon_Record_X_Access::STATUS_ACTIVE
            ];

            $count = Falcon_Mapper_X_Access::getInstance()->getCount($where);

            $haveRight = $count > 0;
        }

        return $haveRight;
    }

    /**
     * Tests if user have create right on given instance
     * @param String $item instance type
     * @param Integer $user user id
     */
    public static function checkCreate($item, $user = false)
    {
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        if (is_array($item)) {
            list($item, $user) = self::parseParams($item);
        }
        $user = self::checkUser($user);
        if (self::haveAdminRight($user, self::ACCESS_CREATE)) {
            return true;
        }

        $haveRight = self::checkGlobalRights($item,
            $user, self::ACCESS_CREATE);

        if (empty($haveRight)) {
            self::throwError();
        }
    }

    /**
     * Tests if user have grant access right on given instance or object
     * @param String $item instance type
     * @param Integer $user user id
     */
    public static function checkGrant($item, $user = false)
    {
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        if (is_array($item)) {
            list($item, $user) = self::parseParams($item);
        }
        $user = self::checkUser($user);
        if (self::haveAdminRight($user, self::ACCESS_GRANT)) {
            return true;
        }

        $haveRight = self::checkGlobalRights($item,
            $user, self::ACCESS_GRANT);

        if (empty($haveRight)) {
            self::throwError();
        }
    }

    /**
     * Check if object is shared.
     * @param type $itemId
     * @param type $c Item's record
     * @param type $firmId
     */
    public static function isShared($alias, $c, $userId = null)
    {
        if (!$userId) {
            $user = Falcon_Model_User::getInstance();
            $userId = $user->getId();
        } else {
            $user = new Falcon_Model_User($userId);
        }
        $firmId = $user->getFirmId();
        $itemId = $c->getId();

        // If superadmin then shared is false
        if (Falcon_Access::haveAdminRight($userId)) {
            return false;
        }

        // If object belongs to user, shared is 0
        if ($firmId == $c->get('id_firm')) {
            return false;
        }

        $m = Falcon_Mapper_X_Access::getInstance();

        // Get actual x_access entries for user or his firm
        $records = $m->loadBy(
            function ($sql) use ($itemId, $alias, $userId, $firmId) {
                $sql
                    ->where('id_object = ?', $itemId)
                    ->where('"right" = ?', $alias)
                    ->where("id_user = $userId or id_firm = $firmId")
                    ->where('sdt <= current_timestamp')
                    ->where('edt > current_timestamp OR edt IS NULL')
                    ->where('status = ?', Falcon_Record_X_Access::STATUS_ACTIVE)
                    ->order('sdt asc');
            }
        );

        if (empty($records)) {
            return false;
        } else {
            foreach ($records as $record) {
                if (!isset($record['writeable'])) {
                    continue;
                }
                if ($record['writeable']) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Tests if object belongs to the same firm as user
     * @param Integer $user user id
     * @param String $item object type
     * @param Integer $id object id
     * @return Boolean
     */
    protected static function testFirmId($user, $item, $id)
    {
        $MAPPER_CLASS = 'Falcon_Mapper_' . ucwords_custom($item);
        $RECORD_CLASS = 'Falcon_Record_' . ucwords_custom($item);

        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->suppressNotFoundWarnings(true);
        $exists = class_exists($RECORD_CLASS) && class_exists($MAPPER_CLASS);
        $autoloader->suppressNotFoundWarnings(false);
        if (!$exists) {
            return true;
        }

        if (!$MAPPER_CLASS::getInstance()->getFirmRestriction()) {
            return true;
        }

        $record = new $RECORD_CLASS($id);
        $itemFirmId = method_exists($record, 'getIdFirm') ?
            $record->getIdFirm() :
            $record->get('id_firm');

        if (!$record->isLoaded()) {
            return false;
        }

        if (empty($itemFirmId)) {
            return true;
        }

        $user = new Falcon_Model_User($user);
        $userFirmId = $user->getFirmId();

        return $itemFirmId == $userFirmId;
    }

    /**
     * Gets user id for other function, if none given
     * @param int|bool $user
     * @return int
     */
    protected static function getUser($user = false)
    {
        if (empty($user)) {
            $user = Falcon_Model_User::getInstance()->getId();
        }

        return (int)$user;
    }

    /**
     * Corrects user, throws error on wrong
     * @param int|bool $user
     * @return int
     */
    protected static function checkUser($user = false)
    {
        $user = self::getUser($user);

        if ($user <= 0) {
            self::throwError();
        }

        return $user;
    }

    /**
     * Gets required service rights mask
     * @return Integer
     */
    public static function haveAdminRight($user, $right = self::ACCESS_READ)
    {
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        return self::checkGlobalRights(self::SUPERADMIN_RIGHT,
            $user, $right);
    }

    /**
     * Gets required service rights mask
     * @return Integer
     */
    protected static function getServiceAccessMask()
    {
        if (!defined('static::SERVICE_ACCESS')) {
            self::throwError();
        }

        return static::SERVICE_ACCESS;
    }

    /**
     * Tests, if user have global rights on given subject
     * @param String $item Access alias
     * @param Integer $user Users id
     * @param Integer $type Type of access
     * @return Boolean
     */
    protected static function checkGlobalRights($item, $user, $type)
    {
        if (!self::isRightCheckEnabled()) {
            return true;
        }

        $key = $item . '-' . $user . '-' . $type;

        if (!isset(self::$rightsCache[$key])) {
            self::$rightsCache[$key] = Falcon_Mapper_X_Right::getInstance()
                ->getUserRightServiceMask($item, $user, $type);
        }

        return (static::getServiceAccessMask() & self::$rightsCache[$key])
        == static::getServiceAccessMask();
    }

    /**
     * Throws 403 access error
     */
    protected static function throwError()
    {
        $debug = Zend_Registry::get('config')->debug;
        $params = [];
        if ($debug) {
            $debugData = debug_backtrace();
            $line = 0;
            while ($debugRow = array_shift($debugData)) {
                if (strpos($debugRow['class'], 'Falcon_Access') !== 0) {
                    $params = [
                        'class' => $debugRow['class'],
                        'line' => $line
                    ];
                    break;
                }
                $line = $debugRow['line'];
            }
        }
        throw new Falcon_Exception('',
            Falcon_Exception::ACCESS_VIOLATION, $params);
    }

    /**
     * Checks if right check is enabled
     * @return bool
     */
    public static function isRightCheckEnabled()
    {
        return Zend_Registry::isRegistered(self::$_rightCheckAlias) ?
            Zend_Registry::get(self::$_rightCheckAlias) : true;
    }

    /**
     * Sets the right check enabled flag
     */
    protected static function setRightCheckEnabled($enable = true)
    {
        Zend_Registry::set(self::$_rightCheckAlias, $enable);
    }

    /**
     * Enables global right check
     */
    public static function enableRightCheck()
    {
        self::setRightCheckEnabled(true);
    }

    /**
     * Disables global right check
     */
    public static function disableRightCheck()
    {
        self::setRightCheckEnabled(false);
    }

    /**
     * Flushes accumulated cache
     */
    public static function flushCache()
    {
        self::$rightsCache = [];
    }
}
