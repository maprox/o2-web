<?php

/**
 * Class of "x_notification" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Notification extends Falcon_Mapper_Common
{
    /**
     * Loads notifications by device id
     * @param int $deviceId
     * @param string $time [Opt.] defaults to current_timestamp
     * @return array
     */
    public function loadByDevice($deviceId, $time = null)
    {
        return $this->getTable()->loadByDevice($deviceId, $time);
    }

    /**
     * Process notification
     * @param array $record Notification record
     * @param array $params
     */
    public function process($record, $params)
    {
        if (!Falcon_Mapper_X_Schedule::getInstance()
            ->checkSchedule($record['id_schedule'])
        ) {
            return;
        }
        $typeId = $record['id_type'];
        $ne = Falcon_Action_X_Notification_Abstract::getInstance($typeId);
        foreach ($ne->getNotificationParams($record, $params) as $param) {
            $param['id_notification'] = $record['id'];
            $stateNext = $ne->getStateNext($record, $param);
            $statePrev = $ne->getStatePrev($record, $param);
            if (!$ne->statesAreEqual($stateNext, $statePrev)) {
                $ne->updateState($record, $param, $stateNext);
            }
        }
    }
}