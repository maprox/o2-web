<?php

/**
 * Router for CLI.
 * Does nothing, don't need URI, lets us have our way with Request object.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Router_Cli implements Zend_Controller_Router_Interface
{
    public function route(Zend_Controller_Request_Abstract $dispatcher)
    {
    }

    public function assemble($userParams, $name = null, $reset = false, $encode = true)
    {
    }

    public function getFrontController()
    {
    }

    public function setFrontController(Zend_Controller_Front $controller)
    {
    }

    public function setParam($name, $value)
    {
    }

    public function setParams(array $params)
    {
    }

    public function getParam($name)
    {
    }

    public function getParams()
    {
    }

    public function clearParams($name = null)
    {
    }

    public function addRoute()
    {
    }

    public function setGlobalParam()
    {
    }

    public function addConfig()
    {
    }
}
