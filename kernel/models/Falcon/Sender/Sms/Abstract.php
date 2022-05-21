<?php

/**
 * Abstract SMS Client
 * During errors will raise Falcon_Sender_Exception.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Sender_Sms_Abstract
{
    /**
     * Object params
     * @var String
     */
    protected $_params;

    /*
     * Creates an instance of configured SMS client.
     * Adapter and its parameters are taken from global configuration array
     * @return {Falcon_Sender_Sms_Abstract}
     */
    public static function createInstance()
    {
        $config = Zend_Registry::get('config');
        $adapter = $config->sms->adapter;
        $class = 'Falcon_Sender_Sms_' . $adapter;
        return new $class($config->sms->$adapter->toArray());
    }

    /**
     * Constructor
     * @param {Array} $params Object params
     */
    public function __construct($params)
    {
        $this->_params = $params;
    }

    /**
     * Single SMS message sending
     * Param data is a hashed array like
     * <code>
     *   array(
     *     'id' => '10002',
     *     'to' => '8937373773',
     *     'text' => 'Test message',
     *     'from' => '8937377373'
     *   )
     * </code>
     * Where id is an internal unique sms identifer (int)
     * @param {Array} $data Hashed array of sms data
     * @return {Array} Server response, containing array of:
     *    messageServerId - Identifier of a message on SMS-server
     *    parts - Count of SMS-parts
     *    credits - Amount of credits deducted from account
     *    status - Status code (-2 = unaccepted, 0 = accepted)
     *    error - Error code {@see errors}
     */
    public function send($data)
    {
        $response = $this->sendMany([$data]);
        return $response[0];
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
     *    messageServerId - Identifier of a message on SMS-server
     *    parts - Count of SMS-parts
     *    credits - Amount of credits deducted from account
     *    status - Status code (-2 = unaccepted, 0 = accepted)
     *    error - Error code {@see errors}
     */
    public function sendMany($data)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Check sms message status
     * Returns an array of statuses for an sms messages by their server ids
     * @param array $params Message id and phone
     * @return array Server response
     */
    public function status($params)
    {
        $response = $this->statusMany([$params]);
        return $response[0];
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
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Account information
     * @return {Array} Hashed information about account on SMS-server
     */
    public function info()
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Returns balance for current API-key on SMS-server
     * @return {Float}
     */
    public function balance()
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Returns an error message by its code
     * @param {int} $code Error code
     */
    public function getErrorMessage($code)
    {
        return 'Unknown error! Code = ' . $code;
    }
}