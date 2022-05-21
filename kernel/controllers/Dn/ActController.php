<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Rest controller
 */
class Dn_ActController extends Falcon_Controller_Action_Rest
{
    /**
     * Generates act for given date and firm
     * @url /dn_act/generate
     * @urlparam firm Firm identifier for wich act is issued
     * @urlparam date Date of the act (should be last day of the month)
     */
    public function generateAction()
    {
        Falcon_Access::checkWrite('dn_act');
        $answer = new Falcon_Message();
        // get input params
        $id_firm = intval($this->getParam('firm'));
        $date = $this->getParam('date');

        $m = Falcon_Mapper_X_Firm::getInstance();
        $firms = $m->loadBy(function ($sql) use ($id_firm) {
            $sql->where('id = ?', $id_firm);
        });
        if (empty($firms)) {
            $answer->error(Falcon_Exception::OBJECT_NOT_FOUND, [
                'firm' => $id_firm
            ]);
        } else {
            $firm = $firms[0];
            if ($firm['state'] !== Falcon_Record_Abstract::STATE_ACTIVE) {
                // skip inactive firms
                return $answer->error(Falcon_Exception::TEXT_ERROR,
                    ['Supplied firm is not active']);
            }
            $contract = $firm['contract'];
            if (!is_array($contract)
                || !isset($contract['num'])
                || !isset($contract['dt'])
            ) {
                // skip firms without contract
                return $answer->error(Falcon_Exception::TEXT_ERROR,
                    ['No contract for supplied firm']);
            }
            // At this time we support only russian contracts
            $zt = Zend_Registry::get('translator');
            $zt['zt']->setLocale('ru_RU');
            // generate act
            $period = new DateTime($date);
            $id_act = Falcon_Mapper_Dn_Act::getInstance()->generate([
                'period' => $period,
                'firm' => $firm
            ]);
            if ($id_act) {
                $answer->addParam('data', ['id' => $id_act]);
            } else {
                $answer->error(Falcon_Exception::SERVER_ERROR);
            }
        }
        return $answer;
    }
}