<?php

/**
 * Table "dn_act"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Dn_Act extends Falcon_Table_Common
{
    /**
     * Returns cost of the act for the supplied date
     * @param int $firmId Firm identifier for wich we will calculate act cost
     * @param DateTime $sdt Period start
     * @param DateTime $edt Period end
     * @return float
     */
    public function getActCost($firmId, DateTime $sdt, DateTime $edt)
    {
        $db = $this->_db;
        // compile base sql
        $cost = $db->fetchOne($db
            ->select()
            ->from(
                ['ba' => 'billing_account'],
                [new Zend_Db_Expr('-SUM(bh.sum) as cost')]
            )
            ->join(
                ['bh' => 'billing_history'],
                'bh.id_account = ba.id',
                []
            )
            ->where('ba.id_firm = ?', $firmId)
            ->where('ba.state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
            ->where('(bh.sum < 0 and bh.debitdt is not null) ' .
                ' or (bh.note = \'Возмещение средств\')')
            ->where('bh.dt::date >= ?', $sdt->format('Y-m-d'))
            ->where('bh.dt::date <= ?', $edt->format('Y-m-d'))
        );
        $previousActCost = $db->fetchOne($db
            ->select()
            ->from(
                ['a' => 'dn_act'],
                [new Zend_Db_Expr('SUM(ai.cost * ai.count)')]
            )
            ->join(
                ['ai' => 'dn_act_item'],
                'ai.id_act = a.id',
                []
            )
            ->where('a.id_firm = ?', $firmId)
            ->where('a.state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
            ->order('a.dt desc')
            ->group('a.dt')
            ->limit(1)
        );
        return ($previousActCost < 0) ? $cost + $previousActCost : $cost;
    }
}