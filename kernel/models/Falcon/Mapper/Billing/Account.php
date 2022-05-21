<?php

/**
 * Class of account mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Billing_Account extends Falcon_Mapper_Common
{
    /**
     * Notify N days before
     * @var type
     */
    protected $balanceLimitDays = 5;

    /**
     * Flag type for zero balance notification
     */
    const notifyZeroFlag = 1;

    /**
     * Flag type for limit balance notification
     */
    const notifyLimitFlag = 2;

    /**
     * Load records by a supplied query function
     * @param function $queryFn
     * @param array $params Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $records = parent::loadBy($queryFn, $queryParams, $addLinkedJoined, $addLinked);
        foreach ($records as &$record) {
            $record = array_merge($record,
                current($this->loadWithTariffByAccountId($record['id'])));
        }
        return $records;
    }

    /**
     * Notify users about low balance
     */
    public function notifyLowBalance()
    {
        $config = Zend_Registry::get('config');
        $logger = Falcon_Logger::getInstance();

        $accounts = $this->needBalanceNotify($this->balanceLimitDays);
        foreach ($accounts as $account) {
            $notifyZero = $account['below_zero'];
            $notifyLimit = $account['below_limit'];

            if ($notifyZero && !$notifyLimit) {
                $daysLeft = ceil(
                    ($account['balance']) / -($account['last_writeoff'])
                );
            } else {
                $daysLeft = ceil(
                    ($account['balance'] - $account['actuallimit'])
                    / -($account['last_writeoff'])
                );
            }

            $balanceAfter = $account['balance']
                + ($daysLeft * $account['last_writeoff']);
            $account['balance_after'] = $balanceAfter;

            $account['limitvalue'] = $account['actuallimit'];

            // Sending notification to firm users with right billing_manager
            $firm = new Falcon_Model_Firm($account['id_firm']);
            $users = $firm->getFirmUsers();
            $firm = $firm->getFields();
            foreach ($users as $user) {
                if (!$user->hasRight('billing_manager')) {
                    continue;
                }
                $params = [
                    'user' => $user,
                    'firm' => $firm,
                    'account' => $account,
                    'balance_limit_days' => $daysLeft
                ];
                $user->notify('balance_limit', $params);
            }

            // Change x_flag entry
            // Notify about comming zero balance only once
            if ($notifyZero) {
                $record = new Falcon_Record_X_Flag([
                    'entity_table' => 'billing_account',
                    'id_entity' => $account['id'],
                    'type' => self::notifyZeroFlag
                ]);

                if ($record->isLoaded()) {
                    $record->set('value', true);
                    $record->update();
                } else {
                    $record->set('value', true);
                    $record->insert();
                }
            }

            // Don't change flag - notify until firm will be disabled
            // or balance will be filled up
            // Change x_flag entry for "limit" notification
            /*if ($notifyLimit) {
                $record = new Falcon_Record_X_Flag(array(
                    'entity_table' => 'billing_account',
                    'id_entity' => $account['id'],
                    'type' => self::notifyLimitFlag
                ));

                if ($record->isLoaded()) {
                    $record->set('value', true);
                    $record->update();
                } else {
                    $record->set('value', true);
                    $record->insert();
                }
            }*/
        }
    }

    /**
     * Returns low balance accounts, that has not been notified
     * @param {Integer} $balanceLimitDays Notify before N days
     */
    public function needBalanceNotify($balanceLimitDays)
    {
        return $this->getTable()->needBalanceNotify($balanceLimitDays);
    }

    /**
     * Returns accounts that need to be disabled
     * Balance is lower than limit value
     * @return Array
     */
    public function getNonpaymentEnabledAccounts()
    {
        return $this->getTable()->getNonpaymentEnabledAccounts();
    }

    /**
     * Returns nonpayment accounts for firm
     * @param Integer $firmId
     * @return Array
     */
    public function getNonpaymentAccountsForFirm($firmId)
    {
        return $this->getTable()->getNonpaymentAccountsForFirm($firmId);
    }

    /**
     * Check if account's firm should be enabled and enables it
     * @param type $accountId
     */
    public function maybeEnableUnpaidFirm($firmId)
    {
        $logger = Falcon_Logger::getInstance();

        $mw = Falcon_Mapper_N_Work::getInstance();
        // Firm
        $firmRecord = new Falcon_Record_X_Firm($firmId);
        // If not disabled exiting
        if (!$firmRecord->get('have_unpaid_account')) {
            return;
        }

        // If no nonpayment accounts enable firm
        if (!count($this->getNonpaymentAccountsForFirm($firmId))) {
            // Enable firm
            $firmRecord->set('have_unpaid_account', 0);
            $firmRecord->update();

            // Remove "unpaid" popup works
            $firmModel = new Falcon_Model_Firm($firmId);
            $userIds = [];
            foreach ($firmModel->getFirmUsers() as $user) {
                $userIds[] = (string)$user->get('id');
            }

            // Unpaid type
            $unpaidTypeId
                = Falcon_Mapper_N_Notification_Action_Type::getInstance()
                ->getIdByType('unpaid');

            $unpaidWorks = $mw->load([
                'send_to IN (?)' => $userIds,
                'id_notification_action_type = ?' => $unpaidTypeId
            ]);

            foreach ($unpaidWorks as $unpaidWork) {
                $unpaidWork->set('state',
                    Falcon_Record_Abstract::STATE_DELETED);
                $unpaidWork->update();
            }

            $logger->log('unpaid', 'Firm has been enabled: ' . $firmId);
        }
    }

    /**
     * Get accounts with tariff by firm identifier
     * @param Integer $firmId
     * @return Mixed[]
     */
    public function loadWithTariff($firmId)
    {
        $records = $this->getTable()->loadWithTariff($firmId);
        $return = [];
        foreach ($records as $record) {
            $tariff = [
                'id_tariff' => $record['id_tariff'],
                'tariff' => $record['tariff'],
                'tariff_sdt' => $record['tariff_sdt'],
                'tariff_edt' => $record['tariff_edt'],
                'id_package' => $record['id_package']
            ];
            unset($record['id_tariff'], $record['tariff'],
                $record['tariff_sdt'], $record['tariff_edt']);

            if (empty($return[$record['id']])) {
                $return[$record['id']] = $record;
                $return[$record['id']]['tariff'] = [];
            }
            $return[$record['id']]['tariff'][] = $tariff;
        }

        $currentDay = mktime(0, 0, 0, date('n'), date('j'));
        foreach ($return as &$item) {
            foreach ($item['tariff'] as $tariff) {
                $sdt = strtotime($tariff['tariff_sdt']);
                $edt = $tariff['tariff_edt'] ? strtotime($tariff['tariff_edt']) : 0;
                if ($tariff['id_tariff'] &&
                    $sdt <= $currentDay && (!$edt || $edt > $currentDay)
                ) {
                    $item = array_replace($item, $tariff);
                }
                if (!$edt) {
                    $item['new_tariff'] = $tariff;
                }
            }

            if (empty($item['id_tariff'])) {
                foreach ($item['tariff'] as $tariff) {
                    if (!$tariff['tariff_edt']) {
                        $item = array_merge($item, $tariff);
                        unset($item['new_tariff']);
                    }
                }
            }

            if (empty($item['new_tariff']['id_tariff']) ||
                $item['new_tariff']['id_tariff'] == $item['id_tariff']
            ) {
                unset($item['new_tariff']);
            }
        }

        return array_values($return);
    }


    /**
     * Get accounts with tariff by billing_account identifier
     * @param Integer $accountId
     * @return Mixed[]
     */
    public function loadWithTariffByAccountId($accountId)
    {
        $records = $this->getTable()->loadWithTariffByAccountId($accountId);
        $return = [];
        foreach ($records as $record) {
            $tariff = [
                'id_tariff' => $record['id_tariff'],
                'tariff' => $record['tariff'],
                'tariff_sdt' => $record['tariff_sdt'],
                'tariff_edt' => $record['tariff_edt'],
                'id_package' => $record['id_package']
            ];
            unset($record['id_tariff'], $record['tariff'],
                $record['tariff_sdt'], $record['tariff_edt']);

            if (empty($return[$record['id']])) {
                $return[$record['id']] = $record;
                $return[$record['id']]['tariff'] = [];
            }
            $return[$record['id']]['tariff'][] = $tariff;
        }

        $currentDay = mktime(0, 0, 0, date('n'), date('j'));
        foreach ($return as &$item) {
            foreach ($item['tariff'] as $tariff) {
                $sdt = strtotime($tariff['tariff_sdt']);
                $edt = $tariff['tariff_edt'] ? strtotime($tariff['tariff_edt']) : 0;
                if ($tariff['id_tariff'] &&
                    $sdt <= $currentDay && (!$edt || $edt > $currentDay)
                ) {
                    $item = array_replace($item, $tariff);
                }
                if (!$edt) {
                    $item['new_tariff'] = $tariff;
                }
            }

            if (empty($item['id_tariff'])) {
                foreach ($item['tariff'] as $tariff) {
                    if (!$tariff['tariff_edt']) {
                        $item = array_merge($item, $tariff);
                        unset($item['new_tariff']);
                    }
                }
            }

            if (empty($item['new_tariff']['id_tariff']) ||
                $item['new_tariff']['id_tariff'] == $item['id_tariff']
            ) {
                unset($item['new_tariff']);
            }
        }

        return array_values($return);
    }

    /**
     * Gets account limit, checking permanent limit and actual temporary limits
     * @param Integer $accountId
     * @return Mixed[]
     */
    public function getAccountLimit($accountId)
    {
        $data = $this->getTable()->getAccountLimit($accountId);
        if (!empty($data)) {
            return current(current($data));
        }
        return 0;
    }
}
