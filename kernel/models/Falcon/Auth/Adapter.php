<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 *
 * Authentication adapter
 */
class Falcon_Auth_Adapter implements Zend_Auth_Adapter_Interface
{
    const
        USER_DISABLED_ERROR = 415,
        USER_SCHEDULE_ERROR = 416,
        USER_PASSWORD_NEEDS_CHANGE = 418,
        FIRM_DISABLED_ERROR = 4051,
        FIRM_UNPAID_ERROR = 4052,
        ACCOUNT_IS_NOT_ACTIVATED = 4054,
        NEW_PASSWORD_MATCHES_OLD = 4057;

    private $input;

    /**
     * @constructs
     * @param {Array} $input Input data {user, hash, prefix}
     */
    public function __construct($input)
    {
        $this->input = $input;
        Falcon_Model_User::getInstance()->initAuth($input);
    }

    /**
     * Authentication method
     * @return Zend_Auth_Result
     */
    public function authenticate()
    {
        $user = Falcon_Model_User::getInstance();
        $username = $user->getAuthParam('user');
        $success = true;


        // ------------------------------------------------
        // 1. Check username and password (try to log in)
        // ------------------------------------------------
        $success = $user->isLoggedIn();
        $errors = $user->getLastAnswer()->getErrorsList();

        // ------------------------------------------------
        // 2. Check if user is disabled
        // ------------------------------------------------
        if ($success) {
            $success = $user->isEnabled();
            if (!$success) {
                $errors[] = [
                    'code' => self::USER_DISABLED_ERROR
                ];
            }
        }

        // ------------------------------------------------
        // 3. Check user firm state
        // ------------------------------------------------
        if ($success) {
            $firmId = $user->getFirmId();
            $firm = new Falcon_Model_Firm($firmId);

            //
            // 3.1. Check if firm is disabled
            //
            $success = $firm->isEnabled();
            if (!$success) {
                $reason = $firm->get('DisablingReason');
                if (!$reason) {
                    $reason = $firm->get('DisablingReasonAuto');
                }
                $errors[] = [
                    'code' => self::FIRM_DISABLED_ERROR,
                    'params' => $reason ? [$reason] : []
                ];
            }

            //
            // 3.2. Check if firm have unpaid account
            //
            if ($success
                && $firm->get('have_unpaid_account')
                && !$user->hasRight('module_billing')
            ) {
                $success = false;

                // Get admin name and contacts
                $firm = new Falcon_Model_Firm($user->get('id_firm'));
                $firmUsers = $firm->getFirmUsers();

                // Data for error message
                $contactStr = '';
                foreach ($firmUsers as $firmUser) {
                    if ($firmUser->hasRight('module_billing')) {
                        $contactStr = $firmUser->getContactStr();

                        break;
                    }
                }

                $errors[] = [
                    'code' => self::FIRM_UNPAID_ERROR,
                    'params' => [
                        'data' => [
                            $contactStr
                        ],
                    ]
                ];
            }

            //
            // 3.3. Check if firm is wating for activation
            //
            if ($success) {
                // first of all let's change 'dn_account' record
                $mapper = Falcon_Mapper_Dn_Account::getInstance();
                $account = $mapper->getAccountByIdFirmClient($firmId);
                if ($account && !$account->isActivated()) {
                    $success = false;
                    $errors[] = [
                        'code' => self::ACCOUNT_IS_NOT_ACTIVATED,
                        'params' => []
                    ];
                }
            }
        }

        // ------------------------------------------------
        // 4. Check user schedule
        // ------------------------------------------------
        if ($success) {
            $sheduleId = $user->get('id_schedule');
            if ($sheduleId) {
                $schedule = new Falcon_Record_X_Schedule($sheduleId);
                if ($schedule && !$schedule->according()) {
                    $success = false;
                    $errors[] = [
                        'code' => self::USER_SCHEDULE_ERROR,
                        'params' => []
                    ];
                }
            }
        }

        // ------------------------------------------------
        // 5. Check, if password should be changed
        // ------------------------------------------------
        if ($success) {
            $needChange = $user->get('need_password_change');
            if ($needChange) {
                if (empty($this->input['new_password'])) {
                    $success = false;
                    $errors[] = [
                        'code' => self::USER_PASSWORD_NEEDS_CHANGE,
                        'params' => []
                    ];
                } elseif ($user->passwordSameAsOld($this->input['new_password'])) {
                    $success = false;
                    $errors[] = [
                        'code' => self::NEW_PASSWORD_MATCHES_OLD,
                        'params' => []
                    ];
                } else {
                    try {
                        $user->set('need_password_change', 0);
                        $user->changePassword($this->input['new_password']);
                    } catch (Falcon_Exception $e) {
                        $success = false;
                        $errors[] = [
                            'code' => $e->getCode(),
                            'params' => []
                        ];
                    }
                }
            }
        }

        // ------------------------------------------------
        // N. TEMPLATE
        // ------------------------------------------------
        if ($success) {
        }


        // ------------------------------------------------
        // Manage session if everything is ok
        // ------------------------------------------------
        if ($success) {
            $sessionId = null;
            if (isset($this->input['remember'])
                && $this->input['remember'] === 'true'
            ) {
                $config = Zend_Registry::get('config');
                Zend_Session::rememberMe($config->session->lifeTime);

                $sessionId = Zend_Session::getId();
            } else {
                Zend_Session::rememberUntil(0);
            }
            $user->eventLogin($sessionId);
        }

        return new Zend_Auth_Result(
            $success ?
                Zend_Auth_Result::SUCCESS :
                Zend_Auth_Result::FAILURE,
            $username,
            $errors
        );
    }

    /**
     * Проверка доступности для проверки входных данных от клиента
     * @param {Zend_View} $view Указатель на объект вида
     * @return Falcon_Message
     */
    public static function checkAuthData($view)
    {
        $answer = new Falcon_Message(null, false);
        // проверяем, были ли посланы логин и пароль
        $user = $view->getRequest()->getParam('user');
        $hash = $view->getRequest()->getParam('hash');
        $remember = $view->getRequest()->getParam('remember');
        $newPassword = $view->getRequest()->getParam('new_password');
        // или API-ключ
        $key = $view->getRequest()->getParam('key');
        if ($user && $hash) {
            $answer->setSuccess(true);
            $answer->addParam('data', [
                'user' => $user,
                'hash' => $hash,
                'remember' => $remember,
                'new_password' => $newPassword
            ]);
        } else if ($key) {
            $answer->setSuccess(true);
            $answer->addParam('data', [
                'key' => $key
            ]);
        } else {
            $answer->error(4041);
        }
        return $answer;
    }

    /**
     * Возвращаем данные для хранения в Storage
     * @return {Array.(name => value)}
     */
    public function getDataForStorage()
    {
        return $this->getUser()->getRecord()->toArray();
    }

    /**
     * Получение пользователя
     * @return Falcon_Model_User
     */
    public function getUser()
    {
        return Falcon_Model_User::getInstance();
    }

}
