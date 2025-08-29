<?php

/**
 * Base action controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Action extends Falcon_Controller_Action_Abstract
{
    /**
     * @const {integer} Секунд для предупреждения
     */
    const TIMELEFT = 300; // 5 мин

    /*
     * Массив хранения данных о текущем пользователе
     * @var {Array}
     */
    protected $_user;

    /**
     * Нужна ли проверка товарища по ip
     * @var {Boolean}
     */
    protected $_ipCheck = false;

    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     * @var {Boolean}
     */
    protected $_skipAccessCheck = false;

    /**
     * Массив имен экшенов контроллера, где нет необходимости
     * авторизации пользователя
     * @var {Array}
     */
    protected $_noCheckActions = [];

    /**
     * Алиас класса
     * @var {String}
     */
    protected $_classAlias;

    /**
     * Disable layout
     * @var {Boolean}
     */
    protected $_disableLayout = false;

    /**
     * Default output format.
     * Currently supported: json
     * @var string
     */
    protected $_defaultOutputFormat = 'json';

    /**
     * Controller initialization
     */
    public function init()
    {
        $config = Zend_Registry::get('config');

        $session = new Zend_Session_Namespace('Zend_Auth'); // объект сессии
        $this->_user = $session->storage; // вытягиваем данные о пользователе
        // проверяем, если не используется AJAX, то передаем данные во View
        $request = $this->getRequest();
        if (
            is_callable($request, 'isXmlHttpRequest')
            && !$request->isXmlHttpRequest()
        ) {
            // Инициализация представления
            $this->initView();
            $this->view->user = $this->_user;
        }

        $static = $config->resources->static;
        $this->view->static = $static;

        if ($this->_disableLayout) {
            $this->_helper->layout()->disableLayout();
            $this->_helper->viewRenderer->setNoRender(true);
        }

        $this->_setParam('format', $this->_getParam('format',
            $this->_defaultOutputFormat));
    }

    /**
     * Terminates current session
     * @param array $params
     * @param int $code
     */
    private function sessionTerminate($code = 0, $params = [])
    {
        Zend_Auth::getInstance()->clearIdentity();
        Zend_Session::expireSessionCookie();
        Zend_Session::forgetMe();

        // Check if AJAX is used
        if ($this->getRequest()->isXmlHttpRequest()) {
            $a = new Falcon_Message();
            if (!empty($params)) {
                /*foreach ($params as $param => $value) {
                    $a->addParam($param, $value);
                }*/
                $a->addParam('sessionData', $params);
            }
            $ans = $a->error($code);
            $this->sendAnswer($ans);
            $this->getResponse()->sendHeaders();
            die();
        } else {
            /*
             * COMMENTED. Because is not working anyway
                $url = urlencode($_SERVER['REQUEST_URI']);
                $r = $code && ($code !== 3) ? "r={$code}&" : '';
                $this->_redirect('auth/?'.$r.'url='.$url);
            */
            $this->_redirect('/auth/');
        }
    }

    /**
     * Проверка авторизации пользователя и необходимости кеширования
     */
    public function preDispatch()
    {
        // объект запроса к серверу
        $request = $this->getRequest();
        $controllerName = $request->getControllerName();
        $actionName = $request->getActionName();

        if ($this->_ipCheck) {
            $this->performIpCheck($request, $controllerName, $actionName);
        }

        // проверим, может нет нужды в авторизации
        $auth = Zend_Auth::getInstance();
        if ($this->_skipAccessCheck
            || in_array($actionName, $this->_noCheckActions)
        ) {
            if (!$auth->hasIdentity()) {
                $answer = Falcon_Auth_Adapter::checkAuthData($this);
                $data = $answer->getParam('data');
                if (isset($data['key'])) {
                    $this->createSingleSession($auth);
                } else if (!isset($data['user'])) {
                    return;
                }
            } else {
                return;
            }
        }

        if (!$this->checkForCredentials($auth)) {
            if (!$auth->hasIdentity()) {
                return $this->sessionTerminate(Falcon_Exception::UNATHORIZED);
            }
        }

        // current session check
        $user = Falcon_Model_User::getInstance();
        $session = new Falcon_Record_Session([
            'id' => Zend_Session::getId()
        ]);

        if ($session->isTerminated()) {
            $userId = $user->getId();
            $m = Falcon_Mapper_Ev_All::getInstance();
            $lastEvent = $m->loadBy(function ($sql) use ($userId) {
                $sql->where('id_event = ?', 18)
                    ->where('id_obj = ?', $userId)
                    ->order('dt desc')
                    ->limit(1);
            });
            $lastEvent = (array)$lastEvent[0];
            $params = json_decode($lastEvent['val'], true);
            $dt = strtotime($lastEvent['dt']);
            $params['dt'] = date(DB_DATE_FORMAT, $dt);
            return $this->sessionTerminate(
                Falcon_Exception::MULTIPLE_AUTHORIZATION, $params);
        }

        // Проверка расписания доступа
        $sheduleId = $user->get('id_schedule');
        if ($sheduleId) {
            $schedule = new Falcon_Record_X_Schedule($sheduleId);
            $nextTime = $schedule->nextTime();
            if (!$schedule->according()) {
                $params = [];
                $params['nexttime'] = $nextTime;
                return $this->sessionTerminate(
                    Falcon_Exception::SCHEDULE_LIMIT, $params);
            }
            if ($schedule) {
                // check schedule time left
                $timeleft = $schedule->timeleft();
                if ($timeleft > 0 && $timeleft <= self::TIMELEFT) {
                    $this->_timeleft = $timeleft;
                }
            }
        }
    }

    /**
     * Dispatch the requested action
     *
     * @param string $action Method name of action
     * @return void
     */
    public function dispatch($action)
    {
        try {
            parent::dispatch($action);
        } catch (Falcon_Exception $e) {
            $message = $e->getMessage(); // получение текста ошибки
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $message
            ]);
            if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                $answer = new Falcon_Message();
                $answer->error($e->getCode(), $e->getParams());
                $this->sendAnswer($answer);
            } else {
                throw $e;
            }
        }
    }

    /**
     * Проверка товарища по ip, согласно конфигу
     * @param {Zend_Controller_Request_Http} $request
     * @param {String} $controllerName - имя контроллера
     * @param {String} $actionName - имя экшена
     */
    protected function performIpCheck($request, $controllerName, $actionName)
    {
        $config = Zend_Registry::get('config');
        $config = $config->allowedIp->$controllerName;

        // Если не заполнена секция контроллера - проверять не надо
        if (empty($config)) {
            return;
        }

        $config = $config->$actionName;

        // Если не заданы айпи для экшена - проверять не надо
        if (empty($config)) {
            return;
        }

        $allowed = $config->toArray();

        // Если айпи не совпадает - шмерть
        $ip = $request->getClientIp(false);
        if (!in_array($ip, $allowed)) {
            Falcon_Logger::getInstance()->log('access',
                'Access from [' . $ip . '] to private controller ' .
                $controllerName . '::' . $actionName);
            die;
        }
    }

    /**
     * Поиск идентификационных данных в запросе
     * @param {Zend_Auth} $auth
     * @return Boolean
     */
    public function createSingleSession($auth)
    {
        $answer = Falcon_Auth_Adapter::checkAuthData($this);
        if ($answer->isFailure()) {
            return false;
        }

        // try to log in
        $authAdapter = new Falcon_Auth_Adapter($answer->getData());
        $authResult = $auth->authenticate($authAdapter);

        if ($authResult->isValid()) {
            //$auth->getStorage()->write($authAdapter->getDataForStorage());
        }
        return true;
    }

    /**
     * Поиск идентификационных данных в запросе
     * @param {Zend_Auth} $auth
     * @return Boolean
     */
    public function checkForCredentials($auth)
    {
        $answer = Falcon_Auth_Adapter::checkAuthData($this);
        if ($answer->isFailure()) {
            return false;
        }

        // если есть, пробуем авторизироваться
        // Для начала разлогинимся из того, что уже есть
        Falcon_Model_User::getInstance()->eventLogout();
        Falcon_Model_User::destroyInstance();
        Zend_Auth::getInstance()->clearIdentity();

        // Теперь пробуем войти
        $authAdapter = new Falcon_Auth_Adapter($answer->getData());
        $authResult = $auth->authenticate($authAdapter);
        $answer = new Falcon_Message(null, $authResult->isValid());

        if ($answer->isFailure()) {
            if ($this->_request->isPost()) {
                $answer->error(4041, $authResult->getMessages());
                $answer->delParam('data');
                $this->sendAnswer($answer);
            } else {
                $error = $authResult->getMessages();
                $error = current($error);
                $this->_redirect('/auth/?r=' . $error['code']);
            }
        } else {
            // Записываем в хранилище данные пользователя
            $auth->getStorage()->write($authAdapter->getDataForStorage());
        }
        return true;
    }

    /**
     * Получение алиаса класса
     * @param {Boolean} $lowercase Алиас со строчной буквы
     * @return {String} Алиас
     */
    public function getClassAlias($lowercase = false)
    {
        if ($this->_classAlias === null) {
            // 'ObjectsController' >>> 'Objects'
            $this->_classAlias = substr(get_class($this), 0, -10);
        }
        return $lowercase
            ? strtolower($this->_classAlias) : $this->_classAlias;
    }

    /**
     * load
     * Загрузка записей
     */
    public function loadAction()
    {
        $this->sendAnswer($this->get());
    }

    /**
     * Получение записей
     * @return {Falcon_Message}
     */
    public function get()
    {
        $answer = new Falcon_Message();
        $method = 'load' . str_replace('_', '', $this->getClassAlias());
        $m = new Falcon_Model_Manager();
        return method_exists($m, $method)
            ? $m->$method() : $answer->error(404);
    }

    /**
     * Get decoded requested data
     * @return Object
     */
    protected function getJsonData()
    {
        $dataParam = $this->_getParam('data');
        if (is_string($dataParam)) {
            $data = json_decode($this->_getParam('data'));
        }
        if (!$data) {
            $data = (object)$this->getRequest()->getParam('data');
        }
        return $data;
    }

    /**
     * Fetches user data in convenient format
     * @return Array
     */
    protected function getUserData()
    {
        return Falcon_Model_User::getInstance()->getRecord()->toArray();
    }

    /**
     * Get current user's firm identifier
     * @return Array
     */
    protected function getUserFirmId()
    {
        return Falcon_Model_User::getInstance()->getFirmId();
    }

    /**
     * Returns sort params
     * @return array
     */
    protected function getOrderParams()
    {
        $orderBy = [];
        $orderParam = json_decode($this->_getParam('sort'));
        if ($orderParam && is_array($orderParam)) {
            foreach ($orderParam as $s) {
                $o = new stdClass();
                $o->property = isset($s->property) ? $s->property : 'dt';
                $o->direction = isset($s->direction) ? $s->direction : 'ASC';
                $orderBy[] = $o;
            }
        }
        return $orderBy;
    }

    /**
     * Returns page params
     * @param int $defStart Default start value (0 by default)
     * @param int $defCount Default count value (25 by default)
     * @return array
     */
    protected function getPageParams($defStart = 0, $defCount = 25)
    {
        if ($this->_getParam('start', '') .
            $this->_getParam('limit', '') === ''
        ) {
            return [];
        }
        $start = (int)json_decode($this->_getParam('start', $defStart));
        $count = (int)json_decode($this->_getParam('limit', $defCount));
        return [
            'start' => $start,
            'count' => $count
        ];
    }

    /**
     * Returns an array of page and order parameters
     * @return array
     */
    protected function getPageAndOrderParams()
    {
        $result = [];
        $order = $this->getOrderParams();
        if (count($order) > 0) {
            $result['order'] = $order;
        }
        $page = $this->getPageParams();
        if (count($page) > 0) {
            $result['page'] = $page;
        }
        return $result;
    }

    /**
     * Return request params array
     * @return array
     */
    public function getParams()
    {
        return $this->getRequest()->getParams();
    }

    /**
     * Returns value for param trying get it from all aliases
     * @param array $aliases Aliases of params
     * @param bool $trim True [default] to trim result value
     * @return Mixed
     */
    protected function getParamByAlias($aliases, $trim = true)
    {
        foreach ($aliases as $alias) {
            $value = $this->_getParam($alias);
            if ($value != null) {
                return $trim ? trim($value) : $value;
            }
        }
    }

    /**
     * Returns a json formatted output
     * @param {Falcon_Message} $answer Answer object
     */
    public function sendAnswer($answer = null)
    {
        if ($answer === null) {
            $answer = new Falcon_Message();
        }
        if (!($answer instanceof Falcon_Message)) {
            throw new Exception('Incorrect answer object.' .
                'Falcon_Controller_Action::sendAnswer()');
        }
        $debug = Zend_Registry::get('config')->debug;
        if ($debug) {
            $answer->addParam('profiler', $this->getDBProfilerData());
        }
        if (isset($this->_timeleft) && $this->_timeleft) {
            $answer->addParam('timeleft', $this->_timeleft);
        }
        //
        if ($answer->isFailure()) {
            // let's write this error to log
            $logger = Falcon_Logger::getInstance();
            $logger->log('answer_error', [
                'answer' => $answer->toArray()
            ]);
            // Try to get error code from Falcon_Message error array
            $error = $answer->getLastError();
            $code = isset($error['code']) ? $error['code'] : 500;
            if ($code > 400 && $code < 600) {
                $this->getResponse()->setHttpResponseCode($code);
            }
            if ($code === Falcon_Exception::MULTIPLE_AUTHORIZATION ||
                $code === Falcon_Exception::SCHEDULE_LIMIT
            ) {
                $this->getResponse()->setHttpResponseCode(401);
            }
        }
        // return in format as specified
        $format = $this->getParam('format');
        $factory = Falcon_Message_View_Factory::getInstance();
        $factory->sendMessage($answer, $format);
    }

    /**
     * Returns a string formatted output
     * @param {Falcon_Message} $answer Answer object
     */
    public function sendAnswerPipe($answer = null)
    {
        if ($answer === null) {
            die();
        }
        if (!($answer instanceof Falcon_Message_Pipe)) {
            die();
            //throw new Exception('Incorrect answer object.'.
            //	'Falcon_Controller_Action::sendAnswerPipe()');
        }
        ob_clean();
        echo $answer->getCommand();
        die();
    }

    /**
     * Returns filename headers for HTTP response
     * @param string $filename
     * @param string $username
     */
    public static function getFilenameHeader($filename = 'download.dat',
                                             $useragent = '')
    {
        $filenameHeader = 'filename="' . rawurlencode($filename) . '"';
        if (strpos(strtolower($useragent), 'firefox')) {
            $filenameHeader = 'filename*="utf8\'\'' .
                rawurlencode($filename) . '"';
        }
        if (strpos(strtolower($useragent), 'safari')) {
            $filenameHeader = 'filename="' . $filename . '"';
        }
        return $filenameHeader;
    }
}
