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
                // Ensure we show the maintenance page safely
                $maintenancePage = dirname(__DIR__, 2) . '/public/index.w.php';
                if (file_exists($maintenancePage)) {
                    include_once($maintenancePage);
                } else {
                    // Fallback message if maintenance page is missing
                    echo '<!DOCTYPE html><html><head><title>Service Temporarily Unavailable</title></head><body><h1>Service Temporarily Unavailable</h1><p>We apologize for the inconvenience. Please try again later.</p></body></html>';
                }
            }
        } else {
            $message = new Falcon_Message();
            echo json_encode($message->error(500)->toArray());
        }
    }
}
