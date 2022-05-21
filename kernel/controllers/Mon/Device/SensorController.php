<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Mon_Device_SensorController extends Falcon_Controller_Action_Rest
{

    /**
     * Returns points for chart plotting
     */
    public function chartpointsAction()
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();

        $deviceId = $this->getParam('id_device');

        if (!$deviceId) {
            return $answer;
        }

        // Check device right
        Falcon_Access::checkRead('mon_device', $deviceId);

        // Get edt and sdt
        $sdt = $this->getParam('sdt');
        $edt = $this->getParam('edt');

        if (!$sdt) {
            return $answer;
        }

        if (!$edt) {
            return $answer;
        }

        $t = new Falcon_Table_Mon_Device_Sensor();

        $points = $t->getChartPoints($deviceId, $sdt, $edt);

        $grouped = [];

        // Group points by time
        foreach ($points as $point) {
            if (!isset($grouped[$point['time']])) {
                $grouped[$point['time']] = [];
            }

            $grouped[$point['time']]['time'] = $point['time'];

            $val = $point['val'];
            if ($point['val_conv'] !== null) {
                $val = $point['val_conv'];
            }

            if ($point['name']) {
                $grouped[$point['time']][$point['name']] = (float)$val;
            }
        }

        $answer->addParam('data', array_values($grouped));

        return $answer;
    }
}
