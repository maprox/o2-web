<?php

/**
 * Table "mon_device_ignition"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Device_Ignition extends Falcon_Table_Common
{
    /**
     * Returns last ignition item edt for device
     * @param int $deviceId
     * @return String
     */
    public function getEdtForDevice($deviceId)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_device_ignition', ['edt'])
            ->where('id_device = ?', $deviceId)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->order('edt desc')
            ->limit(1);

        return $db->query($sql)->fetchColumn();
    }
}