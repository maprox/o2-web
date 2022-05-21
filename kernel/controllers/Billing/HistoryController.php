<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Billing history controller
 */
class Billing_HistoryController extends Falcon_Controller_Action
{
    /**
     * Returns billing history entries
     */
    public function get()
    {
        $user = Falcon_Model_User::getInstance();
        $answer = new Falcon_Message();

        // -----------------------------------
        // loading input parameters
        //
        $accountId = (int)json_decode($this->_getParam('accountId')) ?: 0;
        $pageAndOrderParams = $this->getPageAndOrderParams();

        // Check if user have billing_manager right
        if (!$user->hasRight('billing_manager')) {
            return $answer;
        }

        // -----------------------------------
        // loading data
        //
        if ($accountId) {
            $account = new Falcon_Record_Billing_Account($accountId);

            // Check if user have the same firm Id
            if ($user->get('id_firm') !== $account->get('id_firm')
                && !Falcon_Access::haveAdminRight($user->getId())
            ) {
                return $answer;
            }

            $records = $account->loadHistory(true, $pageAndOrderParams);
            $answer->addParam('data', $records);
            $m = Falcon_Mapper_Billing_History::getInstance();
            $answer->addParam('count', $m->getCountByAccountId($accountId));
        }
        return $answer;
    }
}