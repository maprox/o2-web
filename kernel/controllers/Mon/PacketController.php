<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 *
 * Rest controller
 */
class Mon_PacketController extends Falcon_Controller_Action_Rest
{
    /**
     * Http client packet input
     */
    public function createAction()
    {
        $answer = new Falcon_Message();
        try {
            $list = Zend_Json::decode($this->getParam('list'));
        } catch (Exception $e) {
            return $answer->error(
                Falcon_Exception::BAD_REQUEST, $e->getMessage());
        }
        if (empty($list)) {
            $packet = [
                'device_key' => $this->getParam('device_key'),
                'uid' => $this->getParam('uid'),
                'time' => $this->getParamByAlias(
                    ['time', 't', 'date', 'dt']),
                'latitude' => $this->getParamByAlias(
                    ['latitude', 'lat', 'lt']),
                'longitude' => $this->getParamByAlias(
                    ['longitude', 'lon', 'ln']),
                'altitude' => $this->getParamByAlias(
                    ['altitude', 'alt', 'al']),
                'speed' => $this->getParamByAlias(
                    ['speed', 'spd', 'sp', 's']),
                'azimuth' => $this->getParamByAlias(
                    ['azimuth', 'azm', 'az', 'direction', 'dir', 'd']),
                'satellitescount' => $this->getParamByAlias(
                    ['satellitescount', 'sc']),
                'hdop' => $this->getParamByAlias(['hdop']),
                'odometer' => $this->getParamByAlias(['odometer']),
                'sensors' => json_decode($this->getParamByAlias(
                    ['sensors']))
            ];
            $accuracy = (int)$this->_getParam('accuracy', '-1');
            if (!isset($packet['sensors'])) {
                $packet['sensors'] = [];
            }
            $packet['sensors'] = (array)$packet['sensors'];
            if ($accuracy >= 0) {
                $packet['sensors']['accuracy'] =
                    $accuracy > 0 ? $accuracy : 1;
            }
            $list = [$packet];
        }

        // store received packets
        foreach ($list as $packet) {

            // convert object to array
            $packet = (array)$packet;
            if (isset($packet['sensors'])) {
                $packet['sensors'] = (array)$packet['sensors'];
            }

            $deviceUid = $packet['uid'];
            $deviceKey = $packet['device_key'];

            // search device by its uid
            $device = Falcon_Mapper_Mon_Device::getInstance()
                ->loadByUid($deviceUid, true);
            if (!$device || !$device->isActive()) {
                return $answer;
            } else {
                if (!Falcon_Mapper_Mon_Device::checkDeviceKey(
                    $device->get('id_firm'), $deviceUid, $deviceKey)
                ) {
                    return $answer->error(
                        Falcon_Exception::ACCESS_VIOLATION, [
                        "Forbidden. Please, check [device_key] parameter"
                    ]);
                }
            }

            Falcon_Amqp::sendTo('mon.device',
                'packet.create.' . $deviceUid, $packet);
        }
        return $answer;
    }

    /**
     * Completely removes all packets for the specified device
     */
    public function clearAction()
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();

        if (!$this->getRequest()->isPut()) {
            return $answer;
        }

        // Device id
        $deviceId = $this->getParam('id_device');

        if (!$deviceId) {
            return $answer;
        }

        $user = Falcon_Model_User::getInstance();

        // Check can_clear_packets right
        if (!$user->hasRight('can_clear_packets')) {
            return $answer;
        }

        // Check device right
        Falcon_Access::checkWrite('mon_device', $deviceId);

        // Write log
        $logger->log('clear_packets', $deviceId);

        // Delete packets from database
        $t = new Falcon_Table_Mon_Packet();
        $t->clearPacketsForDevice($deviceId);

        return $answer;
    }
}