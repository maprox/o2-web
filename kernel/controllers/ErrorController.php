<?php

/**
 * Error handling controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class ErrorController extends Falcon_Controller_Action
{
    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;
    protected $_defaultOutputFormat = 'html';

    /**
     * Error handling
     */
    public function errorAction()
    {
        $t = Zend_Registry::get('translator');
        $zt = $t['zt'];
        $format = $this->_getParam('format', 'html');
        $errors = $this->_getParam('error_handler');
        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // 404 - controller or action not found
                $this->getResponse()->setRawHeader('HTTP/1.1 404 Not Found');
                $code = 404;
                $uri = $errors->request->getRequestUri();
                $message = sprintf($zt->translate(
                    'The requested page can not be found.<br/>' .
                    'Probably, there is a typo in <b>%s</b>'),
                    urldecode($uri));
                break;
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_OTHER:
                $code = $errors->exception->getCode();
                $message = $errors->exception->getMessage();
                break;
            default:
                // 500 - system error
                $this->getResponse()->setRawHeader(
                    'HTTP/1.1 500 Internal Server Error');
                $code = 500;
                $message = $zt->translate('System error! Please try later.') .
                    "<br/>" . $zt->translate($errors->exception->getMessage());
                break;
        }
        // Clear previous content
        $this->getResponse()->clearBody();
        $this->view->code = $code;
        $this->view->message = $message;
        if ($format !== 'html') {
            $answer = new Falcon_Message();
            $this->sendAnswer($answer
                ->error($code, [$message]));
        }
    }
}

