<?php

/**
 * Billing invoice RBK Money controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class Billing_Invoice_RbkmoneyController extends Falcon_Controller_Billing_Invoice
{
    /**
     * Gathers data needed for send form
     * @return {Array}
     */
    protected function getSendData()
    {
        $data = $this->_getAllParams();
        $config = Zend_Registry::get('config')->payment;
        $user = Falcon_Model_User::getInstance();

        $settings = $user->getSettings();
        $lang = $settings['p.lng_alias'];
        $message = $config->message->$lang;
        if (empty($message)) {
            $message = $config->message->ru;
        }

        return [
            'message' => sprintf($message, $data['id']),
            'wallet' => $config->rbkmoney->wallet,
            'shopId' => $config->rbkmoney->shopId,
            'email' => $user->getEmail(),
            'amount' => $data['amount'],
            'preference' => $data['preference'],
            'userId' => $user->getId(),
            'id' => $data['id'],
        ];
    }

    /**
     * Recieves notification from rbkmoney
     */
    protected function successAction()
    {
        $data = $this->_getAllParams();

        $logger = Falcon_Logger::getInstance();
        $logger->log('rbk', $data);

        $invoice = new Falcon_Record_Billing_Invoice((int)$data['orderId']);
        if ($invoice->get('status') == 3) {
            // Повторный отсыл данных, не принимаем
            die;
        }

        $config = Zend_Registry::get('config')->payment;
        $hash = $this->buildHash($data, $config->rbkmoney->secretKey);

        if (empty($invoice) ||
            $data['eshopId'] != $config->rbkmoney->shopId ||
            $data['recipientCurrency'] != 'RUR' ||
            $data['hash'] != $hash ||
            $invoice->get('amount') > $data['recipientAmount']
        ) {
            $logger->log('rbk', [
                $data['eshopId'],
                $config->rbkmoney->shopId,
                $data['recipientCurrency'],
                $data['hash'], $hash,
                $invoice->get('amount'),
                $data['recipientAmount']
            ]);
            $this->onError($data, $data['eshopId']);
        }

        $invoice->set('amount', $data['recipientAmount']);

        $invoice->getTrigger('logged')->setForceUsers([
            (int)$data['userField_1']
        ]);
        if ($data['paymentStatus'] == 5) {
            $this->updateAccountSuccess($invoice);
        } elseif ($data['paymentStatus'] == 3) {
            $this->updateAccountWaiting($invoice);
        }
    }

    /**
     * Builds RBK hash string
     */
    protected function buildHash($data, $key)
    {
        $array = [
            (string)$data['eshopId'],
            (string)$data['orderId'],
            (string)$data['serviceName'],
            (string)$data['eshopAccount'],
            (string)$data['recipientAmount'],
            (string)$data['recipientCurrency'],
            (string)$data['paymentStatus'],
            (string)$data['userName'],
            (string)$data['userEmail'],
            (string)$data['paymentData'],
            (string)$key,
        ];

        return md5(implode('::', $array));
    }

    /**
     * Not implemented yet
     */
    protected function failAction()
    {
    }
}
