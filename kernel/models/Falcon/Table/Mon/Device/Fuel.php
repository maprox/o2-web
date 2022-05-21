<?php

/**
 * Table "mon_device_fuel"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Table_Mon_Device_Fuel extends Falcon_Table_Common
{
    /**
     * Returns last fuel item edt for device
     * @param int $deviceId
     * @param int $tankNumber
     * @return String
     */
    public function getEdtForDevice($deviceId, $tankNumber = 1)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_device_fuel', ['edt'])
            ->where('id_device = ?', $deviceId)
            ->where('tank_number = ?', $tankNumber)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->order('edt desc')
            ->limit(1);

        return $db->query($sql)->fetchColumn();
    }
}