<?php

/**
 * Device detection plugin
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011, Maprox LLC
 */
class Falcon_Controller_Plugin_Startup extends Zend_Controller_Plugin_Abstract
{
    /**
     * Loop startup dispatch
     * @param Zend_Controller_Request_Abstract $request
     */
    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request)
    {
        $view = Zend_Layout::getMvcInstance()->getView();
        $view->controllerName = $request->getControllerName();
        $view->actionName = $request->getActionName();
        $view->moduleName = $request->getModuleName();
        $view->moduleUrl = $view->baseUrl . '/' . $view->moduleName;
        $view->basePath = is_callable([$request, 'getBasePath']) ?
            $request->getBasePath() : '';
        $view->baseUrl = is_callable([$request, 'getBaseUrl']) ?
            $request->getBaseUrl() : '';
        $this->detectUserAgent($view);
    }

    /**
     * User detection
     * @param {Zend_View} $view
     */
    public function detectUserAgent(&$view)
    {
        $config = Zend_Registry::get('config');
        $layout = 'big';
        if ($config->mobile->support) {
            $detect = new Mobile_Detect();

            // if not forced, let's get deviceType
            if ($config->mobile->support !== 'forced') {
                $view->deviceType = $detect->isMobile() ? 'mobile' : 'desktop';
            } else {
                $view->deviceType = 'mobile';
            }
        } else {
            $view->userAgent = null;
            $view->device = null;
            $view->deviceType = 'desktop';
        }

        Zend_Registry::set('deviceType', $view->deviceType);
        Zend_Registry::set('deviceSize', $layout);
    }
}
