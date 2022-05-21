<?php

/**
 * Message action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2016, Maprox LLC
 */
class Falcon_Notification_Action_Message
    extends Falcon_Notification_Action_Abstract_Message
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
        $messageFormatFieldName = 'message_' . $state;
        $messageFormatOriginal = isset($record[$messageFormatFieldName]) ?
            $record[$messageFormatFieldName] :
            'Unknown field: ' . $messageFormatFieldName;

        $params = $this->action['params'];
        $type = $this->action['id_action_type'];

        $logger->log('notif', 'createWorks', [
            'action' => $this->action,
            'params' => $params,
            '$messageFormatOriginal' => $messageFormatOriginal,
            '$messageFormatFieldName' => $messageFormatFieldName
        ]);

        $fmt = $messageFormatOriginal;
        $message = $this->getMessage($fmt, $input);

        foreach ($params as $param) {
            $paramsArray = [
                'locale' => $user->getLocale(),
                'id_importance' => $record['id_importance']
            ];
            // If message related to packet
            if (isset($input['packet'])) {
                $paramsArray['packetId'] = $input['packet']->get('id');
            }

            $routingKey = 'work.process';
            if ($type == 12) { // temp solution for telegram
                $routingKey = 'telegram.send';
            }
            Falcon_Amqp::sendTo('n.work', $routingKey, [
                'id_notification_action_type' => $type,
                'message' => $message,
                'params' => $paramsArray,
                'send_to' => $param['value'],
                // write wich firm is responsible for this n_work
                // for later billing of an sms messages
                'id_firm' => $user->get('id_firm'),
                'id_user' => $user->getId()
            ]);
        }
    }
}