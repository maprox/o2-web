<?php

/**
 * Class for working with billing invoices
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Billing_Invoice extends Falcon_Action_Rest_Child
{
    /**
     * Parent table config for checking access
     * like "array(fieldName => tableName)"
     * @var array
     */
    //public static $parentConfig = array('id_account' => 'billing_account');

    /**
     * Returns get query function parameters
     * @return Mixed[]
     */
    /*protected function getQueryParams()
    {
        return array('account' => $this->getParam('accountId'));
    }*/

    /**
     * Returns get query function for list
     * @param array $params Array of params
     * @return function
     */
    /*protected function getQueryListFn($params)
    {
        $accountId = $params['account'];
        $firmId = $this->getFirmId();
        $filter = $this->getParam('$filter');
        $showTrashed = $this->getParam('$showTrashed');
        $fn = function ($sql) use ($firmId, $accountId, $filter, $showTrashed) {
            $sql
                ->where('t.id_account = ?', $accountId)
            ;
            if (!$showTrashed)
            {
                $sql
                    ->where('t.state != ?', 3)
                ;
            }
            Falcon_Odata_Filter::apply($filter, $sql);
            Falcon_Access::addAccessSql($sql, $firmId);
        };

        return $fn;
    }*/

    /**
     * Fires when status is updated, refills account
     * @param type $c
     * @param Mixed $value
     */
    protected function onUpdateStatus($c, $value)
    {
        if ($value == Falcon_Record_Abstract::STATE_DELETED &&
            $c->get('status') != Falcon_Record_Abstract::STATE_DELETED
        ) {
            $c->performPayment();
        }

        return true;
    }
}
