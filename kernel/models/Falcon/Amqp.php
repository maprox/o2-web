<?php
/**
 * Amqp sender class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */

use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Exception\AMQPTimeoutException;
use PhpAmqpLib\Message\AMQPMessage;

class Falcon_Amqp
{
    /**
     * @var null|AMQPChannel
     */
    protected static $channel = null;
    protected static $connection = null;
    protected static $declared = [];
    protected static $binded = [];

    /**
     * @return AMQPChannel
     */
    protected static function getChannel()
    {
        if (self::$channel === null) {
            $config = Zend_Registry::get('config')->toArray();
            $config = $config['amqp'];

            $connection = new AMQPConnection(
                $config['host'],
                $config['port'],
                $config['login'],
                $config['password']
            );

            self::$channel = $connection->channel();
            self::$connection = $connection;
        }

        return self::$channel;
    }

    /**
     * @param $exchange
     * @param $key
     * @param $persistent
     * @return AMQPChannel
     */
    protected static function bindQueue($exchange, $key, $persistent = true)
    {
        $sender = self::getChannel();
        if (empty(self::$declared[$exchange])) {
            $sender->exchange_declare($exchange, 'topic', false, true, false);
            self::$declared[$exchange] = true;
        }

        if (empty(self::$binded[$key])) {
            $sender->queue_declare($key, false, $persistent, false, false);
            $sender->queue_bind($key, $exchange, $key);
            self::$binded[$key] = true;
        }

        return $sender;
    }

    /**
     * @param $channel
     * @param $key
     * @param array $params
     */
    public static function sendTo($channel, $key, $params = [],
                                  $persistent = true)
    {
        if (!isset($params['user'])) {
            $params['user'] = Falcon_Model_User::getInstance()->getId();
        }

        $msg = new AMQPMessage(json_encode($params), [
            'content_type' => 'application/json'
        ]);
        $msg->set('priority', 2);
        $msg->set('timestamp', time());
        self::sendMessage($channel, $key, $msg, $persistent);
    }

    /**
     * @param string $channel
     * @param string $key
     * @param AMQPMessage $msg
     * @param bool $persistent
     */
    private static function sendMessage($channel, $key, $msg,
                                        $persistent = true)
    {
        try {
            $exchange = $channel;
            $key = getEnvironment() .
                '.' . $exchange . ($key ? '.' . $key : '');

            $sender = self::bindQueue($exchange, $key, $persistent);

            $msg->set('timestamp', time());
            $sender->basic_publish($msg, $exchange, $key);
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'place' => 'Amqp_Send'
            ]);
        }
    }

    /**
     * @param $tag
     * @param $success
     */
    public static function ack($tag, $success = true)
    {
        if (!$tag) {
            return;
        }

        $sender = self::getChannel();
        if ($success) {
            $sender->basic_ack($tag);
        } else {
            $sender->basic_nack($tag);
        }
    }

    /**
     * @param $namespace
     * @param $channel
     * @param $key
     * @param $callback
     */
    public static function listenTo($namespace, $channel, $key, $callback)
    {
        try {
            if (!$namespace) {
                $namespace = getEnvironment();
            }

            $exchange = $channel;
            $key = $namespace . '.' . $exchange . '.' . $key;

            $sender = self::bindQueue($exchange, $key);
            $sender->basic_consume($key, $key, false, false, false, true, $callback);
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'place' => 'Amqp_Listen'
            ]);
        }
    }

    /**
     * @param bool $timeout
     */
    public static function wait($timeout = false)
    {
        try {
            $sender = self::getChannel();
            if ($timeout) {
                $timeout = (int)$timeout;
                $wait = time() + $timeout;
                while (time() < $wait) {
                    $sender->wait(null, false, $timeout + 1);
                }
            } else {
                while (count($sender->callbacks)) {
                    $sender->wait();
                }
            }
        } catch (Exception $e) {
            if ($e instanceof AMQPTimeoutException && $timeout) {
                // Nothing to log, expected behavior
                return;
            }

            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'place' => 'Amqp_Wait'
            ]);
        }
    }

    /**
     * @param $key
     */
    public static function stopListen($namespace, $channel, $key)
    {
        if (!$namespace) {
            $namespace = getEnvironment();
        }

        $key = $namespace . '.' . $channel . '.' . $key;

        try {
            self::getChannel()->basic_cancel($key);
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'place' => 'Amqp_StopListen',
            ]);
        }
    }

    /**
     */
    public static function close()
    {
        try {
            self::getChannel()->close();
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'place' => 'Amqp_Close',
            ]);
        }
        self::$channel = null;
    }
}