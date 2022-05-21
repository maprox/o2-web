<?php

/**
 * Action "x_notification" from mon_alarm_button event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Alarm_Button
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
        $logger = Falcon_Logger::getInstance();
        //$logger->log('zend', '======get notif params =====');
        //$logger->log('zend', $input);

        $result = [];

        $notificationId = $record['id'];
        $packet = $input['packet'];
        $deviceId = $packet->get('id_device');
        $stateTime = $packet->get('time');

        // If need to check only within geofence
        $checkIn = $this->getParamValue($notificationId, 'check_in_geofence');
        //$logger->log('zend', 'params: checkin ' . $checkIn);
        if ($checkIn) {
            // Get checked geofences ids
            $t = new Falcon_Table_X_Notification();
            $geofences = $t->getNotificationParamIds(
                $notificationId, 'mon_geofence', $stateTime);

            foreach ($geofences as $geofenceId) {
                $params = [
                    'mon_geofence' => $geofenceId,
                    'mon_device' => $deviceId,
                ];
                $stateHash = json_encode($params);
                $result[] = array_merge($input, $params, [
                    'statetime' => $stateTime,
                    'statehash' => $stateHash
                ]);
            }
        } else {
            // Check on the whole map
            $params = [
                'mon_device' => $deviceId
            ];
            $result[] = array_merge($input, $params, [
                'statetime' => $stateTime,
                'statehash' => json_encode($params)
            ]);
        }

        return $result;
    }

    /**
     * Returns previous state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStatePrev($record, $input)
    {
        // Allways 0
        return 0;
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
        //$logger->log('zend', $input);

        $notificationId = $record['id'];

        // Check if is sos packet
        $m = Falcon_Mapper_Mon_Packet::getInstance();
        if (!$m->isSosPacket($input['packet'])) {
            //$logger->log('zend', 'not sos packet');
            // If not sos packet, return 0
            return 0;
        }

        $logger->log('notif', 'Sos packet!');

        // If only need to check in geofences
        $checkIn = $this->getParamValue($notificationId, 'check_in_geofence');
        //$logger->log('zend', 'getStateNext: checkin ' . $checkIn);
        if ($checkIn) {
            $m = Falcon_Mapper_Mon_Geofence::getInstance();
            $inGeofence = $m->isDeviceInGeofence(
                $input['mon_geofence'],
                $input['mon_device'],
                $input['statetime']
            ) ? 1 : 0;

            //$logger->log('zend', 'InGeofence '. $inGeofence);

            return $inGeofence;
        }

        return 1;
    }
}
