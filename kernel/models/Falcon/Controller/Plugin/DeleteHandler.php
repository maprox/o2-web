<?php

/**
 * Plugin to digest PUT request body and make params available just like POST
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Controller_Plugin_DeleteHandler extends Zend_Controller_Plugin_Abstract
{
    /**
     * Before dispatching, digest PUT request body and set params
     *
     * @param Zend_Controller_Request_Abstract $request
     */
    public function preDispatch(Zend_Controller_Request_Abstract $request)
    {
        if (!$request instanceof Zend_Controller_Request_Http) {
            return;
        }

        if ($this->_request->isDelete()) {
            $putParams = [];
            parse_str($this->_request->getRawBody(), $putParams);
            $request->setParams($putParams);
        }
    }
}
