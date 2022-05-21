<?php

/**
 * Message action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Action_Url
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

        $params = $this->action['params'];
        $type = $this->action['id_action_type'];

        $logger->log('notif', 'createWorks', [
            'action' => $this->action
        ]);

        // Format url params values
        $urls = [];
        foreach ($params as $param) {
            $url = json_decode($param['value'], true);
            foreach ($url['params'] as &$urlParam) {
                $urlParam['value']
                    = $this->getMessage($urlParam['value'], $input);
            }

            // Format url
            $url['url']
                = preg_replace('/^(?!https?:\/\/)/ui', 'http://', $url['url']);
            $urls[] = $url;
        }

        foreach ($urls as $urlData) {
            Falcon_Amqp::sendTo('n.work', 'work.process', [
                'id_notification_action_type' => $type,
                'message' => '',
                'params' => $urlData,
                'send_to' => '',
                'id_firm' => $user->get('id_firm'),
                'id_user' => $user->getId()
            ]);
        }
    }
}