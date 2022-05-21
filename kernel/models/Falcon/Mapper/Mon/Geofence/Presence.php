<?php

/**
 * Class of "mon_geofence_presence" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Geofence_Presence extends Falcon_Mapper_Common
{
    /**
     * Checks if device was located in specified geofence at specified time
     * @param int $geofenceId
     * @param int $deviceId
     * @param string $time
     * @return bool
     */
    public function isDeviceInGeofence($geofenceId, $deviceId, $time = null)
    {
        $records = $this->loadBy(
            function ($sql) use ($geofenceId, $deviceId, $time) {
                $sql
                    ->where('id_geofence = ?', $geofenceId)
                    ->where('id_device = ?', $deviceId)
                    ->order('sdt desc')
                    ->limit(1);
                if ($time) {
                    $sql->where('sdt <= ?', $time);
                }
            }, ['fields' => ['state']]
        );
        if (count($records)) {
            return ($records[0]['state'] > 0);
        }
        return false;
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $devices = Falcon_Mapper_Mon_Device::getInstance()
                ->loadByAccess(['fields' => 'id']);

            if (!empty($devices)) {
                array_walk($devices, function (&$d) {
                    $d = $d['id'];
                });
                $sql->where('id_device in (?)', $devices);
            } else {
                $sql->where('FALSE');
            }

            $sql->join('mon_geofence',
                'mon_geofence.id = t.id_geofence', []);
        }
        return 'mon_geofence';
    }

    /**
     * Check if presence
     * probably is not fully calculated for period started from $sdt
     * Defines calculation $edt and calculates
     * @param type $deviceId
     * @param type $zones
     * @param type $sdt
     */
    public function maybeAutoCalculate($deviceId, $zones, $sdt)
    {
        $logger = Falcon_Logger::getInstance();

        $mg = Falcon_Mapper_Mon_Geofence::getInstance();
        $mp = Falcon_Mapper_Mon_Packet::getInstance();

        // What geofences need to be calculated
        $calcGeofences
            = $mg->needPresenceCalc($deviceId, $zones, $sdt);

        foreach ($calcGeofences as $calcGeofence) {
            $calcGeofenceId = $calcGeofence['id'];

            // Stop calculation on this presence
            $lastPresence = null;
            // Packets for calculation will be loaded from sdt to recalcEdt
            $calcEdt = null;

            // Find first presence after sdt
            // It become be lastPresence
            $presenceAfterSdt = $this->loadBy(function ($sql)
            use ($calcGeofenceId, $deviceId, $sdt) {
                $sql->where('id_geofence = ?', $calcGeofenceId)
                    ->where('id_device = ?', $deviceId)
                    ->where('sdt > ?', $sdt)
                    ->order('sdt asc')
                    ->limit(1);
            });
            if (!empty($presenceAfterSdt)) {
                $calcEdt = $presenceAfterSdt[0]['sdt'];
                $lastPresence = $presenceAfterSdt[0];
            }

            // Load packets for period
            // If no last presence (no edt) load all packets from sdt
            $loadParams = [
                'time >= ?' => $sdt,
                'id_device = ?' => $deviceId
            ];
            if ($calcEdt) {
                $loadParams['time <= ?'] = $calcEdt;
            }
            $packets = $mp->load($loadParams, 'time');

            if (empty($packets)) {
                continue;
            }

            // Calculate
            $this->calculateGeofencePresence(
                $deviceId,
                $calcGeofence,
                $packets,
                $lastPresence
            );
        }
    }

    /**
     * Calculates geofence presence for sequence of packets
     * recalculate lastPresence if needed
     * @param type $deviceId
     * @param type $geofence
     * @param type $packets packets sequence ordered asc
     * @param type $lastPresence last presence entry for given
     * sequence of packets
     */
    protected function calculateGeofencePresence(
        $deviceId, $geofence, $packets, $lastPresence)
    {
        // Check if nothing to calculate
        // TODO:could it be checked in needPresenceCalc?
        if ($packets[0]->get('time') == $lastPresence['sdt']) {
            return;
        }

        // Prev state
        $prevState = null;
        // GeofenceId
        $geofenceId = $geofence['id'];
        // Device
        $device = new Falcon_Record_Mon_Device($deviceId);
        foreach ($packets as $packet) {
            $insideBounds = (
                $packet
                && $packet->get('latitude') < (float)$geofence['max_lat']
                && $packet->get('latitude') > (float)$geofence['min_lat']
                && $packet->get('longitude') < (float)$geofence['max_lon']
                && $packet->get('longitude') > (float)$geofence['min_lon']
            );

            if ($insideBounds) {
                $inside = Falcon_Mapper_Mon_Geofence::getInstance()->hasPoint(
                    $geofenceId,
                    $packet->get('latitude'),
                    $packet->get('longitude')
                );
            } else {
                $inside = false;
            }

            if ($lastPresence) {
                if ($packet->get('time') == $lastPresence['sdt']) {
                    if ($lastPresence['state'] == $prevState) {
                        // remove unnecessary dublicate presence
                        $lastPresenceRecord
                            = new Falcon_Record_Mon_Geofence_Presence(
                            $lastPresence['id']
                        );
                        $lastPresenceRecord->delete();
                    }
                }
            }

            // if previous state not equal current packet state
            // Create presence entry
            if ($prevState !== $inside) {
                $record = new Falcon_Record_Mon_Geofence_Presence([
                    'id_device' => $device->getId(),
                    'id_geofence' => $geofenceId,
                    'state' => (int)$inside,
                    'sdt' => $packet->get('time'),
                ]);
                $record->insert();
            }

            $prevState = $inside;
        }
    }
}