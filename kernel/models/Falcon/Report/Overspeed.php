<?php

/**
 * Over speed movement report
 * /reports/observer/monitoring/movement_2
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Report_Overspeed extends Falcon_Report_Common
{
    /**
     * On before request
     */
    public function onBeforeRequest()
    {
        $user = Falcon_Model_User::getInstance();

        /*$devices = $this->request['params']['device'];
        $period = $this->request['params']['period'];
        $speed = $this->request['params']['speed'];
        $sdt = $user->correctDate($period->sdt);
        $edt = $user->correctDate($period->edt);

        // Calculate packets address if needed
        foreach ($devices as $deviceId) {
            $packets = Falcon_Mapper_Mon_Packet::getInstance()->load(array(
                'id_device = ?' => $deviceId,
                'time >= ?' => $sdt,
                'time <= ?' => $edt,
                'address is null' => false,
                'speed >= ?' => $speed,
            ));
            foreach ($packets as $packet) {
                $packet->getAddress();
            }
        }*/
    }
}