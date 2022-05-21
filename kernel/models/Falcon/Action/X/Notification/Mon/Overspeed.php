<?php

/**
 * Action "x_notification" from mon_overspeed event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Overspeed
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
        //$logger->log('zend', $record);
        //$logger->log('zend', $input);

        $result = [];

        $notificationId = $record['id'];
        $packet = $input['packet'];
        $deviceId = $packet->get('id_device');
        $stateTime = $packet->get('time');

        // If need to check speed limit only within geofence
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
     * Returns next state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStateNext($record, &$input)
    {
        $logger = Falcon_Logger::getInstance();
        // Get prev state
        $prevState = $this->getStatePrev($record, $input);
        $notificationId = $record['id'];
        // Get current speed
        $speed = $input['packet']->get('speed');
        // Get limit
        $limit = $this->getParamValue($notificationId, 'speed');
        /*$logger->log(
                'zend', 'sp ' . $speed
                . ' lim ' . $limit
                . ' nid ' . $notificationId
        );*/

        // Exceed
        $exceed = (int)($speed > $limit);

        // If not exceed, ignore geofence presence
        if (!$exceed) {
            return 0;
        }

        // If only need to check in geofences
        $checkIn = $this->getParamValue($notificationId, 'check_in_geofence');
        //$logger->log('zend', 'getStateNex: checkin ' . $checkIn);
        if ($checkIn) {
            $m = Falcon_Mapper_Mon_Geofence::getInstance();
            $inGeofence = $m->isDeviceInGeofence(
                $input['mon_geofence'],
                $input['mon_device'],
                $input['statetime']
            ) ? 1 : 0;

            //$logger->log('zend', 'InGeofence '. $inGeofence);

            // If previous state is 1 and exceed and not in geofence
            //$logger->log('zend', 'prevState ' . $prevState);
            if (!$inGeofence && $prevState) {
                // Return 1 to not send speed normalized notification
                // with exceeded speed
                //$logger->log('zend', 'force 1 return');
                return 1;
            }

            return $inGeofence;
        }

        return $exceed;
    }

    /**
     * Check if creation of notification works allowed
     * @param array $record Notification record
     * @param array $input
     * @param int $state
     * @return boolean
     */
    protected function allowCreateWorks($record, $input, $state)
    {
        $logger = Falcon_Logger::getInstance();
        $notificationId = $record['id'];

        // Get notify about normalization setting
        $noNormalization = $this->getParamValue($notificationId,
            'no_normalization');

        $nn = $noNormalization ? 'true' : 'false';
        $logger->log('overspeed', 'notification id: ' . $notificationId);
        $logger->log('overspeed', 'no_normalizaton: ' . $nn);
        $logger->log('overspeed', 'state: ' . $state);

        // Check if need to notify about normalization
        if ($noNormalization && $state == 0) {
            $logger->log('overspeed', 'do not create works');
            return false;
        }

        $logger->log('overspeed', 'need create works');
        return true;
    }
}
