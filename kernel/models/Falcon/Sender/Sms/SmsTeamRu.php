<?php

/**
 * SMS Client for smsteam.ru
 * During errors will raise Falcon_Sender_Exception.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Sender_Sms_SmsTeamRu extends Falcon_Sender_Sms_Abstract
{
    // constants
    const
        // output format
        RESPONSE_FMT_PLAIN = 0,
        RESPONSE_FMT_NUMBER = 1,
        RESPONSE_FMT_XML = 2,
        RESPONSE_FMT_JSON = 3,
        // cost of message
        COST_GET_ONLY_PARTS = 0,
        COST_GET_PRICE_NOT_SEND = 1,
        COST_GET_PRICE = 2,
        COST_GET_PRICE_AND_BALANCE = 3,
        // sending charset
        CHARSET = 'utf-8',
        // errors
        ERROR_UNKNOWN = 0;

    /**
     * Api url
     * @var String
     */
    protected $_apiurlsend = 'http://cp.smsteam.ru/sys/send.php';
    protected $_apiurlstatus = 'http://cp.smsteam.ru/sys/status.php';

    /**
     * Service Api-key
     * @var String
     */
    private $_login;

    /**
     * Constructor
     * @param {Array} $params Object params
     */
    public function __construct($params)
    {
        parent::__construct($params);
        $this->_login = $params['login'];
        $this->_password = $params['password'];
    }

    /**
     * Sends a JSON request string to SMS-server
     * @param string $request JSON request string
     * @return array JSON response || null on error
     */
    public function sendRequest($url, $params, $method = 'POST')
    {
        $client = new Zend_Http_Client($url, [
            'adapter' => 'Zend_Http_Client_Adapter_Socket',
            'ssltransport' => 'tls'
        ]);
        $params['login'] = $this->_login;
        $params['psw'] = $this->_password;
        $params['cost'] = self::COST_GET_PRICE_AND_BALANCE;
        $params['charset'] = self::CHARSET;
        $params['fmt'] = self::RESPONSE_FMT_JSON;
        // log params
        $logger = Falcon_Logger::getInstance();
        $logger->log('sms', $params);
        // send request
        $client->setParameterPost($params);
        $response = $client->request($method);
        if ($response->isSuccessful())
            return Zend_Json::decode($response->getBody());
        return null;
    }

    /**
     * Multiple SMS message sending in one request
     * Param data is an array of hashed arrays like
     * <code>
     *   array(
     *     array(
     *       'id' => '10002',
     *       'to' => '8937373773',
     *       'text' => 'Test message',
     *       'from' => '8937377373'
     *     ),
     *     array(
     *       'id' => '10003',
     *       'to' => '8937373773',
     *       'text' => 'Test message number 2',
     *       'from' => '8937377373'
     *     ),
     *   )
     * </code>
     * Where id is an internal unique sms identifer (int)
     * @param {Array} $data Array of hashed arrays of sms data
     * @return {Array} Server response, containing array of:
     *    server_id - Identifier of a message on SMS-server
     *    parts - Count of SMS-parts
     *    credits - Amount of credits deducted from account
     *    status - Status code (-2 = unaccepted, 0 = accepted)
     *    error - Error code {@see errors}
     */
    public function sendMany($data)
    {
        $response = [];
        foreach ($data as $message) {
            $result = $this->sendRequest($this->_apiurlsend,
                array_rename_keys($message, [
                    'from' => 'sender',
                    'to' => 'phones',
                    'text' => 'mes'
                ])
            );
            if (!$result) {
                $result = ['error_code' => 0]; // Unknown error
            }
            $result['status'] = !isset($result['error_code']) ?
                Falcon_Sender_Response::ACCEPTED :
                Falcon_Sender_Response::DELIVERY_ERROR;
            $response[] = array_rename_keys($result, [
                'id' => 'server_id',
                'cnt' => 'parts',
                'error' => 'error_message',
                'error_code' => 'error'
            ]);
        }
        return $response;
    }

    /**
     * Check sms messages status
     * Returns an array of statuses for an sms messages by their server ids
     * @param array $list Array of message ids on SMS-server
     * <code>$list = array(array(
     *   'phone' => '7838388383',
     *   'id' => 23423
     * ), array(
     *   'phone' => '7838388383',
     *   'id' => 23422
     * ));</code>
     * @return {Array} Server response
     */
    public function statusMany($list)
    {
        $response = [];
        foreach ($list as $item) {
            $result = $this->sendRequest($this->_apiurlstatus, $item);
            if (!$result) {
                $result = ['error_code' => self::ERROR_UNKNOWN];
            }
            if (isset($result['status'])) {
                // http://smsteam.ru/api/http/checking-status
                if ($result['status'] < 1) {
                    $result['status'] = Falcon_Sender_Response::QUEUED;
                } elseif ($result['status'] < 3) {
                    $result['status'] = Falcon_Sender_Response::DELIVERED;
                } else {
                    $result['status'] = Falcon_Sender_Response::DELIVERY_ERROR;
                    $result['error_code'] = self::ERROR_UNKNOWN;
                }
            } else {
                $result['status'] = !isset($result['error_code']) ?
                    Falcon_Sender_Response::ACCEPTED :
                    Falcon_Sender_Response::DELIVERY_ERROR;
            }
            $response[] = $result;
        }
        return $response;
    }

    /**
     * @warn Not used over code yet. Maybe move it to abstract class?
     * Returns an error message by its code
     * @param {int} $code Error code
     */
    public function getErrorMessage($code)
    {
        $errors = [
            1 => 'Error in parameters',
            2 => 'Incorrect login or password',
            3 => 'Insufficient funds on the account',
            4 => 'Ip-address is temporarily blocked',
            5 => 'Incorrect date format',
            6 => 'Message is forbidden',
            7 => 'Incorrect phone number',
            8 => 'Message to the specified number can not be delivered',
            9 => 'Too quick sending'
        ];
        if (isset($errors[$code]))
            return $errors[$code];
        return 'Unknown error! Code = ' . $code;
    }

}