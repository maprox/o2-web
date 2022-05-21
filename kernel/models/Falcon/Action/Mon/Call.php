<?php

/**
 * Action "mon_call"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Call extends Falcon_Action_Rest_Common
{
    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeCreate($c)
    {
        // TODO: action mon_packet have the same check. Should it be abstract?
        if (!parent::onBeforeCreate($c)) {
            return false;
        }

        $params = $this->getParams();

        if (!isset($params['id_device'])) {
            return false;
        }

        $idDevice = $params['id_device'];

        // Check device access
        Falcon_Access::checkWrite('mon_device', $idDevice);

        // Check if id_packet belongs to device
        if (isset($params['id_packet'])) {
            $packetRecord = new Falcon_Record_Mon_Packet($params['id_packet']);

            if ((int)$packetRecord->get('id_device') !== (int)$idDevice) {
                throw new Falcon_Exception(
                    '',
                    Falcon_Exception::ACCESS_VIOLATION,
                    ['Wrong id_packet']
                );
            }
        }
    }
}
