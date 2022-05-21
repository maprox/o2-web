<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012-2013, Maprox LLC
 *
 * Rest controller
 */
class Mon_CallController extends Falcon_Controller_Action_Rest
{
    /**
     *Http client call input
     */
    public function createAction()
    {
        $answer = new Falcon_Message();

        $call = new stdClass();
        $call->device_key = $this->getParam('device_key');
        $call->uid = $this->getParam('uid');
        $call->time = $this->getParamByAlias(['time']);
        $call->phone = $this->getParamByAlias(['phone']);
        $call->duration = $this->getParamByAlias(['duration']);
        $call->id_packet = $this->getParamByAlias(['id_packet']);
        $call->call_type = $this->getParamByAlias(['call_type']);
        //$call->cell_info = $this->getParamByAlias(array('cell_info'));

        // Create call
        $result = $this->createCall((object)$call);

        // Check answer
        if (!$result->isSuccess()) {
            $error = $result->getLastError();
            $params = $error && isset($error['params']) ?
                $error['params'] : [];
            $answer->error($error['code'], $params);

            return $answer->setSuccess(false);
        }
        // Success
        $result->delParam('data');
        return $result;
    }

    /**
     * Call creation
     * @param type $data
     * @return Falcon_Message
     */
    private function createCall($data)
    {
        if (!is_object($data)
            || !isset($data->device_key)
            || !isset($data->uid)
            || !isset($data->time)
            || !isset($data->phone)
            || !isset($data->duration)
        ) {
            $answer = new Falcon_Message();
            return $answer->error(Falcon_Exception::BAD_REQUEST,
                ["Invalid call structure"]);
        }

        $deviceUid = $data->uid;
        $deviceKey = $data->device_key;

        // search device by its uid
        $device = Falcon_Mapper_Mon_Device::getInstance()
            ->loadByUid($params['uid'], true);

        if (!$device || !$device->isActive()) {
            return new Falcon_Message();
        } else {
            if (!Falcon_Mapper_Mon_Device::checkDeviceKey(
                $device->get('id_firm'), $deviceUid, $deviceKey)
            ) {
                return $answer->error(Falcon_Exception::ACCESS_VIOLATION,
                    ["Forbidden. Please, check [device_key] parameter"]);
            }
        }

        // Check input data
        // Check if packet belongs to device
        if ($data->id_packet) {
            $packetRecord = new Falcon_Record_Mon_Packet($data->id_packet);
            if ((int)$packetRecord->get('id_device') !== $device->getId()) {
                return $answer->error(Falcon_Exception::ACCESS_VIOLATION,
                    ["Forbidden. Packet of given id doesn't exists"]);
            }
        }

        // Insert call
        $recordData = (array)$data;
        unset($recordData['device_key']);
        unset($recordData['uid']);
        $recordData['id_device'] = $device->getId();

        $record = new Falcon_Record_Mon_Call($recordData);
        $record->insert();

        // Add id
        $answer->addParam('id', $record->get('id'));

        return $answer;
    }
}