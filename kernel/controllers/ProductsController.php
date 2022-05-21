<?php

/**
 * Products controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class ProductsController extends Falcon_Controller_Action
{
    /**
     * get
     * @see Falcon_Controller_Action::get()
     */
    public function get()
    {
        /*
        // идентификатор устройства, для которого выбираются сенсоры
        $deviceId = json_decode($this->_getParam('deviceId'));
        // объект устройства
        $device = new Falcon_Model_Device($deviceId);
        // объект ответа
        $answer = new Falcon_Message();
        // получение списка сенсоров
        $answer->append($device->getSensors());
        // ответ сервера
        return $answer;
        */
    }

    /**
     * add
     */
    public function addAction()
    {
        $answer = new Falcon_Message();

        // input data
        $data = $this->getJsonData();
        unset($data->id);

        $user = Falcon_Model_User::getInstance();
        if (!$user->hasRight('admin_dn_product')) {
            $answer->error(403);
        } else {
            $product = new Falcon_Model_Docsnet_Products();
            $answer = $product->add((array)$data);
        }
        $this->sendAnswer($answer);
    }

    /**
     * set
     */
    public function setAction()
    {
        $answer = new Falcon_Message();

        // input data
        $data = $this->getJsonData();
        if (!isset($data->id))
            return $this->sendAnswer($answer->error(4042));

        $user = Falcon_Model_User::getInstance();
        if (!$user->hasRight('admin_dn_product')) {
            $answer->error(403);
        } else {
            $product = new Falcon_Model_Docsnet_Products();
            $answer = $product->set((array)$data);
        }
        $this->sendAnswer($answer);
    }

    /**
     * remove
     */
    public function removeAction()
    {
        $answer = new Falcon_Message();

        // input data
        $data = $this->getJsonData();
        if (!isset($data->id))
            return $this->sendAnswer($answer->error(4042));

        $user = Falcon_Model_User::getInstance();
        if (!$user->hasRight('admin_dn_product')) {
            $answer->error(403);
        } else {
            $product = new Falcon_Model_Docsnet_Products();
            $answer = $product->del($data->id);
        }
        $this->sendAnswer($answer);
    }
}
