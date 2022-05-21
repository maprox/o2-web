<?php

/**
 * Billing invoice webmoney controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Billing_Invoice_WebmoneyController extends Falcon_Controller_Billing_Invoice
{
    /**
     * Gathers data needed for send form
     * @return {Array}
     */
    protected function getSendData()
    {
        $data = $this->_getAllParams();
        $config = Zend_Registry::get('config')->payment;

        return [
            'message' => $config->message,
            'wallet' => $config->webmoney->wallet,
            'amount' => $data['amount'],
            'id' => $data['id'],
        ];
    }

    /**
     * Not implemented yet
     */
    protected function successAction()
    {
    }

    /**
     * Not implemented yet
     */
    protected function failAction()
    {
    }
}
