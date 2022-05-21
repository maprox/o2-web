<?php

/**
 * Billing processor
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Billing_Processor extends Falcon_Singleton
{
    /**
     * Performs billing payments calculation
     * @param string $dt [opt.] Debit date
     * @param int $firmId [opt.] Firm identifier
     */
    public function calculate($dt = null, $firmId = null)
    {
        try {
            Falcon_Action_Abstract::startTransaction();
            $this->calculateInner($dt, $firmId);
            Falcon_Action_Abstract::commitTransaction();
        } catch (Exception $E) {
            Falcon_Action_Abstract::rollbackTransaction();
            throw $E;
        }
    }

    /**
     * Calculates billing in transaction
     * @param string $dt [opt.] Debit date
     * @param int $firmId [opt.] Firm identifier
     */
    private function calculateInner($dt = null, $firmId = null)
    {
        if (!$firmId) {
            foreach (Falcon_Mapper_X_Firm::getInstance()->load([
                'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
            ], true, true) as $firm) {
                $this->calculateInner($dt, $firm['id']);
            }
            // exit from this method
            return;
        }
        // calculate billing for specified firm
        $previousDay = $dt ? false : true;
        $dt = $dt ? $dt : date('Y-m-d');
        $debit_dt = new DateTime($dt);
        if ($previousDay) {
            $debit_dt->sub(new DateInterval('P1D')); // previous day
        }
        $debit_dt_str = $debit_dt->format(DB_DATE_FORMAT);

        $logger = Falcon_Logger::getInstance();
        $logger->log('billing', "Billing for firm: '" . $firmId .
            "' on date '" . $debit_dt_str . "'");

        $firm = new Falcon_Record_X_Firm(['id' => $firmId]);
        if (!$firm->isLoaded()) {
            // invalid firm identifier
            $logger->log('billing', '- Invalid firm identifier.');
            return;
        }
        if ($firm->get('billing_disabled')) {
            // billing for firm is diabled
            $logger->log('billing', '- Billing is disabled.');
            return;
        }
        // loop for firm accounts and calculate fees
        $accounts = Falcon_Mapper_Billing_Account::getInstance()->load([
            'id_firm = ?' => $firmId,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ], true, true);
        if (empty($accounts)) {
            // accounts for the firm not found
            $logger->log('billing', '- Accounts not found.');
            return;
        }
        foreach ($accounts as $account) {
            $this->calculateForAccount($account['id'], $debit_dt_str);
        }
    }

    /**
     * Calculates billing for specified account
     * @param int $accountId
     * @param string $dt
     */
    private function calculateForAccount($accountId, $dt)
    {
        $logger = Falcon_Logger::getInstance();
        // checks if account was already billed on specified date
        $billed = Falcon_Mapper_Billing_History::getInstance()->load([
            'id_account = ?' => $accountId,
            'debitdt::date = ?::date' => $dt
        ]);
        if (!empty($billed)) {
            $logger->log('billing', '- Account ' . $accountId .
                ' have already billed on this date');
            return;
        }

        // insert record into billing_history table
        $billingHistoryId =
            Falcon_Db_Util::getNextSequenceId('billing_history_id_seq');
        $record = new Falcon_Record_Billing_History();
        $record->setProps([
            'id' => $billingHistoryId,
            'id_account' => $accountId,
            'balance' => 0,
            'sum' => 0,
            'note' => 'Daily debiting',
            'debitdt' => $dt,
            'state' => 0
        ]);
        $record->insert();

        // let's calculate sum of write-off for the specified billing account
        $writeoff = 0;
        // CALCULATE
        $m = Falcon_Billing_Calculator::getInstance();
        foreach ($m->calculate($accountId, $dt) as $detail) {
            // insert detail record to the database
            $detail->set('id_history', $billingHistoryId);
            $detail->insert();

            // TODO applying discounts HERE?
            //
            $writeoff += (float)$detail->get('payedcount') *
                (float)$detail->get('cost');
        }
        $record->set('sum', -$writeoff);
        $record->update();
    }

    /**
     * Performs billing writeoff
     * @param int $firmId [opt.] Firm identifier
     */
    public function writeoff($firmId = null)
    {
        try {
            Falcon_Action_Abstract::startTransaction();
            $this->writeoffInner($firmId);
            Falcon_Action_Abstract::commitTransaction();
        } catch (Exception $E) {
            Falcon_Action_Abstract::rollbackTransaction();
            throw $E;
        }
    }

    /**
     * Performs billing writeoff within transaction
     * @param int $firmId [opt.] Firm identifier
     */
    public function writeoffInner($firmId = null)
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('billing', 'Writeoff is started' .
            ($firmId ? ' for firm with id=' . $firmId : '') . '.');
        $currentTimestamp = date('Y-m-d H:i:s');
        $params = [
            'state = ?' => Falcon_Record_Abstract::STATE_UNAPPROVED
        ];
        if ($firmId) {
            $params['id_firm = ?'] = $firmId;
        }
        foreach (Falcon_Mapper_Billing_History::getInstance()
                     ->load($params, 'debitdt') as $billingHistory) {
            $accountId = $billingHistory->get('id_account');
            $account = new Falcon_Record_Billing_Account($accountId);
            $writeoff = $billingHistory->get('sum');
            $balancePrev = $account->get('balance');
            $balanceNext = $balancePrev + $writeoff;
            $billingHistory->setProps([
                'balance' => $balanceNext,
                'state' => Falcon_Record_Abstract::STATE_ACTIVE,
                'dt' => $currentTimestamp
            ]);
            $billingHistory->update();
            $account->set('balance', $balanceNext);
            $account->update();
            // log writeoff for this account
            $logger->log('billing', '- Account ' . $accountId, [
                'writeoff' => $writeoff,
                'balancePrev' => $balancePrev,
                'balanceNext' => $balanceNext
            ]);
        }
        $logger->log('billing', 'Writeoff is done.');

        // Notify current online users that account balance have been changed
        $onlineUsers = Falcon_Action_X_User::getOnlineUsers();
        foreach ($onlineUsers as $userId) {
            Falcon_Cacher::getInstance()->drop('settings', (int)$userId);
        }
        Falcon_Action_Update::add([
            'id_user' => $onlineUsers,
            'alias' => 'settings'
        ]);
        Falcon_Action_Update::add([
            'id_user' => $onlineUsers,
            'alias' => 'billing_account'
        ]);
    }
}