<?php

/**
 * Authentication controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class AuthController extends Zend_Controller_Action
{
    /**
     * Инициализация контроллера
     */
    public function init()
    {
        $this->view->static = Zend_Registry::get('config')->resources->static;
    }

    /**
     * auth
     * If user is already logged in redirect to the main page
     */
    public function indexAction()
    {
        $auth = Zend_Auth::getInstance();
        $t = Zend_Registry::get('translator');
        if (isset($_GET['r'])) {
            $reason = ($t['zt']->translate('reason' . (int)$_GET['r']) !=
                'reason' . (int)$_GET['r']) ?
                $t['zt']->translate('reason' . (int)$_GET['r']) : '';
        } else {
            $reason = '';
        }
        $this->view->reason = $reason;
        $this->view->request_url =
            empty($_GET['url']) ? '/' : urldecode($_GET['url']);
        if ($auth->hasIdentity()) {
            $this->_redirect('/');
        }

        $cachePeriod = 86400 * 7; // Cache it for the next week
        $response = $this->getResponse();
        $response->setHeader('Pragma', '', true);
        $response->setHeader('Expires',
            gmdate("D, d M Y H:i:s", time() + $cachePeriod) . " GMT", true);
        $response->setHeader('Cache-Control', 'max-age=' . $cachePeriod, true);

    }

    /**
     * auth/login
     */
    public function loginAction()
    {
        $logger = Falcon_Logger::getInstance();

        $config = Zend_Registry::get('config');
        // login-controller gets only POST data
        if (!$this->_request->isPost()) {
            $this->_redirect('/');
        }

        $auth = Zend_Auth::getInstance();
        if ($auth->hasIdentity()) {
            $answer = new Falcon_Message();
            $this->_helper->json($answer->toArray());
            return;
        }

        $answer = Falcon_Auth_Adapter::checkAuthData($this);
        if ($answer->isSuccess()) {
            $authData = $answer->getData();
            // Проверяем и сохраняем результат проверки
            $authAdapter = new Falcon_Auth_Adapter($authData);
            $authResult = $auth->authenticate($authAdapter);
            $answer
                ->setSuccess($authResult->isValid())
                ->appendErrors($authResult->getMessages());
            if ($answer->isSuccess()) {
                // Check if mobile
                $isMobile = false;
                $deviceType = Zend_Registry::get('deviceType');
                if ($deviceType === 'mobile') {
                    $isMobile = true;
                }

                // Записываем в хранилище данные пользователя
                $data = $authAdapter->getDataForStorage();
                $data['is_master'] = $authAdapter->getUser()
                    ->isMasterHash($answer->getRow('hash'));

                // All mobile sessions are master session
                if ($isMobile) {
                    $data['is_master'] = 1;
                }

                $auth->getStorage()->write($data);

                // get all terminated sessions
                // notify node.js
                // remove termintated sessions
                $idUser = $authAdapter->getUser()->getId();

                // Get sessions that should be deleted
                if ($authAdapter->getUser()->needUniqueSession()
                    && !$data['is_master'] && !$isMobile
                ) {
                    $m = Falcon_Mapper_Session::getInstance();
                    $terminated = $m->load([
                        'id_user = ?' => $idUser,
                        'is_master = ?' => 0,
                        'id != ?' => Zend_Session::getId()
                    ]);

                    if (count($terminated)) {
                        foreach ($terminated as $session) {
                            $sessionId = $session->get('id');
                            // Remove session
                            $session->set('terminated', 1);
                            //$m->destroy($sessionId);
                            // Notify node.js about multiple authorization
                            Falcon_Sender_Queue::sendAmqp('nodejs.control', '',
                                [
                                    'id_user' => $idUser,
                                    'session' => trim($sessionId),
                                    'action' => 'logout',
                                    'params' => [
                                        'code' =>
                                            Falcon_Exception::MULTIPLE_AUTHORIZATION,
                                        'params' => [
                                            'sessionData' => [
                                                'ip' => $_SERVER['REMOTE_ADDR'],
                                                'dt' => date(DB_DATE_FORMAT)
                                            ]
                                        ]
                                    ]
                                ]
                            );
                        }
                    }
                }

                if ($config->logger->watchLogin) {
                    $logger = Falcon_Logger::getInstance();
                    $logger->log('auth', 'Success login', $authData);
                }
            } else {
                if ($config->logger->watchLogin) {
                    $logger = Falcon_Logger::getInstance();
                    $logger->log('auth', 'Failed login', $authData);
                }
            }
        }
        // передаём результаты в шаблон
        $answer->delParam('data');

        $error = $answer->getLastError();
        if ($error && $error['code'] ==
            Falcon_Auth_Adapter::USER_PASSWORD_NEEDS_CHANGE
        ) {
            $answer->addParam('changepass', true);
        }

        $this->_helper->json($answer->toArray());
    }

    /**
     * auth/logout
     */
    public function logoutAction()
    {
        $auth = Zend_Auth::getInstance();
        $user = Falcon_Model_User::getInstance();

        // We need to destroy session on node.js side
        // And refresh other browser tabs with this session
        Falcon_Sender_Queue::sendAmqp('nodejs.control', '',
            [
                'id_user' => $user->getId(),
                'session' => Zend_Session::getId(),
                'action' => 'logout',
                'params' => [
                    'refresh' => true
                ]
            ]
        );

        if ($auth->hasIdentity()) {
            $user->eventLogout();
            $auth->clearIdentity();
        }
        Zend_Session::expireSessionCookie();
        Zend_Session::forgetMe();

        $r = isset($_GET['r']) ? '?r=' . $_GET['r'] : '';
        $ip = isset($_GET['ip']) ? $_GET['ip'] : '';
        $dt = isset($_GET['dt']) ? $_GET['dt'] : '';
        $nt = isset($_GET['nt']) ? $_GET['nt'] : '';
        $contactStr = isset($_GET['contact_str']) ? $_GET['contact_str'] : '';

        // Validate date and ip
        $validator = new
        Zend_Validate_Hostname(Zend_Validate_Hostname::ALLOW_IP);
        if (!$validator->isValid($ip)) {
            $ip = '';
        } else {
            $ip = '&ip=' . $ip;
        }

        if (strtotime($dt) === false) {
            $dt = '';
        } else {
            $dt = '&dt=' . $dt;
        }

        if (strtotime($nt) === false) {
            $nt = '';
        } else {
            $nt = '&nt=' . $nt;
        }

        if (!empty($contactStr)) {
            $contactStr = '&contact_str=' . $contactStr;
        }

        //$answer = Falcon_Message();
        //$this->_helper->json($answer->toArray());

        // TODO: all current logout errors system looks a little strange
        $this->_redirect('/auth/' . $r . $ip . $dt . $nt . $contactStr);
    }

    /**
     * Password restore request
     * If login exists, then sends email to the specified address
     */
    public function restoreAction()
    {
        $answer = new Falcon_Message();
        $login = trim($this->_getParam('login'));

        $m = Falcon_Mapper_X_User::getInstance();
        $records = $m->loadBy(function ($sql) use ($login) {
            $sql
                ->where('login = ?', $login)
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
        });

        // Find users with specified email
        $emailUsers = [];
        $validator = new Zend_Validate_EmailAddress();
        if ($validator->isValid($login)) {
            $t = new Falcon_Table_X_User();
            $emailUsers = $t->getUsersByEmail($login);
        }

        $userIds = [];

        $users = array_merge($records, $emailUsers);

        foreach ($users as $user) {
            if (!array_key_exists($user['id'], $userIds)) {
                $userIds[$user['id']] = [];
            }

            if (isset($user['address'])) {
                $userIds[$user['id']]['email'] = $user['address'];
            }

            $userIds[$user['id']]['id_firm'] = $user['id_firm'];
        }

        $errors = [];
        $success = [];
        if (!empty($userIds)) {
            foreach ($userIds as $id => $user) {
                $guest = new Falcon_Model_User($id);
                // Check whether user or firm disabled
                $firmId = $user['id_firm'];
                $firm = new Falcon_Model_Firm($firmId);
                if (!$firm->isEnabled()) {
                    $errors[] = 4047;
                    continue;
                }

                if (isset($user['email'])) {
                    $email = $user['email'];
                } else {
                    if ($guest->getEmail()) {
                        $email = $guest->getEmail();
                    } else {
                        $errors[] = 4046;
                        continue;
                    }
                }

                $s = $guest->getSettings();
                $l = $s['p.lng_alias'];
                if ($l) {
                    $t = Zend_Registry::get('translator');
                    $t['helper']->setLanguage($l);
                }
                $sender = new Falcon_Sender_Email();
                $response = $sender->send(
                    $guest,
                    $email,
                    'views/scripts/actions/psw_restore'
                );
                if ($response->isFailure()) {
                    $errors[] = [
                        'code' => $response->getErrorCode(),
                        'msg' => $response->getErrorMessage()
                    ];
                    continue;
                } else {
                    $success[] = true;
                }
            }
        } else {
            $answer->error(4047);
        }

        if (empty($success)) {
            if (!empty($errors)) {
                if (is_array($errors[0])) {
                    $answer->error(
                        $errors[0]['code'],
                        [$errors[0]['msg']]
                    );
                } else {
                    $answer->error($errors[0]);
                }
            }
        }

        $this->_helper->json($answer->toArray());


        /*if (!empty($records))
        {
            $user = $records[0];
            $guest = new Falcon_Model_User($user['id']);
            // Check whether user or firm disabled
            $firmId = $user['id_firm'];
            $firm = new Falcon_Model_Firm($firmId);
            if (!$firm->isEnabled())
            {
                $answer->error(4047);
                $this->_helper->json($answer->toArray());
            }
            if ($guest->getEmail())
            {
                $s = $guest->getSettings();
                $l = $s['p.lng_alias'];
                if ($l)
                {
                    $t = Zend_Registry::get('translator');
                    $t['helper']->setLanguage($l);
                }
                $sender = new Falcon_Sender_Email();
                $response = $sender->send(
                    $guest,
                    $guest->getEmail(),
                    'views/scripts/actions/psw_restore'
                );
                if ($response->isFailure())
                {
                    $answer->error($response->getErrorCode(), array(
                        $response->getErrorMessage()
                    ));
                }
            }
            else
            {
                $answer->error(4046);
            }
        }
        else
        {
            $answer->error(4047);
        }
        $this->_helper->json($answer->toArray());*/
    }

    /**
     * Сброс пароля при переходе по ссылке из письма
     */
    public function resetAction()
    {
        $config = Zend_Registry::get('config');
        $answer = new Falcon_Message();
        $passwordhash = empty($_GET['r']) ? '' : $_GET['r'];
        if (preg_match('/^[\da-f]{40}$/', $passwordhash)) {
            $m = Falcon_Mapper_X_User::getInstance();
            $records = $m->loadBy(function ($sql) use ($passwordhash) {
                $sql
                    ->where('password = ?', $passwordhash)
                    ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            });
            if (!empty($records)) {
                $user = $records[0];
                $guest = new Falcon_Model_User($user['id']);

                $newpassword = $guest->resetPassword();
                $login = $guest->get('login');

                // sending an email with new password
                $response = Falcon_Sender_Email::sendSimple(
                    'views/scripts/actions/psw_reset',
                    [
                        'user' => $guest,
                        'newpassword' => $newpassword
                    ],
                    $config->variables->notifyEmail,
                    $guest->getEmail()
                );

                if ($response->isFailure()) {
                    $answer->error($response->getErrorCode(), [
                        $response->getErrorMessage()
                    ]);
                }

                // authorization
                $auth = Zend_Auth::getInstance();
                if (!$auth->hasIdentity()) {
                    // Проверяем и сохраняем результат проверки
                    $authAdapter = new Falcon_Auth_Adapter([
                        'user' => $login,
                        'hash' => md5($newpassword),
                        'prefix' => ''
                    ]);
                    $authResult = $auth->authenticate($authAdapter);
                    $answer
                        ->setSuccess($authResult->isValid())
                        ->appendErrors($authResult->getMessages());
                    if ($answer->isSuccess()) {
                        // Записываем в хранилище данные пользователя
                        $data = $authAdapter->getDataForStorage();
                        $auth->getStorage()->write($data);
                    }
                }
            } else {
                $answer->error(4042);
            }
        } else {
            $answer->error(4042);
        }
        $this->view->answer = $answer;
    }

}
