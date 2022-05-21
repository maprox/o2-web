<?php

/**
 * Action "x_notification" from mon_geofence_inout event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Connection_Loss
    extends Falcon_Action_X_Notification_Abstract
{
    /**
     * Returns an array of notification params
     * according to supplied input params
     * @param array $record Notification record
     * @param array $input
     * @return array
     */
    public function getNotificationParams($record, $input)
    {
        $result = [];

        $notificationId = $record['id'];
        $stateTime = $input['dt'];
        $mp = Falcon_Mapper_Mon_Packet::getInstance();
        $t = new Falcon_Table_X_Notification();
        $devices = $t->getNotificationParamIds(
            $notificationId, 'mon_device', $stateTime);

        foreach ($devices as $deviceId) {
            // Get last packet
            $packet = $mp->getLastForDevice($deviceId);

            $input['packet'] = $packet;

            $params = [
                'mon_device' => $deviceId
            ];
            $stateHash = json_encode($params);
            $result[] = array_merge($input, $params, [
                'statetime' => $stateTime,
                'statehash' => $stateHash
            ]);
        }

        return $result;
    }

    /**
     * Returns next state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStateNext($record, &$input)
    {
        $logger = Falcon_Logger::getInstance();

        $notificationId = $record['id'];
        $dt = $input['dt'];

        // Get loss time param
        $lossTime = $this->getParamValue($notificationId, 'loss_time');

        // Get last connect
        $deviceId = $input['mon_device'];
        $record = new Falcon_Record_Mon_Device($deviceId);
        $lastconnect = $record->get('lastconnect');

        if (!$lastconnect) {
            return 0;
        }

        $result = ((strtotime($dt) - strtotime($lastconnect)) < (int)$lossTime);

        return (int)$result;
    }
}
