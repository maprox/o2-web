<?php
/**
 * Credis_Client (a fork of Redisent)
 *
 * Most commands are compatible with phpredis library:
 *   - use "pipeline()" to start a pipeline of commands instead of multi(Redis::PIPELINE)
 *   - any arrays passed as arguments will be flattened automatically
 *   - setOption and getOption are not supported in standalone mode
 *   - order of arguments follows redis-cli instead of phpredis where they differ (lrem)
 *
 * - Uses phpredis library if extension is installed for better performance.
 * - Establishes connection lazily.
 * - Supports tcp and unix sockets.
 * - Reconnects automatically unless a watch or transaction is in progress.
 *
 * @author Colin Mollenhour <colin@mollenhour.com>
 * @copyright 2011 Colin Mollenhour <colin@mollenhour.com>
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @package Credis_Client
 */

if (!defined('CRLF')) define('CRLF', sprintf('%s%s', chr(13), chr(10)));

/**
 * Credis-specific errors, wraps native Redis errors
 */
class CredisException extends Exception
{
}

/**
 * Credis_Client, a lightweight Redis PHP standalone client and phpredis wrapper
 *
 * Server/Connection:
 * @method Credis_Client pipeline()
 * @method Credis_Client multi()
 * @method array         exec()
 * @method string        flushAll()
 * @method string        flushDb()
 * @method array         info()
 * @method bool|array    config(string $setGet, string $key, string $value = null)
 *
 * Keys:
 * @method int           del(string $key)
 * @method int           exists(string $key)
 * @method int           expire(string $key, int $seconds)
 * @method int           expireAt(string $key, int $timestamp)
 * @method array         keys(string $key)
 * @method int           persist(string $key)
 * @method bool          rename(string $key, string $newKey)
 * @method bool          renameNx(string $key, string $newKey)
 * @method array         sort(string $key, string $arg1, string $valueN = null)
 * @method int           ttl(string $key)
 * @method string        type(string $key)
 *
 * Scalars:
 * @method int           append(string $key, string $value)
 * @method int           decr(string $key)
 * @method int           decrBy(string $key, int $decrement)
 * @method bool|string   get(string $key)
 * @method int           getBit(string $key, int $offset)
 * @method string        getRange(string $key, int $start, int $end)
 * @method string        getSet(string $key, string $value)
 * @method int           incr(string $key)
 * @method int           incrBy(string $key, int $decrement)
 * @method array         mGet(array $keys)
 * @method bool          mSet(array $keysValues)
 * @method int           mSetNx(array $keysValues)
 * @method bool          set(string $key, string $value)
 * @method int           setBit(string $key, int $offset, int $value)
 * @method bool          setEx(string $key, int $seconds, string $value)
 * @method int           setNx(string $key, string $value)
 * @method int           setRange(string $key, int $offset, int $value)
 * @method int           strLen(string $key)
 *
 * Sets:
 * @method int           sAdd(string $key, mixed $value, string $valueN = null)
 * @method int           sRem(string $key, mixed $value, string $valueN = null)
 * @method array         sMembers(string $key)
 * @method array         sUnion(mixed $keyOrArray, string $valueN = null)
 * @method array         sInter(mixed $keyOrArray, string $valueN = null)
 * @method array         sDiff(mixed $keyOrArray, string $valueN = null)
 *
 * Hashes:
 * @method bool|int      hSet(string $key, string $field, string $value)
 * @method bool          hSetNx(string $key, string $field, string $value)
 * @method bool|string   hGet(string $key, string $field)
 * @method bool|int      hLen(string $key)
 * @method bool          hDel(string $key, string $field)
 * @method array         hKeys(string $key, string $field)
 * @method array         hVals(string $key, string $field)
 * @method array         hGetAll(string $key)
 * @method bool          hExists(string $key, string $field)
 * @method int           hIncrBy(string $key, string $field, int $value)
 * @method bool          hMSet(string $key, array $keysValues)
 * @method array         hMGet(string $key, array $fields)
 *
 * Lists:
 * @method array|null    blPop(string $keyN, int $timeout)
 * @method array|null    brPop(string $keyN, int $timeout)
 * @method array|null    brPoplPush(string $source, string $destination, int $timeout)
 * @method string|null   lIndex(string $key, int $index)
 * @method int           lInsert(string $key, string $beforeAfter, string $pivot, string $value)
 * @method int           lLen(string $key)
 * @method string|null   lPop(string $key)
 * @method int           lPush(string $key, mixed $value, mixed $valueN = null)
 * @method int           lPushX(string $key, mixed $value)
 * @method array         lRange(string $key, int $start, int $stop)
 * @method int           lRem(string $key, int $count, mixed $value)
 * @method bool          lSet(string $key, int $index, mixed $value)
 * @method bool          lTrim(string $key, int $start, int $stop)
 * @method string|null   rPop(string $key)
 * @method string|null   rPoplPush(string $source, string $destination)
 * @method int           rPush(string $key, mixed $value, mixed $valueN = null)
 * @method int           rPushX(string $key, mixed $value)
 */
class Credis_Client
{

    const TYPE_STRING = 'string';
    const TYPE_LIST = 'list';
    const TYPE_SET = 'set';
    const TYPE_ZSET = 'zset';
    const TYPE_HASH = 'hash';
    const TYPE_NONE = 'none';
    const FREAD_BLOCK_SIZE = 8192;

    /**
     * Socket connection to the Redis server or Redis library instance
     * @var resource|Redis
     */
    protected $redis;
    protected $redisMulti;

    /**
     * Host of the Redis server
     * @var string
     */
    protected $host;

    /**
     * Port on which the Redis server is running
     * @var integer
     */
    protected $port;

    /**
     * Timeout for connecting to Redis server
     * @var float
     */
    protected $timeout;

    /**
     * @var bool
     */
    protected $connected = FALSE;

    /**
     * @var bool
     */
    protected $standalone;

    /**
     * @var bool
     */
    protected $usePipeline = FALSE;

    /**
     * @var array
     */
    protected $commandNames;

    /**
     * @var string
     */
    protected $commands;

    /**
     * @var bool
     */
    protected $isMulti = FALSE;

    /**
     * @var bool
     */
    protected $isWatching = FALSE;

    /**
     * @var string
     */
    protected $authPassword;

    /**
     * @var int
     */
    protected $selectedDb = 0;

    /**
     * Aliases for backwards compatibility with phpredis
     * @var array
     */
    protected $aliasedMethods = ['delete' => 'del', 'getkeys' => 'keys', 'sremove' => 'srem'];

    /**
     * Creates a Redisent connection to the Redis server on host {@link $host} and port {@link $port}.
     * $host may also be a path to a unix socket or a string in the form of tcp://[hostname]:[port] or unix://[path]
     *
     * @param string $host The hostname of the Redis server
     * @param integer $port The port number of the Redis server
     * @param float $timeout Timeout period in seconds
     */
    public function __construct($host = '127.0.0.1', $port = 6379, $timeout = 2.5)
    {
        $this->host = $host;
        $this->port = $port;
        $this->timeout = $timeout;
        $this->standalone = !extension_loaded('redis');
    }

    public function __destruct()
    {
        $this->close();
    }

    /**
     * @return Credis_Client
     */
    public function forceStandalone()
    {
        if ($this->connected) {
            throw new CredisException('Cannot force Credis_Client to use standalone PHP driver after a connection has already been established.');
        }
        $this->standalone = TRUE;
        return $this;
    }

    /**
     * @throws CredisException
     */
    public function connect()
    {
        if ($this->connected) {
            return;
        }
        if (preg_match('#^(tcp|unix)://(.*)$#', $this->host, $matches)) {
            if ($matches[1] == 'tcp') {
                $hostParts = explode(':', $matches[2], 2);
                $this->host = $hostParts[0];
                $this->port = (int)(isset($hostParts[1]) ? $hostParts[1] : '6379');
            } else {
                $this->host = $matches[2];
            }
        }
        if ($this->standalone) {
            if (substr($this->host, 0, 1) == '/') {
                $remote_socket = 'unix://' . $this->host;
                $this->port = null;
            } else {
                $remote_socket = 'tcp://' . $this->host . ':' . $this->port;
            }
            #$this->redis = @fsockopen($this->host, $this->port, $errno, $errstr, $this->timeout);
            $this->redis = @stream_socket_client($remote_socket, $errno, $errstr, $this->timeout);
            if (!$this->redis) {
                throw new CredisException("Connection to {$this->host}" . ($this->port ? ":{$this->port}" : '') . " failed: $errstr ($errno)");
            }
        } else {
            $this->redis = new Redis;
            if (substr($this->host, 0, 1) == '/') {
                $result = $this->redis->connect($this->host, null, $this->timeout);
            } else {
                $result = $this->redis->connect($this->host, $this->port, $this->timeout);
            }
            if (!$result) {
                throw new CredisException("An error occurred connecting to Redis.");
            }
        }
        $this->connected = TRUE;
    }

    /**
     * @return bool
     */
    public function close()
    {
        $result = TRUE;
        if ($this->connected) {
            if ($this->standalone) {
                $result = fclose($this->redis);
            } else {
                $result = $this->redis->close();
            }
            $this->connected = FALSE;
        }
        return $result;
    }

    /**
     * @param string $password
     * @return bool
     */
    public function auth($password)
    {
        $this->authPassword = $password;
        $response = $this->__call('auth', [$this->authPassword]);
        return $response;
    }

    /**
     * @param int $index
     * @return bool
     */
    public function select($index)
    {
        $this->selectedDb = (int)$index;
        $response = $this->__call('select', [$this->selectedDb]);
        return $response;
    }

    public function __call($name, $args)
    {
        // Lazy connection
        $this->connect();

        $name = strtolower($name);

        // Send request via native PHP
        if ($this->standalone) {
            // Flatten arguments
            $argsFlat = NULL;
            foreach ($args as $index => $arg) {
                if (is_array($arg)) {
                    if ($argsFlat === NULL) {
                        $argsFlat = array_slice($args, 0, $index);
                    }
                    if ($name == 'mset' || $name == 'msetnx' || $name == 'hmset') {
                        foreach ($arg as $key => $value) {
                            $argsFlat[] = $key;
                            $argsFlat[] = $value;
                        }
                    } else {
                        $argsFlat = array_merge($argsFlat, $arg);
                    }
                } else if ($argsFlat !== NULL) {
                    $argsFlat[] = $arg;
                }
            }
            if ($argsFlat !== NULL) {
                $args = $argsFlat;
                $argsFlat = NULL;
            }

            // In pipeline mode
            if ($this->usePipeline) {
                if ($name == 'pipeline') {
                    throw new CredisException('A pipeline is already in use and only one pipeline is supported.');
                } else if ($name == 'exec') {
                    if ($this->isMulti) {
                        $this->commandNames[] = $name;
                        $this->commands .= self::_prepare_command([$name]);
                    }

                    // Write request
                    if ($this->commands) {
                        $this->write_command($this->commands);
                    }
                    $this->commands = NULL;

                    // Read response
                    $response = [];
                    foreach ($this->commandNames as $command) {
                        $response[] = $this->read_reply($command);
                    }
                    $this->commandNames = NULL;

                    if ($this->isMulti) {
                        $response = array_pop($response);
                    }
                    $this->usePipeline = $this->isMulti = FALSE;
                    return $response;
                } else {
                    if ($name == 'multi') {
                        $this->isMulti = TRUE;
                    }
                    array_unshift($args, $name);
                    $this->commandNames[] = $name;
                    $this->commands .= self::_prepare_command($args);
                    return $this;
                }
            }

            // Start pipeline mode
            if ($name == 'pipeline') {
                $this->usePipeline = TRUE;
                $this->commandNames = [];
                $this->commands = '';
                return $this;
            }

            // If unwatching, allow reconnect with no error thrown
            if ($name == 'unwatch') {
                $this->isWatching = FALSE;
            }

            // Non-pipeline mode
            array_unshift($args, $name);
            $command = self::_prepare_command($args);
            $this->write_command($command);
            $response = $this->read_reply($name);

            // Watch mode disables reconnect so error is thrown
            if ($name == 'watch') {
                $this->isWatching = TRUE;
            } // Transaction mode
            else if ($this->isMulti && ($name == 'exec' || $name == 'discard')) {
                $this->isMulti = FALSE;
            } // Started transaction
            else if ($this->isMulti || $name == 'multi') {
                $this->isMulti = TRUE;
                $response = $this;
            }
        } // Send request via phpredis client
        else {
            // Tweak arguments
            switch ($name) {
                case 'get':   // optimize common cases
                case 'set':
                case 'hget':
                case 'hset':
                case 'setex':
                case 'mset':
                case 'msetnx':
                case 'hmset':
                case 'hmget':
                case 'del':
                    break;
                case 'mget':
                    if (isset($args[0]) && !is_array($args[0])) {
                        $args = [$args];
                    }
                    break;
                case 'lrem':
                    $args = [$args[0], $args[2], $args[1]];
                    break;
                default:
                    // Flatten arguments
                    $argsFlat = NULL;
                    foreach ($args as $index => $arg) {
                        if (is_array($arg)) {
                            if ($argsFlat === NULL) {
                                $argsFlat = array_slice($args, 0, $index);
                            }
                            $argsFlat = array_merge($argsFlat, $arg);
                        } else if ($argsFlat !== NULL) {
                            $argsFlat[] = $arg;
                        }
                    }
                    if ($argsFlat !== NULL) {
                        $args = $argsFlat;
                        $argsFlat = NULL;
                    }
            }

            try {
                // Proxy pipeline mode to the phpredis library
                if ($name == 'pipeline' || $name == 'multi') {
                    if ($this->isMulti) {
                        return $this;
                    } else {
                        $this->isMulti = TRUE;
                        $this->redisMulti = call_user_func_array([$this->redis, $name], $args);
                    }
                } else if ($name == 'exec' || $name == 'discard') {
                    $this->isMulti = FALSE;
                    $response = $this->redisMulti->$name();
                    $this->redisMulti = NULL;
                    #echo "> $name : ".substr(print_r($response, TRUE),0,100)."\n";
                    return $response;
                }

                // Use aliases to be compatible with phpredis wrapper
                if (isset($this->aliasedMethods[$name])) {
                    $name = $this->aliasedMethods[$name];
                }

                // Multi and pipeline return self for chaining
                if ($this->isMulti) {
                    call_user_func_array([$this->redisMulti, $name], $args);
                    return $this;
                }

                $response = call_user_func_array([$this->redis, $name], $args);
            } // Wrap exceptions
            catch (RedisException $e) {
                throw new CredisException($e->getMessage(), $e->getCode());
            }

            #echo "> $name : ".substr(print_r($response, TRUE),0,100)."\n";

            // change return values where it is too difficult to minim in standalone mode
            switch ($name) {
                case 'hmget':
                    $response = array_values($response);
                    break;
                case 'type':
                    $typeMap = [
                        self::TYPE_NONE,
                        self::TYPE_STRING,
                        self::TYPE_SET,
                        self::TYPE_LIST,
                        self::TYPE_ZSET,
                        self::TYPE_HASH,
                    ];
                    $response = $typeMap[$response];
                    break;
            }
        }

        return $response;
    }

    protected function write_command($command)
    {
        // Reconnect on lost connection (Redis server "timeout" exceeded since last command)
        if (feof($this->redis)) {
            $this->close();
            // If a watch or transaction was in progress and connection was lost, throw error rather than reconnect
            // since transaction/watch state will be lost.
            if (($this->isMulti && !$this->usePipeline) || $this->isWatching) {
                $this->isMulti = $this->isWatching = FALSE;
                throw new CredisException('Lost connection to Redis server during watch or transaction.');
            }
            $this->connected = FALSE;
            $this->connect();
            if ($this->authPassword) {
                $this->auth($this->authPassword);
            }
            if ($this->selectedDb != 0) {
                $this->select($this->selectedDb);
            }
        }

        for ($written = 0; $written < strlen($command); $written += $fwrite) {
            $fwrite = fwrite($this->redis, substr($command, $written));
            if ($fwrite === FALSE) {
                throw new CredisException('Failed to write entire command to stream');
            }
        }
    }

    protected function read_reply($name = '')
    {
        $reply = fgets($this->redis);
        if ($reply === FALSE) {
            throw new CredisException('Lost connection to Redis server.');
        }
        $reply = rtrim($reply, CRLF);
        #echo "> $name: $reply\n";
        $replyType = substr($reply, 0, 1);
        switch ($replyType) {
            /* Error reply */
            case '-':
                if ($this->isMulti || $this->usePipeline) {
                    $response = FALSE;
                } else {
                    throw new CredisException(substr($reply, 4));
                }
                break;
            /* Inline reply */
            case '+':
                $response = substr($reply, 1);
                if ($response == 'OK' || $response == 'QUEUED') {
                    return TRUE;
                }
                break;
            /* Bulk reply */
            case '$':
                if ($reply == '$-1') return FALSE;
                $size = (int)substr($reply, 1);
                $response = stream_get_contents($this->redis, $size + 2);
                if (!$response)
                    throw new CredisException('Error reading reply.');
                $response = substr($response, 0, $size);
                break;
            /* Multi-bulk reply */
            case '*':
                $count = substr($reply, 1);
                if ($count == '-1') return FALSE;

                $response = [];
                for ($i = 0; $i < $count; $i++) {
                    $response[] = $this->read_reply();
                }
                break;
            /* Integer reply */
            case ':':
                $response = intval(substr($reply, 1));
                break;
            default:
                throw new CredisException('Invalid response: ' . print_r($reply, TRUE));
                break;
        }

        // Smooth over differences between phpredis and standalone response
        switch ($name) {
            case '': // Minor optimization for multi-bulk replies
                break;
            case 'config':
            case 'hgetall':
                $keys = $values = [];
                while ($response) {
                    $keys[] = array_shift($response);
                    $values[] = array_shift($response);
                }
                $response = count($keys) ? array_combine($keys, $values) : [];
                break;
            case 'info':
                $lines = explode(CRLF, trim($response, CRLF));
                $response = [];
                foreach ($lines as $line) {
                    list($key, $value) = explode(':', $line, 2);
                    $response[$key] = $value;
                }
                break;
            case 'ttl':
                if ($response === -1) {
                    $response = FALSE;
                }
                break;
        }

        return $response;
    }

    /**
     * Build the Redis unified protocol command
     *
     * @param array $args
     * @return string
     */
    private static function _prepare_command($args)
    {
        return sprintf('*%d%s%s%s', count($args), CRLF, implode(array_map(['self', '_map'], $args), CRLF), CRLF);
    }

    private static function _map($arg)
    {
        return sprintf('$%d%s%s', strlen($arg), CRLF, $arg);
    }

}
