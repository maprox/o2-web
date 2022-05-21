<?php

/**
 * Products controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Dn_ProductController extends Falcon_Controller_Action
{
    public function loadAction()
    {
        list($articleGroup, $firmId) = $this->getPersonalParams();
        $mapper = Falcon_Mapper_Dn_Product::getInstance();
        $data = $mapper->loadWithData($articleGroup, $firmId);
        $answer = new Falcon_Message($data);
        $this->sendAnswer($answer);
    }

    public function updateAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $params = $params->data;
        list($articleGroup, $firmId) = $this->getPersonalParams();
        if (isset($params->id)) {
            $answer = Falcon_Mapper_Dn_Product::getInstance()
                ->updateProduct($params, $articleGroup, $firmId);
        } else {
            $answer = new Falcon_Message_Composite();
            foreach ($params as $paramSet) {
                $result = Falcon_Mapper_Dn_Product::getInstance()
                    ->updateProduct($paramSet, $articleGroup, $firmId);

                $answer->add($result);
            }
            $answer->merge();
        }
        $this->sendAnswer($answer);
    }

    public function createAction()
    {
        $this->updateAction();
    }

    /**
     * Action for destroy request.
     * Cannot be called normally
     */
    public function destroyAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $params = $params->data;

        $record = new Falcon_Record_Dn_Product($params->id);
        $record->trash();

        $this->sendAnswer();
    }

    protected function getPersonalParams()
    {
        $user = Falcon_Model_User::getInstance();
        $firm = new Falcon_Model_Firm($user->getFirmId());
        $articleGroup = $firm->get('product_group');
        $firmId = $firm->getId();
        return [$articleGroup, $firmId];
    }
}
