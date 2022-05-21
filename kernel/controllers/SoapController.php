<?php

/**
 * SOAP service controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class SoapController extends Zend_Controller_Action
{
    /**
     * Initialization
     */
    public function init()
    {
        // keep the app from sending a view to the user-agent
        $this->_helper->viewRenderer->setNoRender();
    }

    /**
     * soap
     * soap/index
     */
    public function indexAction()
    {
        if (isset($_GET['wsdl'])) {
            // return the WSDL
            $this->handleWSDL();
        } else {
            // handle SOAP request
            $this->handleSOAP();
        }
    }

    /**
     * Returns a WSDL
     */
    private function handleWSDL()
    {
        $autodiscover = new Zend_Soap_AutoDiscover(
            'Zend_Soap_Wsdl_Strategy_ArrayOfTypeComplex');
        //$autodiscover->setClass('BankStatementAPIClass');
        //$autodiscover->handle();
    }

    /**
     * Handles SOAP request
     */
    private function handleSOAP()
    {
        ini_set("soap.wsdl_cache_enabled", "0");  // disable the wsdl cache.
        $server = new SoapServer(null,
            ['uri' => "https://observer.maprox.net/soap?wsdl"]);
        //$server->setClass("BankStatementAPIClass");
        //$server->handle();
    }

    /**
     * Unknown action redirects to base url
     *//*
	public function noRouteAction()
	{
		$this->_redirect('/');
	}*/
}