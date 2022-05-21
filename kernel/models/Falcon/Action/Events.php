<?php

/**
 * Class for working with events, called by cron
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Events extends Falcon_Action_Abstract
{
    /**
     * Run scheduled task for generating events
     * @return {string} Database server time
     */
    function process()
    {
        $serverTime = $this->changeConnectionStatus();
        $this->setUnconfigureDevices();
        return $serverTime;
    }

    /**
     * Run scheduled task for checking device connetcion and generating events
     */
    protected function changeConnectionStatus()
    {
        $mapperMonDevice = Falcon_Mapper_Mon_Device::getInstance();
        $mapperMonPacket = Falcon_Mapper_Mon_Packet::getInstance();
        $serverTime = $mapperMonDevice->dbDate();
        $time = strtotime($serverTime);

        $devices = $mapperMonDevice->load();
        $settings = Falcon_Mapper_Mon_Device_Setting::getInstance()
            ->load(['option = ?' => 'freq_idle']);
        $periods = [];
        foreach ($settings as $setting) {
            $periods[$setting->get('id_device')] = $setting->get('value');
        }

        $config = Zend_Registry::get('config')->tracker;
        foreach ($devices as $device) {
            $id = $device->get('id');
            if ($id == -1 || $id == 0) {
                continue;
            }

            $period = empty($periods[$id]) ?
                $config->default_freq : $periods[$id];
            $period += $config->bad_connection_gap;

            $lastpacket = strtotime($device->get('lastpacket'));
            $lastconnect = strtotime($device->get('lastconnect'));

            $currData = ($time - $lastpacket < $period);
            $currConnected = ($time - $lastconnect < $period);
            $prevData = (bool)$device->get('connected');
            $prevConnected = (bool)$device->get('connection_status');

            if ($currData != $prevData || $currConnected != $prevConnected) {
                $device->connectionChanged($currData, $currConnected);

                $packet = $mapperMonPacket->getLastForDevice($id);
                // Connection change can happen even for a device with only state=deleted packets
                // We can't send notifications based on these packets
                if (empty($packet)) {
                    continue;
                }
            }

            // Add connection event
            if ($currConnected != $prevConnected) {
                $device->addConnectionEvent($currConnected);
            }
        }
        return $serverTime;
    }

    /**
     * Run scheduled task to see, if there are some devices,
     * that were configured, but have not recieved packets
     */
    protected function setUnconfigureDevices()
    {
        $mapper = Falcon_Mapper_Mon_Device::getInstance();
        $records = $mapper->load([
            'configured = ?' => Falcon_Action_Device_Configure::STATUS_SMS_RECIEVED,
            'last_configured_change < ?' => $mapper->dbDate('-1 day')
        ], true);
        foreach ($records as $record) {
            $device = new Falcon_Model_Device($record['id']);
            Falcon_Action_Device_Configure::setStatus($device,
                Falcon_Action_Device_Configure::STATUS_PACKET_FAILED);
        }
    }
}
