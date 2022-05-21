<?php

/**
 * Table "dn_response"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Response extends Falcon_Mapper_Common
{

    /**
     * Loads all requests and responses statuses
     * @param Integer $firmId users firm Id
     * @return Array request data
     */
    public function loadAllByFirm($userId, $firmId, $toArray)
    {
        $created = Falcon_Mapper_Dn_Request::getInstance()->load([
            'status = ?' => 2,
            'edt > ?' => $this->dbDate()],
            true);

        $modified = $this->getTable()->loadRequests($firmId);

        $return = [];
        $needInsert = [];
        foreach ($created as $record) {
            $id = $record['id'];
            $needInsert[$id] = $record;
        }

        foreach ($modified as $record) {
            $id = $record['id_request'];
            $return[$id] = $record;
            unset($needInsert[$id]);
        }

        foreach ($needInsert as $record) {
            $id = $record['id'];

            $insert = new Falcon_Record_Dn_Response([
                'id_firm' => $firmId,
                'id_user' => $userId,
                'id_request' => $id,
                'state' => 1,
                'status' => 1,
            ]);
            $insert->insert();

            $return[$id] = [
                'id' => $insert->getId(),
                'id_request' => $id,
                'num' => $record['num'],
                'sdt' => $record['sdt'],
                'edt' => $record['edt'],
                'status' => 1,
            ];
        }

        return array_values($return);
    }

    public function loadByRequest($requestId)
    {
        return $this->getTable()->loadByRequest($requestId);
    }

}
