<?php

/**
 * Common group operations notification class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Url
    extends Falcon_Notification_Abstract
{
    /**
     * Executes an action
     * @return {Falcon_Sender_Response}
     */
    public function execute()
    {
        $logger = Falcon_Logger::getInstance();

        // Get work
        $work = $this->getWork();

        // Get work params
        $params = $work->get('params');
        $params = json_decode($params, true);

        $method = $params['method'];

        $urlParams = [];
        foreach ($params['params'] as $param) {
            $urlParams[$param['param']] = $param['value'];
        }
        $paramsString = http_build_query($urlParams);

        // Curl handler
        $ch = curl_init();

        if ($method === 'GET') {
            $params['url'] .= '?' . $paramsString;
        }

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $paramsString);
        }

        curl_setopt($ch, CURLOPT_URL, $params['url']);

        // Receive server response
        //curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $serverOutput = curl_exec($ch);
        curl_close($ch);

        return new Falcon_Sender_Response();
    }
}