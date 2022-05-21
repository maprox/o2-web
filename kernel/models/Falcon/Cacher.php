<?php

/**
 * Falcon Cacher class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 * @author     kpakshaev <pakshaev@mail.maprox.net>
 */
class Falcon_Cacher extends Falcon_Singleton
{
    /**
     * @const
     * Cache predefined periods
     */
    const
        HOUR = 3600,
        DAY = 86400,
        WEEK = 604800,
        MONTH = 2592000,
        PERMANENT = null;

    /**
     * @var {Zend_Cache_Backend}
     * Объект Zend Cache worker
     */
    protected $worker = null;

    /**
     * @var {Boolean}
     * Флаг, нужно ли кодировать json-ом перед записью/после чтения
     */
    protected $jsonEncode = false;

    /**
     * @var {String}
     * Имя объекта конфигурации
     */
    protected $optionName = 'cache';

    /**
     * @var {String[]}
     * Преобразования для префикса
     */
    protected $localPrefixes = [
        'settings' => '_settings_cache_',
    ];

    protected function __construct($optionName = false)
    {
        if ($optionName) {
            $this->optionName .= '_' . $optionName;
        }
    }

    /**
     * @var {Mixed[]}
     * Конфиг для создания объекта выполняющего кеширование
     */
    protected $config = [];

    /**
     * Читает из кеша
     * @var {String} $type тип закешированного объекта
     * @var {String} $idString его айди
     * @return {Mixed}
     */
    public function get($type, $idString = '')
    {
        if (!$this->isCacheable($type)) {
            return false;
        }

        $key = $this->buildKey($type, $idString);
        $worker = $this->getWorker();
        $result = $worker->load($key);

        if (empty($result)) {
            return false;
        }

        if ($this->jsonEncode) {
            $result = json_decode($result, true);
        }

        return $result;
    }

    /**
     * Пишет в кеш
     * @var {Mixed} $data Данные для записи
     * @var {String} $type тип кешируемого объекта
     * @var {String} $idString его айди
     * @var {Integer} $lifetime если указано, то время жизни != стандартному
     */
    public function set($data, $type, $idString = '', $lifetime = false)
    {
        if (!$this->isCacheable($type)) {
            return;
        }

        $key = $this->buildKey($type, $idString);
        $worker = $this->getWorker();

        if ($this->jsonEncode) {
            $data = json_encode($data);
        }

        if ($lifetime === false) {
            $worker->save($data, $key);
        } else {
            $worker->save($data, $key, [], $lifetime);
        }
    }

    /**
     * Удаляет из кеша
     * @var {String} $type тип кешируемого объекта
     * @var {String} $idString его айди
     */
    public function drop($type, $idString)
    {
        $key = $this->buildKey($type, $idString);
        $worker = $this->getWorker();
        $worker->remove($key);
    }

    /**
     * Очищает весь кеш
     */
    public function clean()
    {
        $worker = $this->getWorker();
        $worker->clean(Zend_Cache::CLEANING_MODE_ALL);
    }

    /**
     * Получает и сохраняет конфиг
     * @return {Zend_Config}
     */
    protected function getConfig()
    {
        if (empty($this->config)) {
            $config = Zend_Registry::get('config');
            $optionName = $this->optionName;
            $this->config = $config->$optionName;
        }

        return $this->config;
    }

    /**
     * Создает рабочий объект для выполенния операций кеширования
     * @return {Zend_Cache_Backend}
     */
    public function getWorker()
    {
        if (empty($this->worker)) {
            $config = $this->getConfig();

            $frontend = [
                'caching' => true,
                'lifetime' => $config->lifetime,
                'automatic_serialization' => ($config->serialize === 'php')
            ];

            if ($config->serialize === 'json') {
                $this->jsonEncode = true;
            }

            if ($config->type == 'memcache' &&
                class_exists_warn_off('Memcache', false)
            ) {
                $this->worker = $this->createWorkerMemcached($frontend, $config);
            } elseif ($config->type == 'redis') {
                $this->worker = $this->createWorkerRedis($frontend, $config);
            } else {
                $this->worker = $this->createWorkerFiles($frontend, $config);
            }
        }

        return $this->worker;
    }

    protected function createWorkerMemcached($frontend, $config)
    {
        $host = empty($config->host) ? '127.0.0.1' : $config->host;
        $port = empty($config->port) ? 11211 : $config->port;

        $backend = [
            'servers' => [
                ['host' => $host, 'port' => $port]
            ],
            'compression' => false
        ];

        return Zend_Cache::factory('Core', 'Memcached', $frontend, $backend);
    }

    protected function createWorkerFiles($frontend, $config)
    {
        $gc = Zend_Registry::get('config');
        $path = $gc->path->root . $config->file_dir;
        if (!empty($path) && is_writable($path)) {
            $backend = [
                'cache_dir' => $path
            ];
        } else {
            $backend = [];
        }
        return Zend_Cache::factory('Core', 'File', $frontend, $backend);
    }

    protected function createWorkerRedis($frontend, $config)
    {
        $host = empty($config->host) ? '127.0.0.1' : $config->host;
        $port = empty($config->port) ? 6379 : $config->port;
        $password = empty($config->password) ? false : $config->password;

        $redis = new Cm_Cache_Backend_Redis([
            'server' => $host,
            'port' => $port,
            'password' => $password,
            'database' => 0
        ]);
        return Zend_Cache::factory('Core', $redis, $frontend);
    }

    /**
     * Проверяет, можно ли выполнять операции кеширования на объекте
     * @param {String} $type - тип объекта
     * @return {Boolean}
     */
    protected function isCacheable($type)
    {
        $config = $this->getConfig();
        $valid_types = $config->get('types')->toArray();

        return $config->enabled && in_array($type, $valid_types);
    }

    /**
     * Создает полный ключ для передачи кеширующему объекту
     * @param {String} $type - тип объекта
     * @param {String} $idString - айди объекта
     * @return {String}
     */
    protected function buildKey($type, $idString = '')
    {
        $config = $this->getConfig();

        $modelPrefix = empty($this->localPrefixes[$type]) ? $type :
            $this->localPrefixes[$type];

        return $config->prefix .
        $modelPrefix .
        $idString;
    }
}
