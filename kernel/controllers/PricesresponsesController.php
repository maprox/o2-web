<?php

/**
 * Controller
 * /pricesresponses
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class PricesresponsesController extends Falcon_Controller_Action
{
    protected $responseIdCache = [];

    /**
     * Action for load request.
     * Load information about approved price requests
     */
    public function loadAction()
    {
        $user = $this->getUserData();
        $data = Falcon_Mapper_Dn_Response::getInstance()
            ->loadAllByFirm($user['id'], $user['id_firm'], true);
        $this->sendAnswer(new Falcon_Message($data));
    }

    /**
     * Action for create request.
     * Cannot be called normally.
     * If called, then updateAction was meant
     */
    public function createAction()
    {
        $this->updateAction();
    }

    /**
     * Action for update request.
     * Updates price request with user defined start/end dates and number.
     */
    public function updateAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();
        if (isset($params->data->id)) {
            $this->update($params->data, $user['id_firm']);
        } else {
            foreach ($params->data as $param) {
                $this->update($param, $user['id_firm']);
            }
        }
        $this->sendAnswer();
    }

    protected function update($params, $idFirm)
    {
        $record = new Falcon_Record_Dn_Response($params->id);

        if ($record->get('id_firm') != $idFirm) {
            Throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        $update = [
            'status' => $params->status,
        ];

        if ($params->status == 3) {
            $update['dt'] = date(DB_DATE_FORMAT);
        }
        $record->setProps($update)->update();
    }

    /**
     * Action for destroy request.
     * Cannot be called normally
     */
    protected function destroyAction()
    {
    }

    /**
     * Action for load list request.
     */
    public function listloadAction()
    {
        $params = $this->getRequestParams();

        if (!empty($params['id_request'])) {
            $data = Falcon_Mapper_Dn_Request_Value::getInstance()
                ->loadPlaceList($params['id_request'], $params['id_response']);

            $this->sendAnswer(new Falcon_Message($data));
            return;
        }

        $this->sendAnswer();
    }

    protected function listcreateAction()
    {
    }

    protected function listupdateAction()
    {
    }

    protected function listdestroyAction()
    {
    }

    /**
     * Action for load grid request.
     * Return cross join warehouse and product tables.
     */
    public function lineloadAction()
    {
        $user = $this->getUserData();
        $params = $this->getRequestParams();
        if (!empty($params['id_request'])) {
            $data = Falcon_Mapper_Dn_Response_Value::getInstance()
                ->loadRequest($params['id_request'],
                    $user['id_firm'], $params['id_place']);

            $this->sendAnswer(new Falcon_Message($data));
            return;
        }

        if (!empty($params['id_response'])) {
            $data = Falcon_Mapper_Dn_Response_Value::getInstance()
                ->loadResponse($params['id_response'], $params['id_place']);

            $this->sendAnswer(new Falcon_Message($data));
            return;
        }

        $this->sendAnswer();
    }

    /**
     * Action for create line(s) in grid response.
     * Creates lines populating them with value.
     * @TODO: replace single inserts with one bulk insert.
     */
    public function linecreateAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();

        if (isset($params->data->id)) {
            $data = (array)$params->data;
            $data['id'] = $this->createLine($params->data, $user['id_firm']);

            $return = [$data];
        } else {
            $return = [];
            foreach ($params->data as $param) {
                $id = $this->createLine($param, $user['id_firm']);

                $param = (array)$param;
                $param['id'] = $id;
                $return[] = $param;
            }
        }

        $this->sendAnswer(new Falcon_Message($return));
    }

    /**
     * Called for inserting single line in grid. Returns new line id.
     * @return Integer
     */
    protected function createLine($params, $idFirm)
    {
        $responseId = $this->getResponseId($params->id_request, $idFirm);

        $record = new Falcon_Record_Dn_Response_Value([
            'id_request_value' => $params->id_request_value,
            'id_response' => $responseId,
            'price' => $params->price,
            'state' => 1
        ]);

        try {
            $record->insert();
        } catch (Zend_Db_Statement_Exception $e) {
            // ExtJS с перепугу послал создаваться уже существующую запись
            $id = $this->updateLine($params, $idFirm);
            return $id;
        }

        return $record->getId();
    }

    /**
     * Action for updating line(s) in grid request.
     * Updates lines with users default value for 'amount' field
     */
    public function lineupdateAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();

        if (isset($params->data->id)) {
            $this->updateLine($params->data, $user['id_firm']);
        } else {
            foreach ($params->data as $param) {
                $this->updateLine($param, $user['id_firm']);
            }
        }

        $this->sendAnswer();
    }

    /**
     * Called for updating single line in grid.
     */
    protected function updateLine($params, $idFirm)
    {
        $responseId = $this->getResponseId($params->id_request, $idFirm);

        $response = new Falcon_Record_Dn_Response($responseId);

        if (!empty($params->id)) {
            $record = new Falcon_Record_Dn_Response_Value($params->id);
        } else {
            $record = Falcon_Mapper_Dn_Response_Value::getInstance()
                ->load([
                    'id_request_value = ?' => $params->id_request_value,
                    'id_response = ?' => $responseId
                ]);

            $record = current($record);
        }

        if ($record->get('id_response') != $response->getId()) {
            Throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        $update = [
            'price' => $params->price
        ];
        $record->setProps($update)->update();
    }

    /**
     * destroy all lines in grid
     * cant be called normally
     */
    protected function linedestroyAction($requestId)
    {
    }

    /**
     * Fetches user data in convenient format
     * @return Array
     */
    protected function getUserData()
    {
        return Falcon_Model_User::getInstance()->getRecord()->toArray();
    }

    /**
     * Converts filter sent by ExtJS into simple integer
     * @return Integer
     */
    protected function getRequestParams()
    {
        $filters = json_decode($this->_getParam('filter'));

        if (empty($filters)) {
            return false;
        }

        $return = [];

        foreach ($filters as $filter) {

            if (empty($filter->property) || empty($filter->value)) {
                continue;
            }

            $return[$filter->property] = $filter->value;
        }

        return $return;
    }

    protected function getResponseId($idRequest, $idFirm)
    {
        if (empty($this->responseIdCache[$idRequest])) {
            $condition = [
                'id_firm = ?' => $idFirm,
                'id_request = ?' => $idRequest,
            ];

            $data = Falcon_Mapper_Dn_Response::getInstance()
                ->load($condition, true);

            if (empty($data)) {
                $user = $this->getUserData();

                $response = new Falcon_Record_Dn_Response([
                    'id_request' => $idRequest,
                    'id_user' => $user['id'],
                    'id_firm' => $user['id_firm'],
                    'status' => 2,
                    'state' => 1
                ]);

                $response->insert();
                $id = $response->getId();
            } else {
                $data = current($data);
                $id = $data['id'];
            }

            $this->responseIdCache[$idRequest] = $id;
        }

        return $this->responseIdCache[$idRequest];
    }
}
