<?php

/**
 * Message action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Action_Abstract_Message
    extends Falcon_Notification_Action_Abstract
{
    /**
     * Returns formatted message
     * @param string $fmt
     * @param array $input
     * @return string
     */
    public function getMessage($fmt, $input)
    {
        $logger = Falcon_Logger::getInstance();
        $result = $fmt;
        if (isset($input['mon_geofence'])) {
            $record = new Falcon_Record_Mon_Geofence($input['mon_geofence']);
            $result = str_replace('%ZONE%', $record->get('name'), $result);
        }
        if (isset($input['mon_device'])) {
            $device = new Falcon_Record_Mon_Device($input['mon_device']);
            $result = str_replace('%DEVICE%', $device->get('name'), $result);
        }
        if (isset($input['packet'])) {
            $packet = $input['packet'];
            $originalPacket = $input['packet'];
        }
        // If we should use another packet to define message params
        // except %TIME%
        if (isset($input['force_packet'])) {
            $packet = $input['force_packet'];
        }

        // Get user
        $user = null;
        if (isset($input['id_user']) && $input['id_user']) {
            $user = new Falcon_Model_User($input['id_user']);
        }

        // Server time
        $serverTime = date(DB_DATE_FORMAT);
        if ($user) {
            $serverTime = $user->correctDate($serverTime, false);
        }
        $result = str_replace('%SERVER_TIME%', $serverTime, $result);

        if (isset($input['packet'])) {
            //$packet = $input['packet'];
            $device = new Falcon_Record_Mon_Device($packet->get('id_device'));

            // device name
            $result = str_replace('%DEVICE%', $device->get('name'), $result);

            // last connect
            $lastConnect = $device->get('lastconnect');
            if ($lastConnect) {
                $lastConnect = $user->correctDate($lastConnect, false);
            }
            $result = str_replace('%LAST_CONNECT%', $lastConnect, $result);

            // packet time
            // Allways form original packet
            $packetTime = $originalPacket->get('time');
            if ($user) {
                $packetTime = $user->correctDate($packetTime, false);
            }
            $result = str_replace('%TIME%', $packetTime, $result);

            // packet speed
            $packetSpeed = round($packet->get('speed'));
            $result = str_replace('%SPEED%', $packetSpeed, $result);

            // packet coordinates
            $lat = $packet->get('latitude');
            $lon = $packet->get('longitude');

            $result = str_replace('%LAT%', $lat, $result);
            $result = str_replace('%LON%', $lon, $result);

            // links
            $result = str_replace('%LINK_GOOGLE%',
                "http://maps.google.com/maps?" .
                "ll=$lat,$lon&q=$lat,$lon&t=k", $result);
            $result = str_replace('%LINK_OSM%',
                "http://www.openstreetmap.org/index.html?" .
                "mlat=$lat&mlon=$lon&zoom=17", $result);
            $result = str_replace('%LINK_YANDEX%',
                "http://maps.yandex.ru/?" .
                "ll=$lon,$lat&z=17&pt=$lon,$lat", $result);

            // packet address
            $packetAddress = $packet->getAddress();
            $result = str_replace('%ADDRESS%', $packetAddress, $result);
        }
        if (isset($input['device_sensor'])) {
            $deviceSensor = $input['device_sensor'];
            $packetSensor = new Falcon_Record_Mon_Packet_Sensor();
            $packetSensor->set('val', $input['packet_sensor']['val']);
            $packetSensor->set('val_conv', $input['packet_sensor']['val_conv']);

            $result = str_replace('%SENSOR%', $deviceSensor['name'], $result);
            $result = str_replace('%SENSOR_VALUE%',
                $packetSensor->getValue(
                    $deviceSensor['unit'],
                    $deviceSensor['precision']
                ),
                $result
            );
        }

        return $result;
    }
}