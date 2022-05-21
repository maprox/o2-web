<?php

/**
 * Account controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class Billing_AccountController extends Falcon_Controller_Action_Rest
{
    /**
     * remove
     */
    public function removeAction()
    {
        // input data
        $data = $this->getJsonData();
        $user = Falcon_Model_User::getInstance();
        $answer = new Falcon_Message();
        if (!$user->hasRight('admin_billing_account')) {
            return $this->sendAnswer($answer->error(403));
        }
        if (!isset($data->id)) {
            return $this->sendAnswer($answer->error(4042));
        }
        Falcon_Mapper_Billing_Account::getInstance()->trashRecord($data->id);
        $this->sendAnswer($answer);
    }

    /**
     * remove
     */
    public function disableAction()
    {
        // input data
        $firmId = (int)json_decode($this->_getParam('id')) ?: 0;
        $value = (int)json_decode($this->_getParam('value')) ?: 0;
        $user = Falcon_Model_User::getInstance();
        $answer = new Falcon_Message();
        if (!$user->hasRight('billing_disable_billing')) {
            return $this->sendAnswer($answer->error(403));
        }
        if (empty($firmId)) {
            return $this->sendAnswer($answer->error(4042));
        }

        $firm = new Falcon_Record_X_Firm($firmId);
        $firm->set('billing_disabled', $value);
        $firm->update();

        $this->sendAnswer($answer);
        //$firm = new Falcon_Model_Firm($firmId);
        //$this->sendAnswer($firm->setFields(array('billing_disabled'=> $value)));
    }


    /**
     * add
     */
    public function addAction()
    {
        // input data
        $data = $this->getJsonData();
        $user = Falcon_Model_User::getInstance();
        $answer = new Falcon_Message();
        if (!$user->hasRight('admin_billing_account')) {
            return $this->sendAnswer($answer->error(403));
        }
        if (empty($data->id_firm)) {
            return $this->sendAnswer($answer->error(4042));
        }
        $account = new Falcon_Record_Billing_Account((array)$data);
        $id = $account->insert()->getId();
        $data = [['id' => $id]];
        $answer->addParam('data', $data);
        $this->sendAnswer($answer);
    }

    /**
     * Change account limit
     */
    protected function changelimitAction()
    {
        $logger = Falcon_Logger::getInstance();
        $data = $this->_getAllParams();
        $answer = new Falcon_Message();

        if (empty($data['accountId'])) {
            $this->sendAnswer($answer->error(4042));
        }

        try {
            $account = new Falcon_Record_Billing_Account(
                (int)$data['accountId']);

            if ($data['permanent']) {
                $account->setLimit($data['value']);
            } else {
                $time = strtotime($data['date']);
                $data['date'] = date(DB_DATE_FORMAT, $time);

                if ($time < time()) {
                    $this->sendAnswer($answer->error(4042));
                }

                $account->setTempLimit($data['value'], $data['date']);
            }

            $answer->addParam('data', [
                'edt' => $account->getLimitDate(),
                'value' => $account->getLimit(),
                'accountId' => $data['accountId'],
            ]);
        } catch (Falcon_Exception $e) {
            if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                $answer->error(403);
            } else {
                throw $e;
            }
        }

        // Maybe enable firm

        $mba = Falcon_Mapper_Billing_Account::getInstance();
        $mba->maybeEnableUnpaidFirm($account->get('id_firm'));

        // Change x_flag flag
        $m = Falcon_Mapper_X_Flag::getInstance();
        $m->changeFlag(
            'billing_account',
            $account->get('id'),
            Falcon_Mapper_Billing_Account::notifyLimitFlag,
            false
        );

        //TODO: limit chenged
        $this->sendAnswer($answer);
    }

    /**
     * Change account tariff
     */
    protected function changetariffAction()
    {
        $data = $this->_getAllParams();
        $answer = new Falcon_Message();

        if (empty($data['accountId'])) {
            $this->sendAnswer($answer->error(4042));
        }

        try {
            $account = new Falcon_Record_Billing_Account((int)$data['accountId']);
            $account->setTariff((int)$data['value'])->update();
            $tariff = $account->getTariff();
            $answer->addParam('data', [
                'value' => $tariff->get('id_tariff'),
                'sdt' => $tariff->get('sdt'),
                'name' => $tariff->get('name'),
            ]);
        } catch (Falcon_Exception $e) {
            if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                $answer->error(403);
            } else {
                throw $e;
            }
        }

        $this->sendAnswer($answer);
    }

    /**
     * Change account balance
     */
    protected function changebalanceAction()
    {
        $data = $this->_getAllParams();
        $answer = new Falcon_Message();

        if (empty($data['accountId'])) {
            $this->sendAnswer($answer->error(4042));
        }

        try {
            $note = empty($data['note']) ? $data['type'] : $data['note'];

            $account = new Falcon_Record_Billing_Account((int)$data['accountId']);
            $account->changeBalance((float)$data['value'], $note)->update();

            $answer->addParam('data', [
                'balance' => $account->get('balance')
            ]);
        } catch (Falcon_Exception $e) {
            if ($e->getCode() == Falcon_Exception::ACCESS_VIOLATION) {
                $answer->error(403);
            } else {
                throw $e;
            }
        }

        // Change flags
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

        // Notify users (balance changed by administrator)
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
                'amount' => $data['value'],
                'note' => $note
            ];
            $user->notify('balance_change', $params);
        }

        $this->sendAnswer($answer);
    }
}
