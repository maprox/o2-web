<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class Dn_Analytic_ReportController extends Falcon_Controller_Action_Rest
{
    /**
     * Returns data for the analytic report
     */
    public function dataAction()
    {
        $user = Falcon_Model_User::getInstance();
        // TODO: Needs access refactoring
        if (!$user->hasRight('admin_dn_offer')) {
            return new Falcon_Message();
        }
        $mapper = Falcon_Mapper_Dn_Analytic_Report::getInstance();
        $records = $mapper->collectData($user->getFirmId(), [
            'period_sdt' => $this->getParam('period_sdt'),
            'period_edt' => $this->getParam('period_edt')
        ]);
        return new Falcon_Message($records);
    }

    /**
     * Returns data for the analytic report
     */
    public function tenderAction()
    {
        $user = Falcon_Model_User::getInstance();
        // TODO: Needs access refactoring
        if (!$user->hasRight('admin_dn_offer')) {
            return new Falcon_Message();
        }
        $mapper = Falcon_Mapper_Dn_Analytic_Report::getInstance();
        $records = $mapper->getTenderData($this->getParam('id_tender'));
        return new Falcon_Message($records);
    }
}