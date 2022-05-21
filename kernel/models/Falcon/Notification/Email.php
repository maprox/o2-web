<?php

/**
 * Email action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Email extends Falcon_Notification_Abstract
{
    /**
     * Executes an action
     * @return {Falcon_Sender_Response}
     */
    public function execute()
    {
        $config = Zend_Registry::get('config');
        $work = $this->getWork();

        // Email template
        $template = 'simple_email';

        // Get params
        if ($work->get('params')) {
            $params = json_decode($work->get('params'), true);
            if (isset($params['subject'])) {
                $work->subject = $params['subject'];
            }
            if (isset($params['template'])) {
                $template = $params['template'];
            }
            if (isset($params['locale'])) {
                $work->locale = $params['locale'];
            }
        }

        // Set notify email
        $work->notifyEmail = $config->variables->notifyEmail;
        $result = Falcon_Sender_Email::send(
            $work, // object with params
            $work->get('send_to'),
            'views/scripts/actions/' . $template . '/', // path to a script
            true // is html
        );

        if ($result->isDelivered()) {
            $work->setDone();
        } else {
            $work->setWaiting();
        }
        return $result;
    }
}
