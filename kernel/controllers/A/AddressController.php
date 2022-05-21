<?php

/**
 * Класс работы с адресами
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class A_AddressController extends Falcon_Controller_Action_Rest
{
    /**
     * Получение адреса фирмы
     */
    public function firmAction()
    {
        $user = Falcon_Model_User::getInstance();

        $field = $this->_getParam('field');
        $firmId = $this->_getParam('firmId');
        if (empty($firmId)) {
            $firmId = $user->getFirmId();
        }

        $worker = new Falcon_Action_Address_Object_Firm();
        $worker->build($firmId);
        $worker->readData($field);

        return new Falcon_Message($worker->read());
    }
}
