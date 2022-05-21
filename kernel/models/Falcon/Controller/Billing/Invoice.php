<?php

/**
 * Billing invoice accept controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011 © Maprox LLC
 * @version    $Id: $
 * @link       $HeadURL: $
 */
abstract class Falcon_Controller_Billing_Invoice extends Falcon_Controller_Action
{
    protected $_skipAccessCheck = true;

    protected $_noCheckActions = ['success', 'fail'];

    const
        FAILED_INVOICE_EVENT_ID = 30;

    /**
     * Gathers data needed for send form
     * @return {Array}
     */
    abstract protected function getSendData();

    /**
     * Recieves notification about success
     */
    abstract protected function successAction();

    /**
     * Recieves notification about failure
     */
    abstract protected function failAction();

    /**
     * Transfers user payment form
     */
    protected function sendAction()
    {
        // Disabled because in IE the refferer is empty! (whut?)
        // TODO We need to determine why this is happening and
        // rewrite code to support IE
        /*if (stripos($_SERVER['HTTP_REFERER'],
            $this->view->serverUrl()) === false) {

            $this->_redirect('/admin#billing');
        }*/

        $this->_helper->layout->disableLayout();

        $this->view->payment = $this->getSendData();
    }

    /**
     * Updates account and history data on payment success
     * @param {Falcon_Record_Billing_Invoice} $invoice
     */
    protected function updateAccountSuccess($invoice)
    {
        $invoice->performPayment();

        $invoice->set('state', 1);
        $invoice->set('paydt', $invoice->dbDate());
        $invoice->update();
    }

    /**
     * Updates account and history data on pending payment
     * @param {Falcon_Record_Billing_Invoice} $invoice
     */
    protected function updateAccountWaiting($invoice)
    {
        $invoice->set('status', 2);
        $invoice->update();
    }

    /**
     * Stops on error, writes params
     * @param {Array} $data
     * @param {Integer} $invoiceId
     */
    protected function onError($data, $invoiceId)
    {
        $config = Zend_Registry::get('config')->payment;
        $config = $config->toArray();

        $logger = Zend_Log::factory($config['log']);
        $logger->emerg((int)$invoiceId . ': ' . serialize($data));

        $userId = Falcon_Model_User::getInstance()->getId();

        $event = new Falcon_Record_Ev_Integer();
        $event->setProps([
            'id_obj' => $userId,
            'id_event' => self::FAILED_INVOICE_EVENT_ID,
            'val' => (int)$invoiceId,
        ]);
        $event->insert();

        die();
    }
}
