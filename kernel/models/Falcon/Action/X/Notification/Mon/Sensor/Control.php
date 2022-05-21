<?php

/**
 * Action "x_notification" from mon_overspeed event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Sensor_Control
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

        $result = [];

        $notificationId = $record['id'];
        $packet = $input['packet'];
        $deviceId = $packet->get('id_device');
        $stateTime = $packet->get('time');

        // If need to check sensors only inside geofences
        $checkIn = $this->getParamValue($notificationId, 'check_in_geofence');

        $dm = Falcon_Mapper_Mon_Device::getInstance();

        $mds = Falcon_Mapper_Mon_Device_Sensor::getInstance();
        $deviceSensors = $mds->loadBy(function ($sql) use ($deviceId) {
            $sql->where('id_device = ?', $deviceId)
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
        });

        // Different state for each sensor
        // If check only in geofences
        if ($checkIn) {
            // Get checked geofences ids
            $t = new Falcon_Table_X_Notification();
            $geofences = $t->getNotificationParamIds(
                $notificationId, 'mon_geofence', $stateTime);
        }

        // Get packet sensors
        $ms = Falcon_Mapper_Mon_Packet_Sensor::getInstance();
        $sensors = $ms->loadByPacket($packet->get('id'));

        foreach ($deviceSensors as $deviceSensor) {
            // max or min value of sensor should be specified
            if (!$deviceSensor['val_max'] && !$deviceSensor['val_min']) {
                continue;
            }

            // Find corresponding packet sensor
            $packetSensor = null;
            foreach ($sensors as $sensor) {
                if ($sensor['id_device_sensor'] === $deviceSensor['id']) {
                    $packetSensor = $sensor;
                    break;
                }
            }

            if (!$packetSensor) {
                continue;
            }

            if ($checkIn) {
                foreach ($geofences as $geofenceId) {
                    $params = [
                        'mon_device_sensor' => $deviceSensor['id'],
                        'mon_geofence' => $geofenceId,
                        'mon_device' => $deviceId,
                    ];
                    $stateHash = json_encode($params);
                    $result[] = array_merge($input, $params, [
                        'statetime' => $stateTime,
                        'statehash' => $stateHash,
                        'device_sensor' => $deviceSensor,
                        'packet_sensor' => $packetSensor
                    ]);
                }
            } else {
                // Check on the whole map
                $params = [
                    'mon_device_sensor' => $deviceSensor['id'],
                    'mon_device' => $deviceId
                ];
                $result[] = array_merge($input, $params, [
                    'statetime' => $stateTime,
                    'statehash' => json_encode($params),
                    'device_sensor' => $deviceSensor,
                    'packet_sensor' => $packetSensor
                ]);
            }
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
        $prevState = $this->getStatePrev($record, $input);
        $notificationId = $record['id'];

        $deviceSensor = $input['device_sensor'];

        $packet = $input['packet'];

        $packetSensor = $input['packet_sensor'];

        $packetSensorVal = $packetSensor['val_conv']
            ? $packetSensor['val_conv'] : $packetSensor['val'];

        // Exceed
        $exceed = 0;

        if (!$packetSensor) {
            return 0;
        }

        $mp = Falcon_Mapper_Mon_Packet::getInstance();
        // Check min value
        if ($deviceSensor['val_min']) {

            // Convert val_min if needed
            $dummySensor = new Falcon_Record_Mon_Packet_Sensor([
                'val' => $deviceSensor['val_min']
            ]);

            $mp->applySensorConversion($dummySensor, $deviceSensor);
            $valMin = $dummySensor->getValue();

            if ($packetSensorVal < $valMin) {
                $exceed = 1;
            }
        }

        // Check max value
        if ($deviceSensor['val_max']) {
            // Convert val_max if needed
            $dummySensor = new Falcon_Record_Mon_Packet_Sensor([
                'val' => $deviceSensor['val_max']
            ]);

            $mp->applySensorConversion($dummySensor, $deviceSensor);
            $valMax = $dummySensor->getValue();

            if ($packetSensorVal > $valMax) {
                $exceed = 1;
            }
        }

        // if not exceed ignore geofence presence
        if (!$exceed) {
            return 0;
        }

        // If only need to check in geofences
        $checkIn = $this->getParamValue($notificationId, 'check_in_geofence');
        if ($checkIn) {
            $m = Falcon_Mapper_Mon_Geofence::getInstance();
            $inGeofence = $m->isDeviceInGeofence(
                $input['mon_geofence'],
                $input['mon_device'],
                $input['statetime']
            ) ? 1 : 0;

            // If previous state is 1 and exceed and not in geofence
            if (!$inGeofence && $prevState) {
                // Return 1 to not send speed normalized notification
                // with exceeded speed
                return 1;
            }

            return $inGeofence;
        }

        return $exceed;
    }
}
