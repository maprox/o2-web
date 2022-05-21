<?php

/**
 * REST API Controller
 *
 * Behavior
 * Method  URI                             Controller::action
 * GET     /mon_device/                    Mon_DeviceController::indexAction()
 * GET     /mon_device/:id                 Mon_DeviceController::getAction()
 * POST    /mon_device                     Mon_DeviceController::postAction()
 * PUT     /mon_device/:id                 Mon_DeviceController::putAction()
 * DELETE  /mon_device/:id                 Mon_DeviceController::deleteAction()
 * POST    /mon_device/:id?_method=PUT     Mon_DeviceController::putAction()
 * POST    /mon_device/:id?_method=DELETE  Mon_DeviceController::deleteAction()
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Action_Rest extends Falcon_Controller_Action
{
    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     *
     * Falcon_Controller_Action_Rest have it's own
     * access mechanism, this one is obsolete
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

    /**
     * Disable layout
     * @var {Boolean}
     */
    protected $_disableLayout = true;

    /**
     * index
     */
    public function indexAction()
    {
        $this->sendAnswer($this->doGetList());
    }

    /**
     * GET
     * Returns an item by its id
     */
    public function getAction()
    {
        $this->sendAnswer($this->doGetItem());
    }

    /**
     * POST
     * Creates or updates item by its id
     */
    public function postAction()
    {
        $this->sendAnswer($this->doCreate());
    }

    /**
     * PUT
     * Creates or updates item by its id
     */
    public function putAction()
    {
        $this->sendAnswer($this->doUpdate());
    }

    /**
     * DELETE
     * Deletes an item by its id
     */
    public function deleteAction()
    {
        $this->sendAnswer($this->doDelete());
    }

    /**
     * OPTIONS
     * Returns an allowed options of the rest controller
     */
    public function optionsAction()
    {
        $this->getResponse()->setBody(null);
        $this->getResponse()->setHeader('Allow',
            'OPTIONS, HEAD, INDEX, GET, POST, PUT, DELETE');
    }

// ----------------------------------------------------------------------------

    /**
     * Returns a list of instances
     */
    public function doGetList()
    {
        return $this->getActionClassInstance()->doGetList();
    }

    /**
     * Returns an instance by its id
     */
    public function doGetItem()
    {
        $method = $this->getParam('id') . 'Action';
        if (method_exists($this, $method)) {
            return $this->$method();
        }
        return $this->getActionClassInstance()->doGetItem();
    }

    /**
     * Creates or updates instance by its id
     */
    public function doCreate()
    {
        if ($this->getParam('id')) {
            $method = $this->getParam('id') . 'Action';
            if (method_exists($this, $method)) {
                return $this->$method();
            }
        }
        return $this->getActionClassInstance()->doCreate();
    }

    /**
     * Creates or updates instance by its id
     */
    public function doUpdate()
    {
        $method = $this->getParam('id') . 'Action';
        if (method_exists($this, $method)) {
            return $this->$method();
        }
        return $this->getActionClassInstance()->doUpdate();
    }

    /**
     * Deletes an instance by its id
     */
    public function doDelete()
    {
        return $this->getActionClassInstance()->doDelete();
    }

// ----------------------------------------------------------------------------

    /**
     * Returns firm identifier
     * @return int
     */
    protected function getFirmId()
    {
        $firmId = Falcon_Model_User::getInstance()->getFirmId();
        /*if (!$firmId)
        {
            throw new Falcon_Exception('id_firm is not specified',
                Falcon_Exception::ACCESS_VIOLATION);
        }*/
        return (int)$firmId;
    }

    /**
     * Return request params array
     * @return array
     */
    public function getParams()
    {
        $params = parent::getParams();
        if (isset($params['jsonData'])) {
            $data = json_decode($params['jsonData'], true);
            if ($data) {
                $params = array_replace($params, $data);
            }
        }
        if (empty($params['id_firm']) || !Falcon_Access::haveAdminRight(
                Falcon_Model_User::getInstance()->getId())
        ) {
            $params['id_firm'] = $this->getFirmId();
        }
        $params['pageAndOrderParams'] = $this->getPageAndOrderParams();
        return $params;
    }

    /**
     * Returns an instance of action class by controller name
     * @return Falcon_Action_Abstract
     */
    public function getActionClassInstance()
    {
        return Falcon_Action_Rest::getInstanceByTableName(
            $this->getControllerNamePrefix(), $this->getParams());
    }

}
