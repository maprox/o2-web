<?php

/**
 * Class of invoice record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox Ltd
 */
class Falcon_Record_Billing_Invoice extends Falcon_Record_Abstract
{
    const INVOICE_EXPIRATION = '+20 days';

    /**
     * Record of billing account, invoice associated with
     * @var {Falcon_Record_Billing_Account}
     */
    protected $account;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_account',
        'id_payment_type',
        'sdt',
        'edt',
        'paydt',
        'amount',
        'note',
        'status',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged'];

    /**
     * Table fields that need special access to be modified
     * Format is 'field' => access needed
     * @var String[]
     */
    public static $restrictedFields = [
        'status' => 'billing_invoice_paid',
        'paydt' => 'billing_invoice_paid',
    ];

    /**
     * Returns alias for update
     * @return {String}
     */
    protected function getAlias()
    {
        $user = Falcon_Model_User::getInstance();
        $account = $this->getAccount();
        if ($account->get('id_firm') != $user->getFirmId()) {
            return 'billing_account_children_update';
        }
        return 'billing_account_update';
    }

    /**
     * Returns account, invoice associated with
     * @return {Falcon_Record_Billing_Account}
     */
    protected function getAccount()
    {
        if (empty($this->account)) {
            $this->account =
                new Falcon_Record_Billing_Account($this->get('id_account'));
        }

        return $this->account;
    }

    /**
     * Returns associated firm id
     * @return {Integer}
     */
    public function getIdFirm()
    {
        $account = $this->getAccount();
        return $account->get('id_firm');
    }

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        $this->set('sdt', date(DB_DATE_FORMAT));
        $this->set('edt', date(DB_DATE_FORMAT, strtotime(self::INVOICE_EXPIRATION)));
        $this->set('status', 1);
        $this->set('state', 1);

        return parent::insert();
    }


    /**
     * Performs actions needed when invoice is succesfully processed
     * Refills account, creates history
     */
    public function performPayment()
    {
        $logger = Falcon_Logger::getInstance();
        if ($this->get('status') == 3) {
            return;
        }

        $config = Zend_Registry::get('config')->payment;

        $account = $this->getAccount();
        $balance = $account->get('balance');
        $balance = $balance + $this->get('amount');

        $account->set('balance', $balance);
        $account->update();

        $firm = new Falcon_Model_Firm($this->getIdFirm());
        $users = $firm->getFirmUsers();
        $usersIds = [];
        foreach ($users as $user) {
            $usersIds[] = $user->getId();
            Falcon_Cacher::getInstance()->drop('settings', $user->getId());
        }

        $history = new Falcon_Record_Billing_History();
        $history->setProps([
            'id_account' => $account->getId(),
            'id_invoice' => $this->getId(),
            'balance' => $account->get('balance'),
            'sum' => $this->get('amount'),
            'note' => Falcon_Record_Billing_History::SUCCESS_MESSAGE
        ]);
        $history->insert();

        $this->set('status', 3)->update();

        // Reset low balance notification flags
        $m = Falcon_Mapper_X_Flag::getInstance();
        $m->changeFlag(
            'billing_account',
            $account->get('id'),
            Falcon_Mapper_Billing_Account::notifyZeroFlag,
            false
        );
        $m->changeFlag(
            'billing_account',
            $account->get('id'),
            Falcon_Mapper_Billing_Account::notifyLimitFlag,
            false
        );

        // Maybe enable firm
        $mba = Falcon_Mapper_Billing_Account::getInstance();
        $mba->maybeEnableUnpaidFirm($account->get('id_firm'));

        // Notify users (balance changed by invoice)
        $firm = new Falcon_Model_Firm($account->get('id_firm'));
        $users = $firm->getFirmUsers();
        $firm = $firm->getFields();
        foreach ($users as $user) {
            if (!$user->hasRight('billing_manager')) {
                continue;
            }
            $params = [
                'user' => $user,
                'firm' => $firm,
                'account' => $account->toArray(),
                'amount' => $this->get('amount'),
                'invoice_num' => $this->getId()
            ];
            $user->notify('balance_change', $params);
        }

        // Notify users about settings changes
        Falcon_Action_Update::add([
            'id_user' => $usersIds,
            'alias' => 'settings'
        ]);
    }
}
