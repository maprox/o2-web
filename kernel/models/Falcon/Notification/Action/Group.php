<?php

/**
 * Group action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Action_Group
    extends Falcon_Notification_Action_Abstract
{
    /**
     * Create works
     * @param $record
     * @param input
     * @param $state
     */
    public function createNotifWorks($record, $input, $state, $user)
    {
        $logger = Falcon_Logger::getInstance();

        $params = $this->action['params'];
        $type = $this->action['id_action_type'];

        $logger->log('notif', 'createWorks', [
            'action' => $this->action,
            'params' => $params
        ]);

        $device = isset($input['mon_device']) ?
            $input['mon_device'] : null;

        foreach ($params as $param) {
            Falcon_Amqp::sendTo('n.work', 'work.process', [
                'id_notification_action_type' => $type,
                'message' => '',
                'params' => [
                    'device' => $device,
                    'groups' => [$param['value']]
                ],
                'send_to' => $param['value'], // group add or remove
                // write wich firm is responsible for this n_work
                // for later billing of an sms messages
                'id_firm' => $user->get('id_firm'),
                'id_user' => $user->getId()
            ]);
        }
    }
}