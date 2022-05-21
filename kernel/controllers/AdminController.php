<?php

/**
 * Application admin controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class AdminController extends Falcon_Controller_Action
{
    // Skip access check
    protected $_skipAccessCheck = true;

    /**
     * index
     */
    public function indexAction()
    {
        $user = Falcon_Model_User::getInstance();
        $auth = Zend_Auth::getInstance();
        // check if user have supplied api key in url
        if (!$auth->hasIdentity()) {
            // check if user have supplied api key in url
            if ($user->getId() < 0 && !$this->_request->isPost()) {
                if (!$this->checkForCredentials($auth)) {
                    $this->_redirect('/auth/');
                }
            } else {
                $answer = Falcon_Auth_Adapter::checkAuthData($this);
                if ($answer->isSuccess()) {
                    $this->checkForCredentials($auth);
                    $this->_redirect('/admin/');
                } else {
                    $this->_redirect('/auth/');
                }
            }
        }

        $this->view->settings = $user->getSettings();
        $this->view->modules = $user->getModules('admin');
    }
}
