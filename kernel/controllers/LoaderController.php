<?php

/**
 * Класс работы с устройствами в режиме AJAX
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class LoaderController extends Falcon_Controller_Action
{
    /**
     * Maximum difference between lastload and current time
     * @var Integer lastLoadLimit Seconds
     */
    private $lastLoadLimit = 1200; // 20 minutes

    /**
     * /loader (version 2)
     * @return type
     * @deprecated
     */
    public function indexAction()
    {
        // Next lastload
        $strFormat = 'Y-m-d H:i:s.u';
        $nextLastload = date($strFormat);

        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();

        // Check if session has been changed
        // Send refresh param
        $lastsession = $this->_getParam('lastsession');

        // Get page
        $referer = $this->getRequest()->getHeader('referer');
        $parts = explode($this->getRequest()->getHeader('host'), $referer);
        $path = $parts[1];
        $pathParts = explode('?', $path);
        $page = 'page_' . $pathParts[0];

        // Get proxies form session
        $session = new Zend_Session_Namespace('Loader');
        $proxies = $session->proxies;
        if (empty($proxies[$page])) {
            $proxies = [];
        } else {
            $proxies = $session->proxies[$page];
        }

        if (!empty($lastsession) &&
            !in_array($lastsession, $user->getSessionKeys())
        ) {
            $answer = new Falcon_Message();
            $answer->addParam('refresh', true);
            return $this->sendAnswer($answer);
        }

        $f = new Zend_Filter_StripTags();
        $lastload = $f->filter($this->_getParam('lastload'));

        $sdt = $lastload;
        $edt = null;
        // If lastload too old, let's count $edt
        if ($lastload) {
            if ((time() - strtotime($lastload)) > $this->lastLoadLimit) {
                $strFormat = 'Y-m-d H:i:s.u';
                $edt = date(
                    $strFormat,
                    (strtotime($lastload) + $this->lastLoadLimit)
                );
            }
        }

        // If edt is null set edt to current date
        if ($edt == null) {
            $edt = $nextLastload;
        }

        // If loader is first
        $firstLoader = false;
        if (!$sdt) {
            $firstLoader = true;
            $sdt = $nextLastload;
        }

        $m = new Falcon_Model_Manager();
        // Set proxies
        $m->setProxies($proxies);

        $proxyAliases = [];
        foreach ($proxies as $proxy) {
            $proxyAliases[] = $proxy['id'];
        }

        // Get updates
        $mu = Falcon_Mapper_Updates::getInstance();
        $updates = $mu->getUpdates($sdt, $edt, $proxyAliases);

        // Preparing for mass loading of data
        // Group by alias
        $needLoad = [];
        foreach ($updates as $update) {
            // Get only updates with id_entity
            if (!$update['id_entity']) {
                continue;
            }

            if (!isset($needLoad[$update['alias']])) {
                $needLoad[$update['alias']] = [];
            }

            // Get not deleted type updates only
            if (in_array($update['id_operation'], [
                Falcon_Record_X_History::OPERATION_CREATE,
                Falcon_Record_X_History::OPERATION_RESTORE,
                Falcon_Record_X_History::OPERATION_EDIT
            ])) {
                $needLoad[$update['alias']][] = $update['id_entity'];
            }
        }

        // Mass load data
        $dataCache = [];
        foreach ($needLoad as $alias => $ids) {
            if (!isset($dataCache[$alias])) {
                $dataCache[$alias] = [];
            }

            $items = $m->loadItems($alias, array_unique($ids));
            if ($items->isSuccess()) {
                foreach ($items->getData() as $item) {
                    $dataCache[$alias][$item['id']] = $item;
                }
            }
        }

        // Compile data array and skip repeated data
        $data = [];
        foreach ($updates as $update) {
            $alias = $update['alias'];
            if (!isset($data[$alias])) {
                $data[$alias] = [];
            }

            $idEntity = $update['id_entity'];

            // If no id_entity of update record specified then load full data
            if (!$idEntity) {
                // The update has no id_entity
                // so it was not loaded on preload above
                // Load it here
                $entityItems = $m->loadItems($alias, []);
                if ($entityItems->isSuccess()) {
                    $data[$alias] = $entityItems->getData();
                }

                // go to the next update
                continue;
            }

            // If id_entity exists
            // but id_operation not specified then something wrong here
            if (!$update['id_operation']) {
                $logger->log('warn',
                    'No id_operation for ' . $idEntity . ' ' . $alias);

                continue;
            }

            // If id_entity and id_operation are specified
            // get data from preload cache
            // Create restore edit
            if (in_array($update['id_operation'], [
                Falcon_Record_X_History::OPERATION_CREATE,
                Falcon_Record_X_History::OPERATION_RESTORE,
                Falcon_Record_X_History::OPERATION_EDIT,
                Falcon_Record_X_History::OPERATION_DELETE
            ])) {
                if (!isset($dataCache[$alias][$idEntity])) {
                    // If data for some ids not found write it as removed items
                    // It usefull when dealing with groups
                    $data[$alias][] = [
                        'id' => $idEntity,
                        'state' => 3
                    ];
                    continue;
                }

                // New element
                $next = $dataCache[$alias][$idEntity];
                // Check previous element
                if (count($data[$alias])) {
                    $prev = $data[$alias][count($data[$alias]) - 1];
                    if (($prev['id'] == $idEntity)
                        && ($next['state'] == $prev['state'])
                    ) {
                        // Skip repeated element
                        continue;
                    }
                }

                $updateData = $next;
            }

            // Delete
            // Commented
            // because this way causes problems with fast delete-restore
            /*if ($update['id_operation']
                        == Falcon_Record_X_History::OPERATION_DELETE)
            {
                // For deleted entries do not request full data
                $updateData = array(
                    'id' => $idEntity,
                    'state' => 3
                );
            }*/

            $data[$alias][] = $updateData;
        }

        //If first loader then load first n packets
        if ($firstLoader && in_array('mon_packet', $proxyAliases)) {
            $packets = $m->loadPackets(null, null);
            if ($packets->isSuccess()) {
                $data['mon_packet'] = $packets->getData();
            }
        }

        // Delete empty aliases (probably should never happen)
        $data = array_filter($data);

        // Set user's last_loader
        $userRecord = $user->getRecord(false);
        $userRecord->set('last_loader', $edt);
        $userRecord->clearTriggers()->update();

        $answer = new Falcon_Message();
        $answer->addParam('data', $data);
        $answer->addParam('lastload', $edt);
        $this->sendAnswer($answer);
    }

    /**
     *  boot
     *  Загрузка основных данных для пользователя при загрузке страницы
     */
    public function bootAction()
    {
        $logger = Falcon_Logger::getInstance();
        // Write open browser event
        $user = Falcon_Model_User::getInstance();
        $userRecord = $user->getRecord(false);
        // If user was not loginned
        if (!$user->get('logined')) {
            $user->eventOpenBrowser();
            $userRecord->set('logined', true);
            $userRecord->clearTriggers()->update();
        }

        $answer = new Falcon_Message();
        // массив идентификаторов проксей
        $proxies = json_decode($this->_getParam('proxies'), true);
        if (!is_array($proxies)) {
            return $this->sendAnswer($answer
                ->error(Falcon_Exception::BAD_REQUEST)
            );
        }
        // путь к контроллерам
        $path = Zend_Registry::get('config')->path->controllers;
        // массив данных с ключами по идентификаторам проксей
        $data = [];

        $page = 'page_' . $this->_getParam('page');

        // Save to session related to requested page proxies
        $session = new Zend_Session_Namespace('Loader');
        if (!$session->proxies) {
            // If session has not proxies array
            // set it with proxies for requested page
            $session->proxies = [
                $page => $proxies
            ];
        } else {
            // If session already has proxies, get them
            $sessionProxies = $session->proxies;
            // Allways set proxies for requested page
            $sessionProxies[$page] = $proxies;
            $session->proxies = $sessionProxies;
        }

        // обход идентификаторов проксей
        foreach ($proxies as $proxyData) {
            if (!isset($proxyData['id'])) {
                continue;
            }
            $proxy = $proxyData['id'];
            // если прислали что-нибудь типа ../../../../../etc/passwd
            if (!preg_match('/^[_a-z]+$/i', $proxy)) {
                continue;
            }

            // If not need to preload, continue
            if (!$proxyData['needPreload']) {
                continue;
            }

            // Get extraParams
            $params = [];
            if (isset($proxyData['extraParams'])) {
                $params = $proxyData['extraParams'];
            }

            $exploded = explode('_', $proxy);
            foreach ($exploded as &$e) {
                $e = ucfirst($e);
            }

            // new version of loading data:
            $dataLoaded = false;
            $actionClass = 'Falcon_Action_' . implode('_', $exploded);
            // путь к файлу контроллера
            $file = Zend_Registry::get('config')->path->library .
                str_replace('_', '/', $actionClass) . '.php';
            // if file exists then load action
            if (is_file($file)) {
                try {
                    $actionInstance = new $actionClass($params);
                    // получение данных для прокси и добавление в массив
                    $data[$proxy] = $actionInstance
                        ->doGetList(false)
                        ->getData();
                    $dataLoaded = true;
                } catch (Exception $e) {
                    // silent exception
                    $logger->log('loader-controller', [
                      "Action $actionClass has an error",
                      $e->getMessage(),
                      $e->getTrace()
                  ], 'ERROR');
                }
            }
            if (!$dataLoaded) {
                //$logger->debug($file . ' :: Not loaded');
                // класс контроллера
                $class = implode('_', $exploded) . 'Controller';
                // путь к файлу контроллера
                $file = $path . str_replace('_', '/', $class) . '.php';
                // если нет такого, то игнорим
                if (!is_file($file)) {
                    continue;
                }
                // подключение файла контроллера
                require_once $file;
                // создание объекта контроллера, надеюсь, зенд не обидится
                // TODO заменить на загрузку через менеджер!

                $controller = new $class($this->getRequest(), $this->getResponse());
                // получение данных для прокси и добавление в массив
                $data[$proxy] = $controller->get()->getData();
            }
        }

        // Alternative version
        // request last browser closed event
        //$userId = $user->getId();
        /*$m = Falcon_Mapper_Ev_All::getInstance();
        $lastEvent = $m->loadBy(function($sql) use ($userId) {
            $sql->where('id_event IN (?)', array(32, 31))
                ->where('id_obj = ?', $userId)
                ->order('dt desc')
                ->limit(1);
        });

        // Write event
        $writeEvent = true;
        if (isset($lastEvent[0])) {
            if ($lastEvent[0]['id_event'] !== 32) {
                $writeEvent = false;
            }
        }*/

        /*if ($writeEvent) {
            $user->eventOpenBrowser();
        }*/
        // Add server time
        $answer->addParam('server_time', date(DB_DATE_FORMAT));

        $this->sendAnswer($answer->addParam('data', $data));
    }

    /**
     * Returns initial data
     */
    public function initialAction()
    {
        $answer = new Falcon_Message();
        $manager = new Falcon_Model_Manager();
        $proxies = $this->_getParam('proxies');
        $proxies = json_decode($proxies, true);
        if (!$proxies) {
            return $this->sendAnswer($answer);
        }
        $data = [];
        foreach ($proxies as $proxy) {
            if ($proxy['id'] == 'mon_packet') {
                $packets = $manager->loadPackets(null, null);
                if ($packets->isSuccess()) {
                    $data['mon_packet'] = $packets->getData();
                }
            }

            if ($proxy['id'] == 'n_work') {

                $order = [
                    'property' => 'dt',
                    'direction' => 'asc'
                ];
                $action = new Falcon_Action_N_Work([
                    'pageAndOrderParams' => [
                        'order' => [
                            (object)$order
                        ]
                    ]
                ]);
                $data['n_work']
                    = $action->doGetList()->getData();
            }
        }

        $answer->addParam('data', $data);
        $this->sendAnswer($answer);
    }
}