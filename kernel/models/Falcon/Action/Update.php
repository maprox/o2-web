<?php

/**
 * Small class for convinience of adding updates
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Action_Update extends Falcon_Action_Abstract
{
    /**
     * Creates new update
     * @param Integer /Integer[] $params
     */
    public static function add($params)
    {
        $logger = Falcon_Logger::getInstance();
        if (empty($params['id_user'])) {
            return;
        }
        //$logger->log('zend', $params['alias'] . ' add-> ');
        //$logger->log('zend', $params['id_user']);

        if (is_array($params['id_user'])) {
            $params['users'] = $params['id_user'];
        } else {
            $params['users'] = [$params['id_user']];
        }
        unset($params['id_user']);
        try {
            $exchange = 'nodejs.updates';
            Falcon_Sender_Queue::sendAmqp($exchange, '', $params);
        } catch (Exception $e) {
            $logger->log('error', 'Error sending updates message');
            $logger->log('error', $e);
        }
    }

    /**
     * Creates updates for all users in given firm
     * @param Mixed[] $params
     * @param {Integer} $firmId
     */
    public static function addToFirm($params, $firmId)
    {
        $firm = new Falcon_Model_Firm($firmId);
        $users = $firm->getFirmUsers();
        $params['id_user'] = $users;
        self::add($params);
    }
}
