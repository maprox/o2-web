<?php

/**
 * Abstract notice manager
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Manager_Notice_Balance_Limit extends Falcon_Manager_Notice_Common
{
    /**
     * Templates path
     * @var {String}
     */
    protected $tplPath = 'views/scripts/actions/billing_refill_remind';

    /**
     * Sends email
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function sendEmail($setting, $params)
    {
        $logger = Falcon_Logger::getInstance();
        $res = parent::sendEmail($setting, $params);

        if (is_array($res)) {
            $logger->log('lowbalance', array_merge([
                'email' => $setting['address'],
                'company' => $params['firm']['company']['name'],
                'account' => $params['account']
            ], $res));
        }
    }
}