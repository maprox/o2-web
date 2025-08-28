<?php

/**
 * User
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2014, Maprox LLC
 */
class Falcon_Model_User extends Falcon_Model_Abstract
{
    const RANDOM_PASSWORD_LENGTH = 8;

    // sql-запросы
    protected $sqlUserCheck = 'select web_user_exists2(?) as id';
    protected $sqlKeyCheck = 'select web_key_exists(?) as id';
    protected $getMasterHash = 'select web_get_user_master_hash() as hash';
    protected $sqlReportsHistoryAdd = "insert into reports_history values(%s)";
    protected $sqlReportsHistoryGet = "select * from r_history_get(?)";
    protected $sqlResetAccessLevels = 'select u_reset_accesslevels_2(?) as code';
    protected $sqlAddAccessLevel = 'select u_add_accesslevel_2(?) as code';
    protected $sqlGetAccessLevels = 'select * from u_get_accesslevels_2(?)';
    protected $sqlGetPartnerAlias = 'select * from u_get_partner_alias(?)';

    protected $_auth;     // auth array
    protected $_called;   // была ли попытка аутентификации
    protected $_loggedIn; // результат аутентификации
    protected $passwordHash; // пароль

    /**
     * @param Falcon_Message []. Доступные пользователю объекты, ключ - тип объекта.
     */
    protected $webObjects = [];

    /**
     * Класс записи. Обязательно переопределить в наследнике класса.
     * @var {String}
     */
    protected $mapperClass = 'Falcon_Mapper_X_User';

    /**
     * Флаг миграции, отсутствие которого в базе обозначает, что надо пользоваться старыми функциями
     * Если не переопределен, в любом случае используются новые функции
     * @var {String}
     */
    protected $migrateFlag = 'x_user';

    static $_instance;    // текущий пользователь

    /**
     * Получение экземпляра объекта (Singleton)
     * @return {Zend_Controller_Front} this
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Set instance of current user
     * @param Falcon_Model_User $instance Instance of current user
     */
    public static function setInstance($instance)
    {
        self::$_instance = $instance;
    }

    /**
     * Уничтожение экземпляра объекта (Singleton)
     */
    public static function destroyInstance()
    {
        self::$_instance = null;
    }

    /**
     * Конструктор. Устанавливаем идентификатор объекта
     * @param {int} $id Идентификатор объекта
     * @param {Array} $auth Authentification array
     */
    public function __construct($id = -1, $auth = [])
    {
        parent::__construct($id);
        $this->initAuth($auth);
        if ($id < 0) {
            $this->checkIfAlreadyAuthorized();
        }
    }

    /**
     * Init auth array
     * @param Array $auth Auth array
     */
    public function initAuth($auth)
    {
        $this->_auth = $auth;
    }

    /**
     * Returns auth array
     * @return Array
     */
    public function getAuth()
    {
        return $this->_auth;
    }

    /**
     * Notifies user depending on his notification settings
     * @param {String} $noticeAlias
     * @param {Array} $params
     * @param {Integer} $userId
     */
    public function notify($noticeAlias, $params = [], $userId = null)
    {
        if (!$userId) {
            $user = $this;
            $userId = $this->getId();
        } else {
            $user = new Falcon_Model_User($userId);
        }

        // Get importance chosen by user
        $m = Falcon_Mapper_X_Notice::getInstance();
        $settings = $m->getUserSettings($userId, $noticeAlias);
        $idImportance = $settings[0]['id_importance'];

        // Don't notify user
        if (!$idImportance) {
            return;
        }

        // Load addresses with given importance
        $notificationSettings
            = $this->getNotificationSettings($idImportance);

        // noticeManager
        $noticeManager = Falcon_Manager_Notice_Factory::get($noticeAlias);
        foreach ($notificationSettings as $setting) {
            if ($setting['active']) {
                $setting['id_user'] = $userId;
                $noticeManager->send($setting, $params);
            }
        }
    }

    /**
     * Notifies user using given settings
     * @param type $noticeAlias
     * @param type $params
     * @param type $settings
     * @param type $userId
     */
    public function notifyBy($noticeAlias, $params = [],
                             $settings = [], $userId = null)
    {
        if (!$userId) {
            $user = $this;
            $userId = $this->getId();
        } else {
            $user = new Falcon_Model_User($userId);
        }

        // noticeManager
        $noticeManager = Falcon_Manager_Notice_Factory::get($noticeAlias);
        foreach ($settings as $setting) {
            $setting['id_user'] = $userId;
            $noticeManager->send($setting, $params);
        }
    }

    /**
     * Get notification settings
     * @param {Integer} $importance Return settings with given importance
     */
    public function getNotificationSettings($importance = null)
    {
        $userId = $this->getId();
        $m = Falcon_Mapper_X_Notification_Setting::getInstance();
        return $m->loadByUser($userId, $importance);
    }

    /**
     * Получаем информацию об объекте
     * @param {Boolean} $loadFields Загружать поля объекта
     * @return Falcon_Message
     */
    public function reload($loadFields = false)
    {
        $return = parent::reload($loadFields);

        foreach ($return as $prop) {
            if (!empty($prop['propname']) && $prop['propname'] == 'Password') {
                $this->passwordHash = $prop['propval'];
            }
        }

        return $return;
    }

    /**
     * Compares old password with new
     * @return Boolean
     */
    public function passwordSameAsOld($newPassword)
    {
        $salt = substr($this->passwordHash, 0, 8);
        return $this->passwordHash ==
        $salt . md5(md5($newPassword) . $salt);
    }

    /**
     * Returns auth parameter
     * @param String $value Parameter name
     * @return String
     */
    public function getAuthParam($value)
    {
        $auth = $this->getAuth();
        if (isset($auth[$value])) {
            return $auth[$value];
        }
        return null;
    }

    /**
     * Проверка может пользователь уже подключен
     */
    private function checkIfAlreadyAuthorized()
    {
        $auth = Zend_Auth::getInstance();
        if (!$auth->hasIdentity()) {
            return;
        }
        $storage = Zend_Auth::getInstance()->getIdentity();

        // проверим на наличие необходимых нам параметров
        if (!isset($storage['id']) || !array_key_exists('id_person', $storage)) {
            Zend_Auth::getInstance()->clearIdentity();
            die();
        }

        // если всё ок, получаем сохраненный сессией идентификатор пользователя
        $this->_id = $storage['id'];
        $this->_called = true;

        if ($this->isEnabled()) {
            $this->_loggedIn = true;
        }
    }

    /**
     * Изменение пароля пользователя
     * @param {String} $new_password Новый пароль
     * @param {String} $new_password_confirm Подтверждение нового пароля
     * @param {String} $old_password Старый пароль
     */
    public function changePassword($new_password, $new_password_confirm = null,
                                   $old_password = null)
    {
        $oldPw = $salt = null;
        if ($old_password !== null) {
            if ($this->get('password')) {
                $oldPw = $this->get('password');
                $salt = substr($oldPw, 0, 8);
            }
        }
        if ($old_password === null ||
            ($oldPw && $oldPw == $salt . md5(md5($old_password) . $salt))
        ) {
            if ($new_password_confirm === null ||
                $new_password == $new_password_confirm
            ) {
                $this->resetPassword($new_password);
                return new Falcon_Message();
            } else {
                $t = Zend_Registry::get('translator');
                $zt = $t['zt'];
                throw new Falcon_Exception(
                    $zt->translate("Password confirmation do not match"), 4044);
            }
        } else {
            $t = Zend_Registry::get('translator');
            $zt = $t['zt'];
            throw new Falcon_Exception(
                $zt->translate("Password is wrong"), 4045);
        }
    }

    /**
     * Аутентификация пользователя через БД
     * @return Boolean
     */
    public function isLoggedIn()
    {
        // если уже раз вызывался isLoggedIn
        // возвращаем старый результат
        if ($this->_called) {
            return $this->_loggedIn;
        }

        $config = Zend_Registry::get('config');
        if (isset($config->noauth) && $config->noauth) {
            $answer = $this->LoadQuery('select id from x_user where login = ?',
                [$this->getAuthParam('user')]);
        } else {
            $key = $this->getAuthParam('key');
            if ($key !== null) {
                $answer = $this->LoadQuery($this->sqlKeyCheck, [$key]);
            } else {
                $sql = $this->sqlUserCheck;
                $answer = $this->LoadQuery($sql, [
                    $this->getAuthParam('user'), // передаем введенные логин
                    $this->getAuthParam('hash'), // и пароль
                    null
                ]);
            }
        }

        // если была ошибка запроса - выходим
        if ($answer->isFailure()) {
            return false;
        }

        // запоминаем: была попытка аутентификации
        $this->_called = true;
        // проверим id пользователя
        $data = $answer->getData();
        $loginId = $data[0]['id'];
        if (!$loginId) {
            $answer->error(4040, $this->getAuthParam('user'));
            return false;
        } else {
            $this->_loggedIn = true;
            $this->_id = $loginId;
            return true;
        }
    }

    /**
     * Returns firm language id
     * @return int
     */
    public function getLangId()
    {
        return $this->getRecord()->get('id_lang');
    }

    /**
     * Returns lang alias for this firm settings (like ru, en, etc.)
     * @return string
     */
    public function getLang()
    {
        $langId = $this->getLangId();
        $lang = Falcon_Mapper_X_Lang::getInstance()->loadRecord($langId);
        return $lang ? $lang->get('name') : null;
    }

    /**
     * Returns locale from this firm settings (like ru_RU, en_GB, etc.)
     * @return string
     */
    public function getLocale()
    {
        $langId = $this->getLangId();
        $lang = Falcon_Mapper_X_Lang::getInstance()->loadRecord($langId);
        return $lang ? $lang->get('locale') : null;
    }

    /**
     * Returns string with user contacts
     * @return String
     */
    public function getContactStr()
    {
        $contactStr = '';
        $contactStr .= $this->get('shortname');
        if ($this->getEmail()) {
            $contactStr .= ' <' . $this->getEmail()
                . '>';
        }

        $person = $this->get('person');
        if (isset($person['phone'])) {
            foreach ($person['phone'] as $phone) {
                $contactStr .= ', ' . $phone['number'];
            }
        }

        return $contactStr;
    }

    /**
     * Возвращаем список модулей пользователя
     * @param {String} $location - "index" or "admin", all if empty
     * @return Array
     */
    public function getModules($location = false)
    {
        Falcon_Cacher::getInstance()->clean();

        $logger = Falcon_Logger::getInstance();
        $firm = new Falcon_Model_Firm($this->getFirmId());
        $modules = $firm->getModules();

        // let's filter modules by user rights
        $result = [];
        foreach ($modules as $module) {
            if ($this->hasRight((int)$module['id_right'])) {
                // If firm have unpaid account
                // display only billing module
                if ($firm->get('have_unpaid_account')) {
                    if ($module['identifier'] == 'act_billing') {
                        $result[] = $module;
                        break;
                    }
                    continue;
                }

                $result[] = $module;
            }
        }
        $modules = $result;

        // check modules for different locations
        $locations = [
            'index' => 1,
            'admin' => 2
        ];
        $locationId = isset($locations[$location]) ?
            $locations[$location] : null;

        if ($locationId) {
            $result = [];
            foreach ($modules as $module) {
                if ($module['location'] == $locationId) {
                    $result[] = $module;
                }
            }
            $modules = $result;
        }

        /*
        $actions = Falcon_Mapper_X_Module::getInstance()
            ->loadForUser($this->getId(), $location);

        $firmId = $this->getFirmId();
        if ($firmId > 0)
        {
            $firm = new Falcon_Model_Firm($firmId);

            if ($firm->get('HaveUnpaidAccount'))
            {
                $modules = $firm->listModuleIds(true);
                $panel = $this->getPanel();

                foreach ($actions as $key => $action)
                {
                    if (!in_array($action['id_right'], $modules) &&
                        // Право на биллинг в админке - оно почти как право на голос
                        // @TODO сделать по-новому, сейчас не делает ничего
                        ($action['id_right'] != 165354 || $panel != 2))
                    {
                        unset($actions[$key]);
                    }
                }
            }
        }
        */
        return $modules;
    }

    /**
     * Возвращает список прав пользователя
     * @return Array
     */
    public function getRights()
    {
        if (!isset($this->_cache['userrights'])) {
            $this->_cache['userrights'] = Falcon_Mapper_X_Right::getInstance()
                ->getUserRights($this->getId());
        }
        return $this->_cache['userrights'];
    }

    /**
     * Функция проверки наличия у пользователя права
     * @param {Number|String} $rightId Идентификатор права
     * @return Boolean
     */
    public function hasRight($rightId)
    {
        foreach ($this->getRights() as $right) {
            // loop through the list of user's rights
            if (is_string($rightId)) {
                if ($right['alias'] == $rightId) {
                    return true;
                }
            } else {
                if ($right['id'] == $rightId) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Возвращает страницу из списка событий за период
     * @param {object} $params запрос
     * @return Falcon_Message
     */
    public function getEvents($params, $ids)
    {
        $data = Falcon_Mapper_Ev_All::getInstance()->loadEvents($ids,
            $params['begin'], $params['end'], $params['page'], $params['limit'],
            $params['sort']->property, $params['sort']->direction);

        return new Falcon_Message($data);
    }

    /**
     * Возвращает страницу из списка событий для конкретного устройства
     * @param {object} $params запрос
     * @return Falcon_Message
     */
    public function getDeviceEvents($params)
    {
        $data = Falcon_Mapper_Ev_All::getInstance()->loadEvents(
            ['devices' => [$params['objId']]],
            $params['begin'], $params['end'], $params['page'], $params['limit'],
            $params['sort']->property, $params['sort']->direction);

        return new Falcon_Message($data);
    }

    /**
     * Возвращает количество событий за период
     * @param {object} $params запрос
     * @return Falcon_Message
     */
    public function getEventsCount($params, $ids)
    {
        $data = Falcon_Mapper_Ev_All::getInstance()->countEvents($ids,
            $params['begin'], $params['end'], true);

        return new Falcon_Message($data);
    }

    /**
     * Возвращает количество событий за период для конкретного устройства
     * @param {object} $params запрос
     * @return Falcon_Message
     */
    public function getDeviceEventsCount($params)
    {
        $data = Falcon_Mapper_Ev_All::getInstance()->countEvents(
            ['devices' => [$params['objId']]],
            $params['begin'], $params['end']);

        return new Falcon_Message($data);
    }

    /**
     * Возвращает список настроек пользователя
     * ввиде массива "параметр" = "значение"
     * @return Array
     */
    public function getSettings()
    {
        if (isset($this->_cache['settings'])) {
            return $this->_cache['settings'];
        }
        $s = new Falcon_Action_Settings();
        $answer = $s->loadForUser($this->getId());
        if ($answer->isFailure()) {
            Falcon_Logger::getInstance()->log('error',
                'Falcon_Model_User::getSettings() error',
                $answer);
            return null;
        }
        $this->_cache['settings'] = $s->toArray($answer->getData());
        return $this->_cache['settings'];
    }

    /**
     * Login event for current user
     * @param {String} $sessionId [opt.] Identifier of session
     */
    public function eventLogin($sessionId = null)
    {
        if ($sessionId == null) {
            Zend_Session::regenerateId();
            $sessionId = Zend_Session::getId();
        }

        $this->setField('Session', $sessionId);
        //$this->setField('Last_Ip', $_SERVER['REMOTE_ADDR']);

        $params = [
            'session' => $sessionId,
            'ip' => $_SERVER['REMOTE_ADDR']
        ];

        $eventValue = json_encode($params);

        $this->event('Login', $eventValue);
    }

    /**
     * Open browser event for current user
     */
    public function eventOpenBrowser()
    {
        $params = [
            'ip' => $_SERVER['REMOTE_ADDR'],
            'login' => $this->get('login')
        ];

        $person = (array)$this->get('person');

        if (!empty($person['firstname'])) {
            $params['firstname'] = $person['firstname'];
        }

        if (!empty($person['lastname'])) {
            $params['lastname'] = $person['lastname'];
        }

        $eventValue = json_encode($params);
        $this->event('OpenBrowser', $eventValue);
    }

    /**
     * Close browser event for current user
     */
    public function eventCloseBrowser()
    {

        $params = [
            'ip' => $_SERVER['REMOTE_ADDR'],
            'login' => $this->get('login')
        ];

        $person = (array)$this->get('person');

        if (!empty($person['firstname'])) {
            $params['firstname'] = $person['firstname'];
        }

        if (!empty($person['lastname'])) {
            $params['lastname'] = $person['lastname'];
        }

        $eventValue = json_encode($params);

        $m = Falcon_Mapper_X_User::getInstance();
        $dt = $m->dbDate('-'
            . Zend_Registry::get('config')->session->maxInactiveTime
            . 'sec');

        $this->event('CloseBrowser', $eventValue, $dt);
    }

    /**
     * Logout event for current user
     */
    public function eventLogout()
    {
        $this->event('Logout');
    }

    /**
     * Do not check for unique session
     * @return bool
     */
    public function needUniqueSession()
    {
        return !in_array($this->get('login'), Zend_Registry::get('config')->
        multipleInstancesAllowed->login->toArray());
    }

    /**
     * Compares hash with master hash
     * @param string $hash
     * @return bool
     */
    public function isMasterHash($hash)
    {
        $answer = $this->LoadQuery($this->getMasterHash);
        return $answer->getCell() == $hash;
    }

    /**
     * Creates new user object
     * @param type $name
     * @param type $parentId
     * @return Falcon_Message
     * @deprecated
     */
    public function createPending($name, $firmId = null)
    {
        // insert new user object for backward compatibility
        /*$user = new Falcon_Record_Obj(array(
            'name' => $name,
            'id_class' => 7,
            'id_parent' => $firmId
        ));
        $user->insert();*/
        // Create x_user record
        $record = new Falcon_Record_X_User();
        $this->record = $record;

        // schedule create
        $schedule = new Falcon_Record_X_Schedule();
        $scheduleId = $schedule->insert()->getId();
        $this->setField('Schedule', $scheduleId);
        $record->set('id_schedule', $scheduleId);

        // set id_firm
        $record->set('id_firm', $firmId);
        $record->insert();

        $this->_id = $record->getId();
        $this->_firmId = $firmId;

        return new Falcon_Message();
    }

    public function reportsHistoryAdd($request)
    {
        $reportId = $request->id;
        $firmId = $this->getFirmId();
        $name = addslashes($this->get('login'));
        $params = [];
        foreach ($request->params as $key => $value) {
            if ($key == 'loginid')
                continue;
            if ($key == 'device')
                foreach ($value as &$val)
                    $val = $this->getNameById($val);
            $params[$key] = $value;
        }
        $params = base64_encode(json_encode($params));
        $set = "'{$firmId}', '{$reportId}', current_timestamp, '{$name}',
				'{$params}'";
        $sql = sprintf($this->sqlReportsHistoryAdd, $set);
        $answer = $this->LoadQuery($sql, []);
        return $answer;
    }

    /**
     * Getting a report history for user
     * @param int $reportId Identifier of a report
     * @return Falcon_Message
     */
    public function reportsHistoryGet($reportId)
    {
        return $this->LoadQuery($this->sqlReportsHistoryGet, [
            $this->getFirmId(), $reportId]);
    }

    /**
     * Получение массива идентификаторов уровней доступа
     * @return Falcon_Message
     */
    public function getAccessLevels()
    {
        return $this->LoadQuery($this->sqlGetAccessLevels,
            [$this->getId()]);
    }

    /**
     * Задать уровни доступа
     * @param Integer[] Массив идентификаторов уровней доступа
     * @return Falcon_Message
     */
    public function setAccessLevels($accessLevels)
    {
        $answer = new Falcon_Message();
        if (!is_array($accessLevels) && !is_object($accessLevels))
            return $answer->error(4042);
        $answer->append($this->LoadQuery($this->sqlResetAccessLevels,
            [$this->getId()]));
        if ($answer->isSuccess()) {
            foreach ($accessLevels as $al) {
                $answer->append($this->LoadQuery($this->sqlAddAccessLevel,
                    [$this->getId(), $al]));
            }
        }
        return $answer;
    }

    /**
     * Date period correction
     * TODO Move it out from Falcon_Model_User
     * @param stdClass $period
     * @param bool $to_utc
     */
    public function correctPeriod(&$period, $to_utc = true)
    {
        $period->begin = $this->correctDate($period->begin, $to_utc);
        $period->end = $this->correctDate($period->end, $to_utc);
    }

    /**
     * Corrects date according to user utc setting
     * @param date $dt
     * @param bool $to_utc
     * @param string $format
     * @return date
     */
    public function correctDate($dt, $to_utc = true, $format = null)
    {
        $s = $this->getSettings();
        $utc = $s['p.utc_value'];

        if ($to_utc) {
            $utc = (substr($utc, 1) == "-") ? substr($utc, 1) : "-" . $utc;
        }

        $dt = preg_replace('/\+.*$/ui', '', $dt);
        if (!$format) {
            $f = 'Y-m-d H:i:s';
        } else {
            $f = $format;
        }
        return date($f, strtotime($utc, strtotime($dt)));
    }

    /**
     * Generates random password
     * @return String
     */
    public function getRandomPassword()
    {
        $characters =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ';
        $string = '';
        for ($p = 0; $p < self::RANDOM_PASSWORD_LENGTH; $p++) {
            $string .= $characters[mt_rand(0, strlen($characters) - 1)];
        }
        return $string;
    }

    /**
     * Generates login
     * @return String
     */
    public function generateLogin()
    {
        $name = $this->get('firstname');
        $lastname = $this->get('lastname');
        $login = $lastname . ' ' . $name;

        $login = strtr($login, [
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e',
            'ж' => 'g', 'з' => 'z', 'и' => 'i', 'й' => 'y', 'к' => 'k', 'л' => 'l',
            'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's',
            'т' => 't', 'у' => 'u', 'ф' => 'f', 'ы' => 'i', 'э' => 'e',
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E',
            'Ж' => 'G', 'З' => 'Z', 'И' => 'I', 'Й' => 'Y', 'К' => 'K', 'Л' => 'L',
            'М' => 'M', 'Н' => 'N', 'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S',
            'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Ы' => 'I', 'Э' => 'E', 'ё' => 'yo',
            'х' => 'h', 'ц' => 'ts', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'shch',
            'ъ' => '', 'ь' => '', 'ю' => 'yu', 'я' => 'ya', 'Ё' => 'YO', 'Х' => 'H',
            'Ц' => 'TS', 'Ч' => 'CH', 'Ш' => 'SH', 'Щ' => 'SHCH',
            'Ъ' => '', 'Ь' => '', 'Ю' => 'YU', 'Я' => 'YA']);

        $login = preg_replace('/[^a-z\d]/ui', '_', trim($login));
        $baseLogin = $login;
        $counter = 0;

        while ($this->loginExists($login) && $counter < 100) {
            $login = $baseLogin . ++$counter;
        }

        return $login;
    }

    /**
     * Returns true if login already exists
     * @param string $login
     * @return boolean
     */
    public function loginExists($login)
    {
        $records = Falcon_Mapper_X_User::getInstance()
            ->loadBy(function ($sql) use ($login) {
                $sql->where('login = ?', $login);
            });
        return !empty($records);
    }

    /**
     * Returns session keys
     * @return {String[]}
     */
    public function getSessionKeys()
    {
        $records = Falcon_Mapper_Session::getInstance()->load(
            ['id_user = ?' => $this->getId(), 'terminated = ?' => 0]);

        $ids = [];
        foreach ($records as $record) {
            $ids[] = trim($record->getId());
        }

        return $ids;
    }

    /**
     * Returns user email
     * @return {String}
     */
    public function getEmail()
    {
        $return = '';

        $person = (array)$this->get('person');

        if (empty($person['email'])) {
            return $return;
        }

        foreach ($person['email'] as $email) {
            if (empty($return) || $email['isprimary']) {
                $return = $email['address'];
            }
        }

        return $return;
    }

    /**
     * Возвращает значение поля $field
     * @param {String} $field Имя поля
     * @return {Mixed} Значение поля
     */
    public function get($field)
    {
        if ($field == 'name') {
            return $this->get('login');
        }

        if ($field == 'firstname' ||
            $field == 'lastname' ||
            $field == 'secondname'
        ) {
            $person = (array)$this->get('person');
            return empty($person[$field]) ? '' : $person[$field];
        }

        return parent::get($field);
    }

    /**
     * Смена названия объекта
     * @param {String} $name Имя объекта
     * @param {Boolean} $doUpd Нужно ли заносить информацию об обновлении
     * @return Falcon_Message
     */
    public function rename($name, $doUpd = true)
    {
        $this->set('login', $name);
    }

    /**
     * Получение идентификатора фирмы объекта
     */
    public function getFirmId()
    {
        if ($this->getId() <= 0) {
            return 0;
        }
        return (isset($this->_firmId)) ?
            $this->_firmId : $this->get('id_firm');
    }

    /*
     * Returns restore link
     * @return {String} Restore link
     */
    public function getRestoreLink()
    {
        return getProtocol() . '://' .
        $_SERVER['HTTP_HOST'] . '/auth/reset/?r=' . $this->get('password');
    }

    /**
     * Reset password
     * @return {String}
     */
    public function resetPassword($password = null)
    {
        $newpassword = false;
        $salt = false;
        $this->genPw($newpassword, $salt);
        if (!$password) {
            $password = $newpassword;
        }
        $this->set('password', $salt . md5(md5($password) . $salt));
        return $password;
    }

    /**
     * Returns true if this user is demo
     */
    public function isDemo()
    {
        return ($this->get('login') == 'demo');
    }

    /**
     * Returns partner alias if user is allocated to partner
     *
     * @return string
     */
    public function getPartnerAlias()
    {
        $answer = $this->LoadQuery($this->sqlGetPartnerAlias,
            [$this->getId()]);
        return $answer->isSuccess() ? $answer->getCell() : '';
    }
}
