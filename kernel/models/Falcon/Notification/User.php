<?php

/**
 * User action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_User extends Falcon_Notification_Abstract
{
    /**
     * Executes an action
     * @return {Falcon_Sender_Response}
     */
    public function execute()
    {
        $logger = Falcon_Logger::getInstance();
        // Get work
        $work = $this->getWork();

        // Get user
        $userId = $work->get('send_to');
        $user = new Falcon_Model_User($userId);

        // Get notification importance
        if ($work->get('params')) {
            $params = $work->get('params');
            $params = json_decode($params, true);

            if (isset($params['id_importance'])) {
                $importanceId = $params['id_importance'];
            }
        }

        // Get notification settings with specified importance
        $notificationSettings
            = $user->getNotificationSettings($importanceId);

        // For each notification settings create and execute new work
        $m = Falcon_Mapper_N_Work::getInstance();
        foreach ($notificationSettings as $setting) {
            if (!$setting['active']) {
                continue;
            }
            // Prevent recursion
            if ($setting['type_name'] == 'user') {
                continue;
            }

            // Get data
            $data = $work->toArray();

            // If no address given or popup
            // This work addressed parent work send_to
            $sendTo = null;
            if (isset($setting['address'])) {
                $sendTo = $setting['address'];
            }
            // TODO: hardcoded popup alias?
            if (!$sendTo || $setting['type_name'] == 'popup') {
                $sendTo = (int)$data['send_to'];
            }

            if ($setting['type_name'] == 'telegram') {
                Falcon_Amqp::sendTo('n.work', 'telegram.send', [
                    'send_to' => $sendTo,
                    'message' => $data['message'],
                ]);
            } else {
                // Create sub work
                $workId = $m->add($setting['type_name'], [
                    'send_to' => $sendTo,
                    'message' => $data['message'],
                    'id_firm' => $data['id_firm'],
                    'id_user' => $data['id_user'],
                    'callback' => $data['callback'],
                    'params' => json_decode($data['params'], true)
                ]);
                // Execute sub work
                $subWork = new Falcon_Record_N_Work($workId);
                $subWork->execute();
            }
        }

        return new Falcon_Sender_Response();
    }
}