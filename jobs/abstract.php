<?php
/**
 * Abstract class for message processors.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2016, Maprox LLC
 */

use PhpAmqpLib\Message\AMQPMessage;

abstract class Job_Abstract
{
    /**
     * Should have single instance for each key
     * @var {Boolean}
     */
    public static $isSingle = false;

    /**
     * В сколько потоков слушать сообщения
     * @var {integer}
     */
    public static $listenerCount = 1;

    /**
     * Flag "Needs restart after stopping"
     * @var {Boolean}
     */
    protected $restart = false;

    /**
     * Channel name
     * @var {String}
     */
    protected $channel;

    /**
     * Current key
     * @var {String}
     */
    protected $key;

    /**
     * Default namespace
     * @var {String|false}
     */
    protected $namespace = false;

    /**
     * Default method name
     * @var {String|false}
     */
    protected $method = false;

    /**
     * key masks
     * @var {String[]}
     */
    public static $keys = [];

    /**
     * Count of threads for queue handler.
     * By default there is a $listenerCount threads
     * @var {Array[]}
     */
    public static $keysThreadsCount = [];

    /**
     * Namespaces for keys
     * @var {String[]|false}
     */
    protected $keysNamespace = [];

    /**
     * Methods for keys
     * @var {String[]|false}
     */
    protected $keysMethod = [];

    /**
     * Constructs, gets channel from $argv
     * @param String $key
     */
    public function __construct($key)
    {
        $this->key = $key;
        if (isset($this->keysNamespace[$key])) {
            $this->namespace = $this->keysNamespace[$key];
        }
        if (isset($this->keysMethod[$key])) {
            $this->method = $this->keysMethod[$key];
        }
    }

    /**
     * Start listening
     */
    public function start()
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('job', "Start listening: " .
            "$this->namespace, $this->channel, $this->key");
        Falcon_Amqp::listenTo(
            $this->namespace, $this->channel, $this->key,
            [$this, 'processPayload']
        );
        Falcon_Amqp::wait();
    }

    /**
     * Stop listening
     */
    public function stop()
    {
        $logger = Falcon_Logger::getInstance();
        $logger->log('job', "Stop listening: " .
            "$this->namespace, $this->channel, $this->key");
        Falcon_Amqp::stopListen(
            $this->namespace,
            $this->channel,
            $this->key
        );
        Falcon_Amqp::close();
    }

    /**
     * @param AMQPMessage $message
     * @return boolean
     */
    public function processPayload($message)
    {
        $params = json_decode($message->body, true);
        $tag = $message->has('delivery_tag') ?
            $message->get('delivery_tag') : false;
        $this->processMessage($params, $tag);
    }

    /**
     * Control message processor function.
     * @param Mixed[] $params
     * @param String $tag
     * @return Boolean
     */
    protected function processMessage($params, $tag)
    {
        try {
            $success = call_user_func([$this, $this->method], $params);
            Falcon_Amqp::ack($tag, $success !== false);
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $message = $e->getMessage();
            $logger->log('job', $message, [
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'message' => $params
            ]);
            // restart the service
            $this->restart();
        }
    }

    /**
     * @return bool
     */
    private function restart()
    {
        $logger = Falcon_Logger::getInstance();

        // stop consuming from the queue
        $this->stop();

        // close connection to the database, if it is already broken
        try {
            Zend_Db_Table::getDefaultAdapter()->closeConnection();
            $logger->log('job', 'Database connection closed.');
        } catch (Exception $e) {
            $logger->log('job', 'Can\'t close database connection: ' . $e->getMessage());
        }

        // pause message receiving for 10 seconds
        $logger->log('job', 'Sleep for 10 seconds...');
        sleep(10);
        $logger->log('job', 'Wakeup!');

        // start consuming after pause
        $this->start();
    }

    /**
     * Destructs, cleans up, restarts process if needed
     */
    public function __destruct()
    {
        Falcon_Amqp::close();
    }
}
