<?php

/**
 * REST Action helper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Rest extends Falcon_Action_Abstract
{
    protected $_params;

    /**
     * Answer object
     * @var {Falcon_Message}
     */
    protected $answer;
    /**
     * Access check helper object
     * @var {Falcon_Action_Rest_Helper_Access}
     */
    protected $accessHelper;
    /**
     * History write helper object
     * @var {Falcon_Action_Rest_Helper_History}
     */
    protected $historyHelper;

    /**
     * Constructor
     */
    public function __construct($params = [])
    {
        $this->setParams($params);
    }

    /**
     * Returns an instance of action class by table name
     * @param string $tablename Name of the table
     * @param array $params A list of input parameters
     * @return Falcon_Action_Abstract
     */
    public static function getInstanceByTableName($tablename,
                                                  $params = [])
    {
        $className = getFalconClassName('Falcon_Action_', $tablename);
        return new $className($params);
    }

    /**
     * Returns true if param with paramName exists
     * @param string $paramName
     * @param Array $params
     */
    public function hasParam($paramName, $params = null)
    {
        $params = $params ? $params : $this->_params;
        return array_key_exists($paramName, $params);
    }

    /**
     * Set params array
     * @param array $params
     */
    public function setParams($params)
    {
        $this->_params = $params;
    }

    /**
     * Set param value
     * @param string $key
     * @param mixed $value
     */
    public function setParam($key, $value)
    {
        $this->_params[$key] = $value;
    }

    /**
     * Deletes param
     * @param string $key
     */
    protected function unsetParam($key)
    {
        unset($this->_params[$key]);
    }

    /**
     * Returns params array
     * @return array
     */
    public function getParams()
    {
        return $this->_params;
    }

    /**
     * Returns a param value ($default if param not found)
     * @param string $key
     * @param string $default
     * @param Array $params
     */
    public function getParam($key, $default = null, $params = null)
    {
        $params = $params ? $params : $this->getParams();
        return (isset($params[$key])) ? $params[$key] : $default;
    }

    /**
     * Returns a response instance
     * @return mixed
     */
    public function getResponse()
    {
        return Zend_Controller_Front::getInstance()->getResponse();
    }

// ----------------------------------------------------------------------------

    /**
     * Returns a list of instances
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doGetList($writeResponseHeaders = true)
    {
        throw new Falcon_Exception('GetList is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Returns an instance by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doGetItem($writeResponseHeaders = true)
    {
        throw new Falcon_Exception('GetItem is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Creates instance by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doCreate($writeResponseHeaders = true)
    {
        throw new Falcon_Exception('Create is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }


    /**
     * Updates instance by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doUpdate($writeResponseHeaders = true)
    {
        throw new Falcon_Exception('Update is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Deletes an instance by its id
     * @param bool $writeResponseHeaders [opt. defaults to true]
     */
    public function doDelete($writeResponseHeaders = true)
    {
        throw new Falcon_Exception('Delete is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Creates answer instance
     * @return Falcon_Message
     */
    protected function getAnswer()
    {
        if (!$this->answer) {
            $this->answer = new Falcon_Message();
        }
        return $this->answer;
    }

    /**
     * @return Falcon_Action_Rest_Helper_Access
     */
    protected function getAccessHelper()
    {
        if (!$this->accessHelper) {
            $this->accessHelper = $this->createAccessHelper();
        }
        return $this->accessHelper;
    }

    /**
     * @return Falcon_Action_Rest_Helper_History
     */
    protected function getHistoryHelper()
    {
        if (!$this->historyHelper) {
            $this->historyHelper = $this->createHistoryHelper();
        }
        return $this->historyHelper;
    }

    /**
     * Creates helper for access checking
     * @return Falcon_Action_Rest_Helper_Access
     */
    protected function createAccessHelper()
    {
        return new Falcon_Action_Rest_Helper_Access();
    }

    /**
     * Creates helper for history writing
     * @return Falcon_Action_Rest_Helper_History
     */
    protected function createHistoryHelper()
    {
        return new Falcon_Action_Rest_Helper_History();
    }
}
