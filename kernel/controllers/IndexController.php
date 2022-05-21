<?php

/**
 * Application main controller
 *
 * @project    Maprox Observer
 * @copyright  2009-2013, Maprox LLC <http://maprox.net>
 */
class IndexController extends Falcon_Controller_Action
{
    // Skip access check
    protected $_skipAccessCheck = true;
    protected $_defaultOutputFormat = 'html';

    /**
     * index
     */
    public function indexAction()
    {
        $user = Falcon_Model_User::getInstance();
        $auth = Zend_Auth::getInstance();
        // check if user have supplied api key in url
        if (!$auth->hasIdentity()) {
            if ($user->getId() < 0 && !$this->_request->isPost()) {
                if (!$this->checkForCredentials($auth)) {
                    $this->_redirect('/auth/');
                } else {
                    $this->_redirect('/');
                }
            } else {
                $answer = Falcon_Auth_Adapter::checkAuthData($this);
                if ($answer->isSuccess()) {
                    $this->checkForCredentials($auth);
                    $this->_redirect('/');
                } else {
                    $this->_redirect('/auth/');
                }
            }
        }

        // Check if mobile
        $isMobile = (Zend_Registry::get('deviceType') === 'mobile');

        // Check if firm account is unpaid
        $firmId = $user->getFirmId();
        $firm = new Falcon_Record_X_Firm($firmId);
        if ($firm->get('have_unpaid_account')) {
            if (!$isMobile) {
                $this->_redirect('/admin#billing');
            } else {
                $this->_redirect('/logout/?r=' .
                    Falcon_Auth_Adapter::FIRM_UNPAID_ERROR);
            }
        }

        // reroute page request if needed
        $section = $this->_getParam('section', '');
        switch ($section) {
            case 'admin':
                $this->_redirect('/admin/');
                break;
            case 'noscript':
                $this->_redirect('/noscript/');
                break;
            case 'index':
                $this->_redirect('/');
                break;
        }
        $this->view->settings = $user->getSettings();
        $this->view->modules = $user->getModules('index');
    }
}
