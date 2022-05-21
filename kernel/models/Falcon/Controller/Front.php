<?php

/**
 * Rewritten Front controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Controller_Front extends Zend_Controller_Front
{
    /**
     * In controllers which must are cachable call
     * Falcon_Controller_Front::getInstance()->enableCache() в init
     * @var {Boolean}
     */
    protected $cachePermitted = false;

    /**
     * Retrieving an instance of this class (Singleton)
     * @return {Zend_Controller_Front} this
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Makes dispatch(), generates caching headers if needed
     */
    public function dispatchCached()
    {
        $this->returnResponse(true);
        $response = $this->dispatch();
        if ($response->getHttpResponseCode() == 200 && $this->cachePermitted) {
            $cachePeriod = 86400 * 365;
            $response->setHeader('Pragma', '', true);
            $response->setHeader('Expires',
                gmdate("D, d M Y H:i:s", time() + $cachePeriod) . " GMT", true);
            $response->setHeader('Cache-Control', 'max-age=' . $cachePeriod, true);
        }
        $response->sendResponse();
    }

    /**
     * Make dispatch() and return result
     */
    public function dispatchReturn()
    {
        $this->returnResponse(true);
        return $this->dispatch();
    }

    /**
     * Enables browser caching
     */
    public function enableCache()
    {
        $this->cachePermitted = true;
    }

    /**
     * Sets mode for usage without frontend
     */
    public function setCliMode()
    {
        // set test request/response objects
        $this->setRequest(new Falcon_Controller_Request_Simple());
        $this->setResponse(new Zend_Controller_Response_HttpTestCase());
        $this->setRouter(new Falcon_Controller_Router_Cli());
        Zend_Controller_Action_HelperBroker::addHelper(
            new Falcon_Controller_Action_Helper_RedirectorCli());
        Zend_Controller_Action_HelperBroker::getStaticHelper('json')
            ->suppressExit = true;
    }
}
