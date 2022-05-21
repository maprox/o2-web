<?php

/**
 * Mapper for table "mon_device_action"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Action extends Falcon_Mapper_Common
{
    /**
     * Updates cache shared with python
     * @param {Integer} $deviceId
     * @param {String} $uid If not given, will be fetched from DB
     * @param {Integer} $protocol If not given, will be fetched from DB
     */
    public function writeSharedCache($deviceId, $uid = false, $protocol = false)
    {
        if (empty($uid) || empty($protocol)) {
            $device = new Falcon_Record_Mon_Device($deviceId);
            $uid = $device->get('identifier');
            $protocol = $device->get('protocol');
        }

        $data = $this->load([
            'id_device = ?' => $deviceId,
            'id_protocol = ?' => $protocol,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE,
            'edt is null' => false
        ], true);

        Falcon_Cacher::getInstance('pipe')->set($data, 'action', $uid);
    }

    /**
     * Updates cache shared with python controller
     */
    public function writeControllerCache()
    {
        $recordClass = $this->getRecordClassName();

        $data = $this->load([
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE,
            'action in (?)' => $recordClass::getControllerActions(),
            'edt is null' => false
        ], true);

        foreach ($data as &$item) {
            $item['handler'] = Falcon_Mapper_Mon_Device_Protocol::getInstance()
                ->getAliasForId($item['id_protocol']);

            if (!$item['id_device']) {

                if (!$item['value']) {
                    $item = null;
                    continue;
                }

                $params = json_decode($item['value'], true);

                if (!isset($params['identifier'])) {
                    $item = null;
                    continue;
                }

                $item['uid'] = $params['identifier'];
                continue;
            }

            $uid = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
                'id_protocol = ?' => $item['id_protocol'],
                'id_device = ?' => $item['id_device'],
                'option = ?' => 'identifier'
            ], true);

            if (!empty($uid)) {
                $item['uid'] = $uid[0]['value'];
            } else {
                $item = null;
            }
        }
        unset($item);

        Falcon_Cacher::getInstance('pipe')->set(array_filter($data), 'controller');
    }
}
