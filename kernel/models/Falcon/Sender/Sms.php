<?php

/**
 * SMS sender
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Sender_Sms extends Falcon_Sender_Abstract
{
    /**
     * Applies key value to supplied array
     * @param array $array
     * @param string $key
     * @param string $value
     */
    static function applyKey(array &$array, $key, $value)
    {
        if ($value) {
            $array[$key] = $value;
        }
    }

    /**
     * SMS sending
     * @param {Falcon_Record_N_Work} $work
     * @return {Falcon_Sender_Response}
     */
    static function send($work)
    {
        $logger = Falcon_Logger::getInstance();
        try {
            $clientSms = Falcon_Sender_Sms_Abstract::createInstance();
            $phone = Falcon_Util_Phone::normalize($work->get('send_to'));
            $message = $work->get('message');

            // If work is waiting, so let's check status of sms message
            if ($work->isWaiting()) {
                $serverId = $work->getParam('server_id');
                $statusResponse = $clientSms->status([
                    'phone' => $phone,
                    'id' => $serverId
                ]);
                $statusCode = $statusResponse['status'];

                // check status
                if ($statusCode == Falcon_Sender_Response::REJECTED ||
                    $statusCode == Falcon_Sender_Response::DELIVERY_ERROR
                ) {
                    // Set work is done
                    $work->setDone();
                    $errorCode = 1;
                    $errorMessage = $clientSms->getErrorMessage($errorCode);
                    $errorMessage = '[SMS ' . $phone . '] ' . $errorMessage;
                    return new Falcon_Sender_Response($statusCode,
                        $errorCode,
                        $errorMessage);
                } else {
                    if ($statusCode == Falcon_Sender_Response::DELIVERED) {
                        // Set work is done
                        $work->setDone();
                    }

                    return new Falcon_Sender_Response(
                        $statusResponse['status']);
                }
            } else {
                // prepare data for sending sms
                $params = [
                    'to' => $phone,
                    'text' => $message
                ];

                // handle additional parameters
                self::applyKey($params, 'from', $work->getParam('from'));
                self::applyKey($params, 'bin', $work->getParam('bin'));
                self::applyKey($params, 'push', $work->getParam('push'));
                self::applyKey($params, 'flash', $work->getParam('flash'));

                // send SMS
                $sendResponse = $clientSms->send($params);
                $statusCode = $sendResponse['status'];
                $serverId = $sendResponse['server_id'];
                $parts = isset($sendResponse['parts']) ?
                    $sendResponse['parts'] : 1;

                // Set amount of sms parts
                $work->set('amount', $parts);
                $work->update();

                // check answer
                if ($statusCode == Falcon_Sender_Response::DELIVERED) {
                    return new Falcon_Sender_Response();
                }

                if ($statusCode == Falcon_Sender_Response::REJECTED ||
                    $statusCode == Falcon_Sender_Response::DELIVERY_ERROR
                ) {
                    // Set work is done
                    $work->setDone();

                    $errorCode = $sendResponse['error'];
                    $errorMessage = $clientSms->getErrorMessage($errorCode);
                    $errorMessage = '[SMS ' . $phone . '] ' . $errorMessage;

                    return new Falcon_Sender_Response($statusCode,
                        $errorCode,
                        $errorMessage);
                } else {
                    $work->setWaiting();

                    $newParams = [
                        'server_id' => $serverId
                    ];

                    $params = $work->get('params');
                    if ($params) {
                        $params = json_decode($params, true);
                        // Merge
                        $newParams = array_merge($params, $newParams);
                    }

                    $work->setField('params', Zend_Json::encode($newParams));
                    return new Falcon_Sender_Response($statusCode);
                }
            }
        } catch (Exception $e) {
            // error handling
            return new Falcon_Sender_Response(
                Falcon_Sender_Response::DELIVERY_ERROR,
                $e->getCode(),
                $e->getMessage()
            );
        }
        return null;
    }
}
