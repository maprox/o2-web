<?php

/**
 * SMS Client for smspilot.ru
 * During errors will raise Falcon_Sender_Exception.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Sender_Sms_SmsPilotRu extends Falcon_Sender_Sms_Abstract
{
    /**
     * Api url
     * @var String
     */
    private $_apiurl = 'http://smspilot.ru/api2.php';

    /**
     * Service Api-key
     * @var String
     */
    private $_apikey;

    /**
     * Constructor
     * @param {Array} $params Object params
     */
    public function __construct($params)
    {
        parent::__construct($params);
        $this->_apikey = $params['apikey'];
    }

    /**
     * Sends a JSON request string to SMS-server
     * @param string $request JSON request string
     * @return array JSON response || null on error
     */
    public function sendRequest($request)
    {
        $client = new Zend_Http_Client($this->_apiurl, [
            'adapter' => 'Zend_Http_Client_Adapter_Socket',
            'ssltransport' => 'tls'
        ]);
        $client->setRawData(Zend_Json::encode($request));
        $response = $client->request('POST');
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
        $result = $this->sendRequest([
            'apikey' => $this->_apikey,
            'send' => $data
        ]);
        return $result['send'];
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
        $ids = [];
        foreach ($list as $item) {
            $ids[] = ['server_id' => $item['id']];
        }
        $result = $this->sendRequest([
            'apikey' => $this->_apikey,
            'check' => $ids
        ]);
        if (isset($result['check'])) {
            return $result['check'];
        }

        // Status check error, logging and mocking
        Falcon_Logger::getInstance()->log('smspilot',
            'status_check_error', $result);
        foreach ($ids as &$id) {
            $id['status'] = Falcon_Sender_Response::DELIVERED;
        }
        return $ids;
    }

    /**
     * Account information
     * @return {Array} Hashed information about account on SMS-server
     */
    public function info()
    {
        $result = $this->sendRequest([
            'apikey' => $this->_apikey,
            'info' => true
        ]);
        return $result['info'];
    }

    /**
     * Returns balance for current API-key on SMS-server
     * @return {Float}
     */
    public function balance()
    {
        $result = $this->sendRequest([
            'apikey' => $this->_apikey,
            'balance' => true
        ]);
        return $result['balance'];
    }

    /**
     * Returns an error message by its code
     * @param {int} $code Error code
     */
    public function getErrorMessage($code)
    {
        $errors = [
            1 => "Message doesn't delivered",
            10 => 'INPUT data is required',
            11 => 'Unknown INPUT format',
            12 => 'XML structure is invalid',
            13 => 'JSON structure is invalid',
            14 => 'Unknown COMMAND',
            100 => 'APIKEY is required',
            101 => 'APIKEY is invalid',
            106 => 'APIKEY is blocked (spam)',
            110 => 'SYSTEM ERROR',
            113 => 'IP RESTRICTION',
            201 => 'FROM is invalid',
            202 => 'FROM is depricated',
            210 => 'TO is required',
            211 => 'TO is invalid',
            212 => 'TO is depricated',
            213 => 'Unsupported zone',
            220 => 'TEXT is required',
            221 => 'TEXT too long',
            230 => 'ID is invalid',
            231 => 'PACKET_ID is invalid',
            240 => 'Invalid INPUT list',
            241 => "You don't have enough credit",
            242 => 'SMS count limit (trial)',
            300 => 'SMS server_id is required',
            301 => 'SMS server_id is invalid',
            302 => 'SMS server_id not found',
            303 => 'Invalid SMS check list',
            400 => 'User not found'
        ];
        if (isset($errors[$code])) {
            return $errors[$code];
        }
        return 'Unknown error! Code = ' . $code;
    }
}