<?php

/**
 * Sends pending messages
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Sender_Queue extends Falcon_Sender_Abstract
{
    /**
     * Pending messages
     * @var mixed[]
     */
    protected static $pendingMessages = [];

    /**
     * Is transaction started
     * @var Boolean
     */
    protected static $isTransaction = false;

    /**
     * Add pending message
     * @param {String} $exchange Exchange
     * @param {String} $key Routing key = queue name
     * @param {String/Array} $message Message
     */
    public static function sendAmqp($exchange, $key, $message)
    {
        $params = [
            'exchange' => $exchange,
            'key' => $key,
            'message' => $message,
            'simple' => true
        ];
        self::sendPendingMessage($params);
    }

    /**
     * If transaction started don't send message adds it to pending instead
     * @param $params message params
     */
    public static function sendPendingMessage($params)
    {
        // If transaction started add to pending messages
        if (self::$isTransaction) {
            self::$pendingMessages[] = $params;

            return;
        } else {
            self::sendMessage($params);
        }
    }

    /**
     * Actually sends message depends on its params
     * @param type $params
     */
    public static function sendMessage($params)
    {
        $logger = Falcon_Logger::getInstance();

        if (!isset($params['key']) || !isset($params['exchange'])
            || !isset($params['message'])
        ) {
            $logger->log('error', 'Falcon_Sender_Queue: invalid message',
                $params
            );

            return;
        }

        Falcon_Amqp::sendTo($params['exchange'], $params['key'],
            $params['message'], false);
    }

    /**
     * Launches sending of pending messages
     */
    public static function processPendingMessages()
    {
        foreach (self::$pendingMessages as $messageParams) {
            self::sendMessage($messageParams);
        }

        // Clear pending messages
        self::clearPendingMessages();
    }

    /**
     * Clears pending messages
     */
    public static function clearPendingMessages()
    {
        self::$pendingMessages = [];
    }


    /**
     * Set transaction flag
     * @param type $transaction
     */
    public static function setTransaction($transaction)
    {
        self::$isTransaction = $transaction;
    }
}