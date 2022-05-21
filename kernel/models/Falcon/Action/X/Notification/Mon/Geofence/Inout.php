<?php

/**
 * Action "x_notification" from mon_geofence_inout event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Geofence_Inout
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
        $packet = $input['packet'];
        $deviceId = $packet->get('id_device');
        $stateTime = $packet->get('time');

        $t = new Falcon_Table_X_Notification();
        $geofences = $t->getNotificationParamIds(
            $notificationId, 'mon_geofence', $stateTime);

        foreach ($geofences as $geofenceId) {
            $params = [
                'mon_geofence' => $geofenceId,
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
        $m = Falcon_Mapper_Mon_Geofence::getInstance();
        return $m->isDeviceInGeofence(
            $input['mon_geofence'],
            $input['mon_device'],
            $input['statetime']
        ) ? 1 : 0;
    }
}
