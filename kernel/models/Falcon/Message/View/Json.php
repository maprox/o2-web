<?php

/**
 * Json exporter of the message
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Message_View_Json extends Falcon_Message_View_Abstract
{
    /**
     * Write headers and content of the response
     * @param Falcon_Message $message
     */
    public function sendMessage(Falcon_Message $message)
    {
        $this->initHeaders();
        $this->disableLayout();
        $data = Zend_Json::encode($message->toArray());
        $frontController = Zend_Controller_Front::getInstance();
        $response = $frontController->getResponse();
        $response->setHeader('Content-Type', 'application/json', true);
        // JSONP support
        $request = $frontController->getRequest();
        $callback = $request->getParam('callback');
        if ($callback) {
            $response->setHeader('Content-Type',
                'application/javascript', true);
            $data = $callback . '(' . $data . ')';
        }
        return $data;
    }
}