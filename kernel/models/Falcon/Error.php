<?php

/**
 * Error handler class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Error
{
    /**
     * Exception catcher
     */
    public static function catchException(Exception $e)
    {
        $config = Zend_Registry::get('config');
        $message = $e->getMessage(); // get error message
        $trace = $e->getTraceAsString(); // get error trace string
        $logger = Falcon_Logger::getInstance();
        $logger->log('error', [
            'message' => $message,
            'trace' => $trace
        ]);
        // проверяем, если не используется AJAX, то передаем данные во View
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $isAjax = $request ? $request->isXmlHttpRequest() : false;
        if (!$isAjax) {
            if (!empty($config) && $config->debug) {
                Zend_Debug::dump($message . "\n" . $trace);
            } else {
                include_once('index.w.php');
            }
        } else {
            $message = new Falcon_Message();
            echo json_encode($message->error(500)->toArray());
        }
    }
}
