<?php

/**
 * Abstract notice manager
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
abstract class Falcon_Manager_Notice_Abstract
{
    /**
     * Send notice
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function send($setting, $params)
    {
        if ($setting['type_name'] == 'email') {
            $this->sendEmail($setting, $params);
        }

        if ($setting['type_name'] == 'sms') {
            $this->sendSms($setting, $params);
        }

        if ($setting['type_name'] == 'popup') {
            $this->sendPopup($setting, $params);
        }

        if ($setting['type_name'] == 'telegram') {
            $this->sendTelegram($setting, $params);
        }
    }

    /**
     * Sends email
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    abstract function sendEmail($setting, $params);

    /**
     * Sends sms
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    abstract function sendSms($setting, $params);

    /**
     * Sends popup
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    abstract function sendPopup($setting, $params);

    /**
     * Sends telegram
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    abstract function sendTelegram($setting, $params);
}