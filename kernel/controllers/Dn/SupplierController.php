<?php

/**
 * Dn Supplier controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Dn_SupplierController extends Falcon_Controller_Action
{
    /**
     * /index
     * Loading of suppliers waiting for approval
     */
    public function loadAction()
    {
        $loadDeleted = $this->_getParam('loadDeleted');
        $user = Falcon_Model_User::getInstance();
        $firmId = $user->getFirmId();
        $firm = new Falcon_Record_X_Firm($firmId, false, false);
        $list = $firm->getActiveClients(true, $loadDeleted);
        $this->sendAnswer(new Falcon_Message($list));
    }

    /**
     * /action
     * Processing an action on supplier
     */
    public function actionAction()
    {
        $data = (array)$this->getJsonData();
        $action = isset($data['action']) ? $data['action'] : '';
        $supplier = isset($data['supplier']) ? $data['supplier'] : -1;
        $method = 'supplier' . ucfirst($action);
        if ($action && method_exists($this, $method)) {
            $this->$method($supplier);
        }
        $this->sendAnswer(new Falcon_Message());
    }

    /**
     * Resets a supplier account password
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierResetpassword($id)
    {
        $config = Zend_Registry::get('config');
        // get accound by firm id
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }

        $firm = new Falcon_Model_Firm($id);

        // retrieve users list
        $users = $firm->getFirmUsers();
        foreach ($users as $user) {
            // Change user password
            $newpassword = $user->getRandomPassword();
            $user->changePassword($newpassword);
            // sending an email with new password
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/psw_reset',
                [
                    'user' => $user,
                    'newpassword' => $newpassword
                ],
                $config->variables->notifyEmail,
                $user->getEmail()
            );
        }
    }

    /**
     * Sends email to given list of suppliers
     */
    public function mailingAction()
    {
        $data = $this->getRequest()->getPost();
        $mapper = Falcon_Mapper_Dn_Account::getInstance();

        // Message and suppliers list should not be empty
        $answer = new Falcon_Message();
        if (!isset($data['suppliers']) || !isset($data['message'])) {
            return $this->sendAnswer($answer->error(4042));
        } else {
            if (empty($data['suppliers']) || empty($data['message'])) {
                return $this->sendAnswer($answer->error(4042));
            }
        }

        $data['suppliers'] = json_decode($data['suppliers'], true);

        foreach ($data['suppliers'] as $id) {

            $supplier = $mapper->getAccountByIdFirmClient($id);
            if (!$supplier) {
                throw new Falcon_Exception('Supplier not found', 404);
            }

            $firm = new Falcon_Model_Firm($id);

            // retrieve users list
            $users = $firm->getFirmUsers();
            foreach ($users as $user) {
                // Not allways email exists
                if ($user->getEmail()) {
                    // Create works for each email
                    $subject = isset($data['title']) ? $data['title'] : null;

                    $message = [
                        'type' => 'email',
                        'send_to' => $user->getEmail(),
                        'subject' => $subject,
                        'message' => $data['message']
                    ];
                    Falcon_Amqp::sendTo('n.work', 'work.process', $message);
                }
            }
        }

        $this->sendAnswer($answer);
    }

    /**
     * Disables a suplier account
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierDisable($id)
    {
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }
        $supplier->set('state', 2);
        $mapper->updateAccount($supplier);
    }

    /**
     * Enables a suplier account
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierEnable($id)
    {
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }
        $supplier->set('state', 1);
        $mapper->updateAccount($supplier);
    }

    /**
     * Activates a supplier account
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierActivate($id)
    {
        $logger = Falcon_Logger::getInstance();
        $config = Zend_Registry::get('config');
        // first of all let's change 'dn_account' record
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }
        $supplier->set('state', 1);
        $mapper->updateAccount($supplier);

        // add x_access to our shared dn_account
        $access = new Falcon_Record_X_Access([
            'id_user' => 0,
            'id_firm' => $id,
            'right' => 'dn_account',
            'writeable' => 0,
            'shared' => 1,
            'id_object' => $supplier->get('id'),
        ]);
        $access->insert();

        $firm = new Falcon_Model_Firm($id);
        // then let's activate users in this firm and firm
        //$firm->setEnabled();

        // retrieve users list
        //$userMapper = Falcon_Mapper_X_User::getInstance();
        //$users = $userMapper->loadByFirm($id, false);
        $users = $firm->getFirmUsers();

        $worker = new Falcon_Action_Register();
        foreach ($users as $user) {
            //$user->setEnabled(true);
            $params = $worker->registerSupplierAccount($user->get('id'));
            if (!$params) {
                continue;
            }
            // notify user by email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_approve',
                [
                    'user' => $user,
                    'login' => $params['login'],
                    'password' => $params['password']
                ],
                $config->variables->notifyEmail,
                $user->getEmail()
            );
        }
    }

    /**
     * Remove supplier account
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierRemove($id)
    {
        $config = Zend_Registry::get('config');
        // first of all let's change 'dn_account' record
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }
        $supplier->set('state', 3);

        $mapper->updateAccount($supplier);

        // then let's send firm to trash
        $firm = new Falcon_Model_Firm($id);
        $firm->setEnabled(false);

        // retrieve users list
        $users = $firm->getFirmUsers();
        foreach ($users as $user) {
            // notify user by email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_remove',
                [
                    'user' => $user,
                    'manager' => Falcon_Model_User::getInstance()
                ],
                $config->variables->notifyEmail,
                $user->getEmail()
            );
        }
    }

    /**
     * Restore supplier account
     * @param {Number} $id Supplier firm identifier
     */
    private function supplierRestore($id)
    {
        $config = Zend_Registry::get('config');
        // first of all let's change 'dn_account' record
        $mapper = Falcon_Mapper_Dn_Account::getInstance();
        $supplier = $mapper->getAccountByIdFirmClient($id);
        if (!$supplier) {
            throw new Falcon_Exception('Supplier not found', 404);
        }
        $supplier->set('state', 1);
        $mapper->updateAccount($supplier, true);

        // then let's send firm to trash
        $firm = new Falcon_Model_Firm($id);
        $firm->setEnabled();

        // retrieve users list
        $users = $firm->getFirmUsers();
        foreach ($users as $user) {
            // notify user by email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/reg_restore',
                [
                    'user' => $user,
                    'manager' => Falcon_Model_User::getInstance()
                ],
                $config->variables->notifyEmail,
                $user->getEmail()
            );
        }

    }

    /**
     * /get
     * Returns data for specified supplier
     */
    public function getAction()
    {
        $params = (array)$this->getJsonData();
        $supplierId = isset($params['supplier']) ? $params['supplier'] : false;
        $data = [];
        if ($supplierId) {
            // Get firm
            $firm = new Falcon_Model_Firm($supplierId);
            $companyId = $firm->get('id_company');
            //$firm = new Falcon_Record_X_Firm($supplierId);
            //$company = new Falcon_Record_X_Company($firm->get('id_company'));

            $data['info'] = $firm->getFields();
            $companyData = (array)$firm->get('company');

            $bankMapper = Falcon_Mapper_X_Company_Bank_Account::getInstance();
            $bankRecords = $bankMapper->loadBy(function ($sql) use ($companyId) {
                $sql->where('id_company = ?', $companyId)
                    //->where('isprimary = ?', 1)
                    ->order('isprimary desc')
                    ->limit(1);
            });

            $bank = $bankRecords[0];

            $director = new Falcon_Record_X_Person($companyData['id_director']);
            $director = $director->toArray();

            // Rename properties
            $company = [];
            foreach ($companyData as $field => $value) {
                $company['f.' . $field] = $value;
            }

            $company['f.directorlastname'] = $director['lastname'];
            $company['f.directorfirstname'] = $director['firstname'];
            $company['f.directorsecondname'] = $director['secondname'];

            $company['f.bankname'] = $bank['bank_name'];
            $company['f.bik'] = $bank['bank_bik'];
            $company['f.bankaccount'] = $bank['payment_account'];
            $company['f.bankcorrespondentaccount']
                = $bank['correspondent_account'];

            $data['info'] = $data['info'] + $company;

            // Get firm users
            $users = $firm->getFirmUsers();
            //$userMapper = Falcon_Mapper_X_User::getInstance();
            //$users = $userMapper->loadByFirm($supplierId, false);

            if (count($users)) {
                $user = $users[0];
                $person = (array)$user->get('person');
                $data['info']['email']
                    = empty($person['email']) ? [] : $person['email'];
                $data['info']['phone']
                    = empty($person['phone']) ? [] : $person['phone'];
                $data['info']['shortname'] = $user->get('shortname');
            }


        }
        if (isset($data['info']['company']['id_address_physical'])) {
            $data['info']['f.addressactual'] = Falcon_Action_Address::getFull(
                $data['info']['company']['id_address_physical']);
        }
        if (isset($data['info']['company']['id_address_legal'])) {
            $data['info']['f.addresslegal'] = Falcon_Action_Address::getFull(
                $data['info']['company']['id_address_legal']);
        }
        $this->sendAnswer(new Falcon_Message($data));
    }
}
