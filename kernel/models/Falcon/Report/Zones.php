<?php

/**
 * Zones movement report
 * /reports/observer/monitoring/movement_2
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Report_Zones extends Falcon_Report_Common
{
    /**
     * On before request
     */
    public function onBeforeRequest()
    {
        $user = Falcon_Model_User::getInstance();

        $zones = $this->request['params']['zone'];
        $devices = $this->request['params']['device'];
        $period = $this->request['params']['period'];
        $sdt = $user->correctDate($period->sdt);

        // Calculate mon_geofence presence if needed
        $mgp = Falcon_Mapper_Mon_Geofence_Presence::getInstance();
        foreach ($devices as $deviceId) {
            $mgp->maybeAutoCalculate($deviceId, $zones, $sdt);
        }
    }
}