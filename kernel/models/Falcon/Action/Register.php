<?php

/**
 * Registration class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Action_Register extends Falcon_Action_Abstract
{
    const
        PERSON_PREFIX = '/PERSONAL/',
        FIRM_RBEGROUP_NAME = 'RBEGroup';

    /**
     * Добавляем ожидающего подтверждения пользователя
     * @param {Array} $params Параметры
     */
    public function addPending($params)
    {
        $logger = Falcon_Logger::getInstance();
        //$config = Zend_Registry::get('config');
        $logger->log('reg', 'Input params', $params);

        // reset logged in user
        $currentUser = Falcon_Model_User::getInstance();
        if ($currentUser && $currentUser->getId() > 0) {
            //$user->reset();
            //$user->setId(-1);
        }

        $logger->log('reg', '2');

        // Retrieve tariff plan
        if (isset($params['tariff'])) {
            $tariffAlias = $params['tariff'];
        } else {
            $this->_throwHard('Tariff plan is not found');
        }
        $tariffAlias = $params['tariff'];
        $rows = Falcon_Mapper_X_Tariff::getInstance()->load([
            'identifier = ?' => $tariffAlias
        ], true);
        if (empty($rows)) {
            $this->_throwHard('Tariff plan is not found.');
        }
        $tariffId = $rows[0]['id'];
        $tariffLimitValue = $rows[0]['limitvalue'];
        $logger->log('reg', '3: tariffId = ' . $tariffId);
        $logger->log('reg', '3.5: tariffLimitValue = ' . $tariffLimitValue);

        // Company name
        $accountType = (isset($params['type'])
            && $params['type'] == 'yur') ?
            Falcon_Record_X_Firm::AT_BUSINESS :
            Falcon_Record_X_Firm::AT_INDIVIDUAL;
        $companyName = $this->_getOrganizationName($accountType, $params);

        $db = Zend_Db_Table::getDefaultAdapter();
        $db->beginTransaction();
        try {
            // Create x_firm
            $firm = new Falcon_Record_X_Firm();
            $firm->set('individual', $accountType);
            if (isset($params['id_firm'])) {
                $firm->set('id_firm', $params['id_firm']);
            }
            $firm->insert();

            // Get firm_id
            $firmId = $firm->getId();

            $logger->log('reg', '4: id_firm = ' . $firmId);

            // Create x_company
            $companyId = $firm->get('id_company');
            if (!$companyId) {
                $company = new Falcon_Record_X_Company([
                    'name' => $companyName,
                    'id_firm' => $firmId
                ]);
                $company->insert();
                $companyId = $company->getId();

                // Set id_company to x_firm
                $firm->set('id_company', $companyId)->update();
            } else {
                $company = new Falcon_Record_X_Company($companyId);
                $company->set('name', $companyName);
                $company->update();
            }

            // Create new billing account
            $account = new Falcon_Record_Billing_Account();
            $account->set('id_firm', $firmId)
                ->set('limitvalue', $tariffLimitValue)
                ->setTariff($tariffId)
                ->insert();

            $logger->log('reg', '5: account->getId() = ' . $account->getId());

            // Create x_person
            $person = new Falcon_Record_X_Person();
            $person->setProps([
                'id_firm' => $firmId,
                'firstname' => isset($params['firstname']) ?
                    $params['firstname'] : null,
                'secondname' => isset($params['secondname']) ?
                    $params['secondname'] : null,
                'lastname' => isset($params['lastname']) ?
                    $params['lastname'] : null
            ])
                ->insert();
            $personId = $person->getId();

            // Add person email
            $email = new Falcon_Record_X_Person_Email([
                'id_person' => $personId,
                'address' => $params['email'],
                'isprimary' => 1,
            ]);
            $email->insert();

            $t = Zend_Registry::get('translator');

            // Add work phone
            if (isset($params['workphone'])) {
                $phone = new Falcon_Record_X_Person_Phone([
                    'id_person' => $personId,
                    'number' => $params['workphone'],
                    'note' => $t['zt']->_('Work phone'),
                    'isprimary' => 1,
                ]);
                $phone->insert();
            }

            // Add mobile phone
            if (isset($params['mobilephone'])) {
                // Записываем его мобильный телефон
                $phone = new Falcon_Record_X_Person_Phone([
                    'id_person' => $personId,
                    'number' => $params['mobilephone'],
                    'note' => $t['zt']->_('Mobile phone'),
                    'isprimary' => 0,
                ]);
                $phone->insert();
            }

            // Create schedule
            $schedule = new Falcon_Record_X_Schedule();
            $scheduleId = $schedule->insert()->getId();

            // Create x_user
            $user = new Falcon_Record_X_User();
            $user->set('id_firm', $firmId);
            $user->set('id_person', $personId);
            $user->set('id_schedule', $scheduleId);
            $user->set('shortname',
                (isset($params['firstname']) ? $params['firstname'] . ' ' : '') .
                (isset($params['lastname']) ? $params['lastname'] . ' ' : '')
            );
            $user->insert();
            $userId = $user->getId();

            $logger->log('reg', '6: $userId = ' . $userId);

            // Create default notification setting
            $m = Falcon_Mapper_X_Notification_Setting::getInstance();
            $mt = Falcon_Mapper_X_Notification_Setting_Type::getInstance();
            $m->createWithImportance([
                'id_user' => $userId,
                'id_type' => $mt->getIdForAlias('email'),
                'address' => $email->get('address'),
                'high' => true
            ]);

            $logger->log('reg', 'register()', [
                'id_firm' => $firmId,
                'id_user' => $userId
            ]);

            // Registration type
            if ($tariffAlias == 'supply_free') {
                $this->registerSupplier($firmId, $user, $params);
            } else {
                $this->registerObserver($userId, $user, $params);
            }

            // commit
            $db->commit();
        } catch (Exception $e) {
            // rollback
            $db->rollback();
            throw $e;
        }

        try {
            if (getEnvironment() === 'production') {
                // elma integration (after registration)
                $this->elmaRequest(array_merge($params, [
                    'id_user' => $userId
                ]));
            }
        } catch (Exception $E) {
            // silent exception because
            // it is not a user's problem
        }

    }

    /**
     * Проверяем, есть ли в базе такой хеш
     * @param {String} $hash
     * @return Boolean
     */
    public function isValidHash($hash)
    {
        $count = Falcon_Mapper_X_User::getInstance()->getCount([
            'mailhash = ?' => $hash]);
        return ($count > 0);
    }

    /**
     * Завершаем регистрацию
     * @param {Array} $params
     */
    public function finishObserver($params)
    {
        $config = Zend_Registry::get('config');
        // Check if login already exists
        $exists = Falcon_Mapper_X_User::getInstance()->getCount([
            'login = ?' => $params['login']]);
        if (!empty($exists)) {
            $this->_throwSoft('Login already used');
        }

        // Провереям, не протух ли хеш, берем пользователя
        $users = Falcon_Mapper_X_User::getInstance()->load([
            'mailhash = ?' => $params['hash']]);
        if (empty($users)) {
            $this->_throwHard('Register user not found');
        }

        $user = new Falcon_Model_User($users[0]->get('id'));
        $user->rename($params['login']);
        $password = $user->resetPassword(isset($params['password']) ?
            $params['password'] : null);

        // Провереям, на наличие мыла
        $email = $user->getEmail();
        if (!empty($email)) {
            // И если есть, уведомляем об успехе регистрации
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_success',
                [
                    'user' => $user,
                    'login' => $params['login'],
                    'password' => $password
                ],
                $config->variables->notifyEmail,
                $email
            );

            // Remove mailhash
            $user->set('mailhash', null);
        }

        // Share demo devices to user
        //$this->shareDemoDevices($user);
    }

    /**
     * Share demo devices to user
     * @param type $user
     */
    public function shareDemoDevices($user)
    {
        // Hardcoded demo firm id
        $demoFirmId = 104;

        $m = Falcon_Mapper_Mon_Device::getInstance();
        $demoDevices = $m->loadBy(function ($sql) use ($demoFirmId) {
            $sql->where('t.id_firm = ?', $demoFirmId)
                ->where('t.state != ?', Falcon_Record_Abstract::STATE_DELETED);
        });

        foreach ($demoDevices as $demoDevice) {
            $r = new Falcon_Record_X_Access([
                'id_user' => $user->getId(),
                'id_firm' => 0,
                'id_object' => $demoDevice['id'],
                'right' => 'mon_device',
                'writeable' => 0,
                'shared' => 1,
                'auto' => 1
            ]);

            $r->insert();
        }
    }

    /**
     * Бросает эксепшен выводящий на экран ошибку
     * @param {String} $message
     * @returns Mixed
     */
    protected function _throwHard($message)
    {
        Throw new Falcon_Exception($message,
            Falcon_Exception::OBJECT_NOT_FOUND);
    }

    /**
     * Бросает эксепшен который не вызывает глобальный отладчик,
     * а передается в яваксрипт
     * @param {String} $message
     * @returns Mixed
     */
    protected function _throwSoft($message)
    {
        Throw new Falcon_Exception($message,
            Falcon_Exception::ALREADY_EXISTS);
    }

    /**
     * Возвращает название для организации
     * @param {string} $accountType Тип
     * @param {array} $params
     * @returns string
     */
    protected function _getOrganizationName($accountType, array $params)
    {
        if ($accountType == Falcon_Record_X_Firm::AT_BUSINESS) {
            if (isset($params['organization'])) {
                $name = $params['organization'];
            }
            if (!isset($name) || empty($name)) {
                $this->_throwHard('Please, specify "organization" parameter');
            }
            return $name;
        } else {
            if (isset($params['email'])) {
                $name = $params['email'];
            }
            if (!isset($name) || empty($name)) {
                $this->_throwHard('Please, specify "email" parameter');
            }
            return self::PERSON_PREFIX . $name;
        }
    }

    /**
     * Создает уникальный хеш для письма
     * @returns String
     */
    protected function _createLinkHash()
    {
        return md5(microtime(true));
    }

    /**
     * Observer registration
     * @param Number $userId User identifier
     * @param Falcon_Model_User $user User object
     * @param Array $params Params
     */
    private function registerObserver($userId, $user, $params)
    {
        $logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');

        // Create and set unqiue mailhash
        $hash = $this->_createLinkHash();
        $user->set('mailhash', $hash);
        $user->update();

        // Set rightlevel
        $m = new Falcon_Record_X_Right_Level_Link_User([
            'id_user' => $userId,
            'id_right_level' => 1
        ]);
        $m->insert();

        if (isset($params['simple']) && $params['simple']) {
            if (!isset($params['email']) || !$params['email']) {
                $this->_throwHard('Please, specify "email" parameter');
            }
            $this->finishObserver([
                'login' => $params['email'],
                'hash' => $hash
            ]);
        } else {
            // Send confirmation email
            $logger->log('reg', 'Send email, mailhash:' . $hash);
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_confirm',
                [
                    'user' => $user,
                    'hash' => $hash
                ],
                $config->variables->notifyEmail,
                $params['email']
            );
        }
    }

    /**
     * Supplier registration
     * @param Number $firmId Firm identifier
     * @param Falcon_Model_User $user User object
     * @param Array $params Params
     */
    private function registerSupplier($firmId, $user, $params)
    {
        $logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');
        $userId = $user->getId();
        $person = new Falcon_Record_X_Person($user->get('id_person'));

        // safe param get function
        $get = function ($value) use ($params) {
            return (isset($params[$value])) ? $params[$value] : null;
        };

        //$firm = new Falcon_Model_Firm($firmId);
        $firm = new Falcon_Record_X_Firm($firmId);

        // Create director
        $director = new Falcon_Record_X_Person();
        $director->setProps([
            'id_firm' => $firmId,
            'firstname' => $get('directorfirstname'),
            'secondname' => $get('directorsecondname'),
            'lastname' => $get('directorlastname'),
        ]);
        $director->insert();
        $directorId = $director->getId();

        // Update x_company
        $company = new Falcon_Record_X_Company($firm->get('id_company'));
        $company->setProps([
            'inn' => $get('companyinn'),
            'kpp' => $get('companykpp'),
            'ogrn' => $get('companyogrn'),
            'okpo' => $get('companyokpo'),
            'okved' => $get('companyokved'),
            'id_address_physical' => $get('addressactual'),
            'id_address_legal' => $get('addresslegal'),
            'id_director' => $directorId
        ]);
        $company->update();

        // Create bank account
        $bank = new Falcon_Record_X_Company_Bank_Account();
        $bank->setProps([
            'id_company' => $company->getId(),
            'bank_bik' => $get('bankbik'),
            'bank_name' => $get('bankname'),
            'payment_account' => $get('bankaccount'),
            'correspondent_account' => $get('bankcorrespondentaccount'),
            'isprimary' => 1
        ]);
        $bank->insert();

        $logger->log('reg', 'setFields');

        // Get RBEgroup firm
        $records = Falcon_Mapper_X_Company::getInstance()->load(
            ['name = ?' => self::FIRM_RBEGROUP_NAME]
        );
        $firmIdOwner = $records[0]->get('id_firm');

        $firmOwner = new Falcon_Model_Firm($firmIdOwner);
        $managers = $firmOwner->getFirmUsers();
        //$userMapper = Falcon_Mapper_X_User::getInstance();
        //$managers = $userMapper->loadByFirm($firmIdOwner, false);

        $manager = (count($managers) > 0) ? $managers[0] : null;

        $logger->log('reg', 'Send email', [
            $user->toArray(),
            //$manager->toArray(),
            $firmIdOwner
        ]);

        // Notify user
        Falcon_Sender_Email::sendSimple(
            'views/scripts/actions/reg_waiting',
            [
                'user' => $user,
                'manager' => $manager
            ],
            $config->variables->notifyEmail,
            $params['email']
        );

        // Create dn_account
        $account = new Falcon_Record_Dn_Account([
            'id_firm' => $firmIdOwner,
            'id_firm_client' => $firmId,
            'state' => 0
        ]);
        $account->insert();

        // Notify managers
        // then let's activate users in this firm
        foreach ($managers as $manager) {
            $logger->log('reg', 'Send email to manager');
            $logger->log('reg', 'manageremail ' . $manager->getEmail());
            // notify user by email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_request',
                [
                    'manager' => $manager,
                    'managerfirm' => $firmOwner,
                    'user' => $person,
                    'userfirm' => $company
                ],
                $config->variables->notifyEmail,
                $manager->getEmail()
            );
        }

        $logger->log('reg', 'Upload files');

        $path = Zend_Registry::get('config')->path->uploaded;
        $filename = Falcon_Util::filePrepare(
            Falcon_Util::translit($params['organization']));
        $t = Zend_Registry::get('translator');
        foreach (['inn', 'ogrn', 'charter', 'egryl'] as $alias) {
            $hash = $get('hash' . $alias);
            $ex = $get('extension' . $alias);
            $suffix = '_' . strtoupper($alias);
            switch ($alias) {
                case 'charter':
                    $suffix = '_USTAV';
                    break;
                case 'egryl':
                    $suffix = '_EGRUL';
                    break;
            }
            if (isset($hash) && isset($ex) && is_file($path . $hash)) {
                $doc = new Falcon_Record_Dn_Doc([
                    'name' => $t['zt']->_(ucfirst($alias)),
                    'file' => $filename . $suffix . '.' . $ex,
                    'hash' => $hash,
                    'id_firm' => $firmIdOwner,
                    'id_firm_for' => $firmId,
                    'dt' => date(DB_DATE_FORMAT),
                    'state' => 1
                ]);
                $doc->insert();
            }
        }
    }

    /**
     * Account registration (for waiting approval)
     * @param Number $firmId Firm identifier
     * @param String $login Login
     * @param String $password Password
     */
    public function registerSupplierAccount($userId,
                                            $login = false, $password = false)
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('reg', 'registerSupplierAccount() ' . $userId);

        $user = new Falcon_Model_User($userId);
        if ($user->get('login')) {
            return null;
        }
        $logger->log('reg', 'firmId = ' . $user->get('id_firm'));

        if (empty($password)) {
            $password = $user->resetPassword();
        }
        // clear mailhash
        $user->set('mailhash', null);

        // generate login
        if (empty($login)) {
            $login = $user->generateLogin();
        }
        $user->rename($login);

        $logger->log('reg', 'user login generated: ' . $login);

        // assign level rights
        // TODO MOVE IT FROM HERE. AND REWRITE, because it erases all user
        // right levels!

        // Drop other rights
        $m = Falcon_Mapper_X_Right_Level_Link_User::getInstance();
        $m->delete(['id_user = ?' => $userId]);

        // Link user new right level
        $rlid_supplier = 6; // К - Поставщик
        $r = new Falcon_Record_X_Right_Level_Link_User([
            'id_user' => $userId,
            'id_right_level' => $rlid_supplier
        ], false, false);
        $r->insert();

        return [
            'login' => $login,
            'password' => $password
        ];
    }

    /**
     * Sends registration data to elma
     * @param array $params
     */
    private function elmaRequest($params)
    {
        return;
        $logger = Falcon_Logger::getInstance();
        $logger->log('reg', 'Sending SOAP request to ELMA...');
        $config = Zend_Registry::get('config')->elma;
        $client = new SoapClient($config->registration->url, [
            "trace" => 1,
            "exception" => 1
        ]);
        try {
            $instanceName = 'Добавление лида с сайта - ' . $params['email'];
            $params = [
                'URL' => $params['url'],
                'maprox_id_user' => $params['id_user'],
                'firstname' => $params['firstname'],
                'middlename' => $params['secondname'],
                'lastname' => $params['lastname'],
                'e_mail' => $params['email'],
                'phone' => $params['phone'],
                'website' => $params['website'],
                'is_organization' => ($params['type'] == 'person')
                    ? 'false' : 'true',
                'organization_name' => $params['organization'],
                'post' => $params['userpost'],
                'referrer' => $params['referrer_other'] ?
                    $params['referrer_other'] : $params['referrer'],
                'city' => $params['city']
            ];

            $logger->log('elma', $params);

            $xml_params = "<ns1:Items>";
            foreach ($params as $key => $value) {
                $xml_params .= "<ns1:WebDataItem>";
                $xml_params .= "<ns1:Name>" .
                    htmlspecialchars($key) . "</ns1:Name>";
                $xml_params .= "<ns1:Value>" .
                    htmlspecialchars($value) . "</ns1:Value>";
                $xml_params .= "</ns1:WebDataItem>\n";
            }
            $xml_params .= "</ns1:Items>";

            $data = new stdClass();
            $data->Items = new SoapVar($xml_params, XSD_ANYXML, null);

            $input = [];
            $input[$instanceName] = [
                'userName' => $config->registration->username,
                'password' => $config->registration->password,
                'token' => $config->registration->token,
                'instanceName' => $instanceName,
                'data' => $data
            ];
            $response = $client->__soapCall($config->registration->method,
                $input, ['uri' => $config->registration->uri]);
            $logger->log('reg', $response);
        } catch (SoapFault $E) {
            $logger->log('reg', [
                'exception' => $E,
                'request' => $client->__getLastRequest()
            ]);
        }
    }

}
