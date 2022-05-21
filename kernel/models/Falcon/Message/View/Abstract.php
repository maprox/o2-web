<?php

/**
 * Abstract exporter of the message
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Message_View_Abstract extends Falcon_Singleton
{
    /**
     * Disables layout
     */
    protected function disableLayout()
    {
        $layout = Zend_Layout::getMvcInstance();
        if ($layout instanceof Zend_Layout) {
            $layout->disableLayout();
        }
        Zend_Controller_Action_HelperBroker::
        getStaticHelper('viewRenderer')->setNoRender(true);
    }

    /**
     * Headers initialization
     */
    public function initHeaders()
    {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $filename = $request->getParam('filename');
        if ($filename) {
            $useragent = $request->getServer('HTTP_USER_AGENT');
            $response = Zend_Controller_Front::getInstance()->getResponse();
            $response->setHeader('Content-Disposition',
                'attachment; ' . Falcon_Controller_Action::
                getFilenameHeader($filename, $useragent));
        }
    }

    /**
     * Returns exporter format name
     * @return String
     */
    final public static function getFormat()
    {
        return strtolower(str_replace(
            'Falcon_Message_View_', '', get_called_class()));
    }

    /**
     * Write headers and content of the response
     * @param Falcon_Message $message
     */
    public function sendMessage(Falcon_Message $message)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }
}