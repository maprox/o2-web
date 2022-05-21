<?php

/**
 * Sms action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class Falcon_Notification_Sms extends Falcon_Notification_Abstract
{
    /**
     * Executes an action
     * @return {Falcon_Sender_Response}
     */
    public function execute()
    {
        $work = $this->getWork();
        return Falcon_Sender_Sms::send($work);
    }
}