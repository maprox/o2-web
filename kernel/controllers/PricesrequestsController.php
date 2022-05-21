<?php

/**
 * Controller
 * /pricesrequests
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class PricesrequestsController extends Falcon_Controller_Action
{
    /**
     * Action for load request.
     * Load information about price requests formed by
     * users in same firm, as current user.
     */
    public function loadAction()
    {
        $user = $this->getUserData();
        $data = Falcon_Mapper_Dn_Request::getInstance()
            ->loadByFirm($user['id_firm'], true);
        $this->sendAnswer(new Falcon_Message($data));
    }

    /**
     * Action for create request.
     * Creates new price request in same firm as current user.
     */
    public function createAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();
        if (isset($params->data->id)) {
            $record = new Falcon_Record_Dn_Request([
                'sdt' => $params->data->sdt,
                'edt' => $params->data->edt,
                'num' => $params->data->num,
                'id_user' => $user['id'],
                'id_firm' => $user['id_firm'],
                'status' => 1,
                'state' => 1
            ]);

            $record->insert();
        }
        $this->sendAnswer(new Falcon_Message([$record->toArray()]));
    }

    /**
     * Action for update request.
     * Updates price request with user defined start/end dates and number.
     */
    public function updateAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();

        if (!is_array($params->data)) {
            $data = [$params->data];
        } else {
            $data = $params->data;
        }

        foreach ($data as $params) {
            $record = new Falcon_Record_Dn_Request($params->id);
            $tenderId = $record->get('id');
            $tenderFirmId = $record->get('id_firm');
            $userFirmId = $user['id_firm'];

            if ($tenderFirmId != $userFirmId) {
                Throw new Falcon_Exception('Access violation',
                    Falcon_Exception::ACCESS_VIOLATION);
            }

            $tenderStatus = $record->get('status');
            $tenderStatusIsChanged = ($tenderStatus != $params->status);

            /*
                        if ($tenderStatusIsChanged && $params->status == 2)
                        {
                            Falcon_Mapper_Dn_Request_Value::getInstance()
                                ->fixateRequest($params->data->id);
                        }
            */

            $update = [
                'sdt' => $params->sdt,
                'edt' => $params->edt,
                'num' => $params->num,
                'status' => $params->status,
            ];
            $record->setProps($update)->update();

            if ($tenderStatusIsChanged && $params->status == 2) // 2 = SENDED
            {
                $this->notifySuppliers($tenderId, $tenderFirmId);
            }
        }

        $this->sendAnswer();
    }

    /**
     * Action for check if request is empty.
     */
    public function amountAction()
    {
        $requestId = $this->_getParam('requestId');
        $placeId = $this->_getParam('placeId');

        $mapper = Falcon_Mapper_Dn_Request_Value::getInstance();
        $records = $mapper->load([
            'id_request = ?' => $requestId,
            'id_place = ?' => $placeId,
            'amount > ?' => 0
        ]);

        $total = 0;

        foreach ($records as $record) {
            $total += $record->get('amount');
        }

        $this->sendAnswer(new Falcon_Message($total));
    }

    /**
     * Action for destory request.
     * Moves price request into trash bin.
     */
    public function destroyAction()
    {
        $params = json_decode($this->getRequest()->getRawBody());
        $user = $this->getUserData();
        $data = $params->data;
        if (is_object($data)) {
            $data = [$data];
        }

        foreach ($data as $item) {
            $record = new Falcon_Record_Dn_Request($item->id);

            if ($record->get('id_firm') != $user['id_firm']) {
                Throw new Falcon_Exception('Access violation',
                    Falcon_Exception::ACCESS_VIOLATION);
            }

            $record->trash();
            $this->linedestroyAction($item->id);
        }
        $this->sendAnswer();
    }

    /**
     * Action for load grid request.
     * Return cross join warehouse and product tables.
     */
    public function lineloadAction()
    {
        $user = $this->getUserData();
        $params = $this->getRequestParams();

        if (empty($params)) {
            return $this->sendAnswer();
        }

        $data = Falcon_Mapper_Dn_Request_Value::getInstance()
            ->loadRequest($params['id_request'], $params['id_place']);

        $records = [];
        foreach ($data as $record) {
            $records[] = $record;
        }

        $this->sendAnswer(new Falcon_Message($records));
    }

    /**
     * Action for create line(s) in grid request.
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
    protected function createLine($params, $firmid)
    {
        $request = new Falcon_Record_Dn_Request($params->id_request);
        if ($request->get('id_firm') != $firmid) {
            Throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }
        $record = new Falcon_Record_Dn_Request_Value([
            'id_request' => $params->id_request,
            'id_place' => $params->id_place,
            'id_product' => $params->id_product,
            'amount' => $params->amount,
            'state' => 1
        ]);

        try {
            $record->insert();
        } catch (Zend_Db_Statement_Exception $e) {
            // ExtJS с перепугу послал создаваться уже существующую запись
            $id = $this->updateLine($params, $firmid);
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
    protected function updateLine($params, $firmid)
    {
        $request = new Falcon_Record_Dn_Request($params->id_request);

        if (!empty($params->id)) {
            $record = new Falcon_Record_Dn_Request_Value($params->id);
        } else {
            $record = Falcon_Mapper_Dn_Request_Value::getInstance()
                ->load([
                    'id_request = ?' => $params->id_request,
                    'id_place = ?' => $params->id_place,
                    'id_product = ?' => $params->id_product
                ]);

            $record = current($record);
        }

        if ($request->get('id_firm') != $firmid ||
            $record->get('id_request') != $request->getId()
        ) {
            Throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        $update = [
            'amount' => $params->amount
        ];
        $record->setProps($update)->update();

        return $record->getId();
    }

    /**
     * destroy all lines in grid (only being called from destroyAction)
     */
    protected function linedestroyAction($requestId)
    {
        Falcon_Mapper_Dn_Request_Value::getInstance()
            ->trashAllInRequest($requestId);
    }

    /**
     * TODO COMMENT THIS!
     */
    public function editloadAction()
    {
        $user = $this->getUserData();
        $params = $this->getRequestParams();

        if (empty($params)) {
            return $this->sendAnswer();
        }

        $data = Falcon_Mapper_Dn_Request::getInstance()
            ->loadWarehouseWithAmount($params['id_request']);

        $this->sendAnswer(new Falcon_Message($data));
    }

    /**
     * TODO COMMENT THIS!
     */
    public function answerloadAction()
    {
        $params = $this->getRequestParams();
        if (empty($params)) {
            return $this->sendAnswer();
        }
        $data = Falcon_Mapper_Dn_Response::getInstance()
            ->loadByRequest($params['id_request']);
        $this->sendAnswer(new Falcon_Message($data));
    }

    /**
     * Fetches user data in convenient format
     * @return Array
     */
    protected function getUserData()
    {
        $user = Falcon_Model_User::getInstance();
        return $user->getRecord()->toArray();
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

        if (empty($return['id_request']) || !is_numeric($return['id_request'])) {
            return false;
        }

        return $return;
    }

    /**
     * Sends e-mail notification to all active suppliers
     * @param {int} $tenderFirmId Identifier of firm
     */
    private function notifySuppliers($tenderId, $tenderFirmId)
    {
        // notify manager
        // then let's activate users in this firm
        Falcon_Logger::getInstance()->log('info',
            'Tender approved::sending mails...');

        $mr = Falcon_Mapper_Dn_Request::getInstance();
        $tender = $mr->loadRecord($tenderId, true);

        $sdt = new DateTime(date('d.m.Y H:i:s', strtotime($tender['sdt'])));
        $edt = new DateTime(date('d.m.Y H:i:s', strtotime($tender['edt'])));
        $sdt->modify('+4 hour');
        $edt->modify('+4 hour');

        $tender['sdt'] = $sdt->format('d.m.Y H:i') . ' MSK';
        $tender['edt'] = $edt->format('d.m.Y H:i') . ' MSK';

        $places = $mr->loadWarehouseWithAmount($tender['id'], false);
        foreach ($places as &$warehouse) {
            $warehouse['data'] = Falcon_Mapper_Dn_Request_Value::getInstance()
                ->loadRequestFull($tender['id'], $warehouse['id'], false);
        }
        $tender['data'] = $places;

        $config = Zend_Registry::get('config');
        $tenderFirm = new Falcon_Record_X_Firm($tenderFirmId, false, false);
        $clients = $tenderFirm->getActiveClients();
        $usersList = [];
        foreach ($clients as $record) {
            // then let's send firm to trash
            $firm = new Falcon_Model_Firm($record['id_firm_client']);
            // retrieve users list
            $users = $firm->getFirmUsers();
            foreach ($users as $user)
                $usersList[] = $user;
        }
        foreach ($usersList as $user) {
            $email = $user->getEmail();
            Falcon_Logger::getInstance()->log('info',
                'Tender email', $email);
            // notify user by email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/tender_start',
                [
                    'user' => $user,
                    'tender' => $tender
                ],
                $config->variables->notifyEmail,
                $email
            );
        }
    }
}
