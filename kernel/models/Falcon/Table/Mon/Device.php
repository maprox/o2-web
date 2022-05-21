<?php

/**
 * Table "mon_device"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Table_Mon_Device extends Falcon_Table_Common
{
    protected $sqlAddDeviceEvent = 'select * from event(?, ?, ?, ?)';

    /**
     * Generates event in database
     * @param {Integer} $id Device id
     * @param {String} $name Name of the event
     * @param {Integer} $lastPacketId Id of this device's lastpacket
     */
    public function addDeviceEvent($id, $name, $lastPacketId)
    {
        $timestamp = $this->dbDate();

        $this->query($this->sqlAddDeviceEvent, [$id, $name, $lastPacketId,
            $timestamp]);
    }

    /**
     * Returns today packet params for the specified device
     * @param {Integer} $id Device id
     * @return Array
     */
    public function getTodayParams($id)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_packet', [
                'packetsCount' => 'count(*)',
                'mileage' => 'max(odometer) - min(odometer)'
            ])
            ->where('id_device = ?', $id)
            ->where('time >= current_date')
            ->where('time < current_date + \'1 day\'::interval')
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
        $rows = $db->query($sql)->fetchAll();
        $this->tryToCastRowsToInt($rows);
        if (empty($rows)) {
            return [
                'packetsCount' => 0,
                'mileage' => 0
            ];
        } else {
            return $rows[0];
        }
    }
}
