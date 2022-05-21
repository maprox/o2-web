<?php

/**
 * Action "x_notification" from mon_overspeed event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Mon_Signal_Loss
    extends Falcon_Action_X_Notification_Abstract
{
    /**
     * Returns an array of notification params
     * according to supplied input params
     * @param array $record Notification record
     * @param array $input
     * @return array
     */
    public function getNotificationParams($record, $input)
    {
        $logger = Falcon_Logger::getInstance();
        $result = [];

        $packet = $input['packet'];
        $deviceId = $packet->get('id_device');
        $stateTime = $packet->get('time');

        $params = [
            'mon_device' => $deviceId
        ];

        $result[] = array_merge($input, $params, [
            'statetime' => $stateTime,
            'statehash' => json_encode($params)
        ]);

        return $result;
    }

    /**
     * Returns next state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStateNext($record, &$input)
    {
        // check packet coordinates
        // nosignal - 0
        // signal - 1
        $packet = $input['packet'];
        $state = (int)!$input['packet']->isNoSignal();

        // If no signal get previous packet
        if (!$state) {
            // Get previous packet for message params
            $m = Falcon_Mapper_Mon_Packet::getInstance();

            $prevPacket = $m->loadBy(function ($sql) use ($packet) {
                $sql->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                    ->where('time < ?', $packet->get('time'))
                    ->where('id_device = ?', $packet->get('id_device'))
                    ->order('time desc')
                    ->limit(1);
            });

            if (count($prevPacket)) {
                $prevPacket = new Falcon_Record_Mon_Packet($prevPacket[0]['id']);
            }

            if ($prevPacket) {
                $input['force_packet'] = $prevPacket;
            }
        }

        return $state;
    }
}
