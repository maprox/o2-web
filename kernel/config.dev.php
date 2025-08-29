<?php
/**
 * Configuration file
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2016, Maprox LLC
 */

// Locale
date_default_timezone_set("Etc/UTC");

define('DB_DATE_FORMAT', 'Y-m-d H:i:s');
define("PORT_SSL", 443);

// Path to the root of the site
$root = dirname(dirname(__FILE__)) . '/';

// Download path
$path_download = $root . '../downloads/';

// Wurfl config
$path_wurfl_lib = 'wurfl-php-1.3.1/WURFL/';

// Base URL.
$baseUrl = '/';

/**
 * Returns current host name
 *
 * @return string
 */
function GetHttpHostName()
{
    return isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'cli';
}

/**
 * Returns api key for $engine accoring to current host
 *
 * @param string $engine Engine name
 * @return string
 */
function GetMapsApiKey($engine)
{
    // array of api keys for engines
    // $apikeys[$engine][$host]
    $apikeys = [
        'yandex' => [
            'localhost' => getenv('MAPS_KEYS_YANDEX_LOCALHOST'),
            'observer.localhost' => getenv('MAPS_KEYS_YANDEX_OBSERVER_LOCALHOST'),
            'observer.maprox.net' => getenv('MAPS_KEYS_YANDEX_OBSERVER_MAPROX_NET'),
        ]
    ];
    $host = GetHttpHostName();
    if (isset($apikeys[$engine][$host])) {
        return $apikeys[$engine][$host];
    }
    return '';
}

/**
 * Get the number of current revision
 *
 * @param string $revision_file Name of file with current revision
 * @return string Number of HEAD revision
 */
function GetHeadRevision($revision_file)
{
    $result = 'default';
    if (file_exists($revision_file)) {
        $result = file_get_contents($revision_file);
    }
    // let's remove all chars except digits
    // return preg_replace('/\D/', '', $result);
    return trim($result);
}

// config array
$config = [
    // database connection
    'db' => [
        'adapter' => 'PDO_PGSQL',
        'params' => [
            // change namespace for our adapter
            'adapterNamespace' => 'Falcon_Db_Adapter',
            // database server
            'host' => getenv('DB_HOST') ?: 'localhost',
            // database port
            'port' => getenv('DB_PORT') ?: 5432,
            // database name
            'dbname' => getenv('DB_NAME') ?: 'observer',
            'username' => getenv('DB_USER'),
            'password' => getenv('DB_PASSWORD'),
            // database profiler
            'profiler' => false,
            // connection timeout settings
            'options' => [
                PDO::ATTR_TIMEOUT => 10,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ],
            // PostgreSQL specific connection timeout
            'driver_options' => [
                'connect_timeout' => 10,
                'statement_timeout' => 30000, // 30 seconds in milliseconds
            ]
        ],
    ],
    // environment
    'environment' => 'production',
    // session
    'session' => [
        'lifeTime' => 7 * 24 * 60 * 60, // a week
        'maxInactiveTime' => 60 * 5, // 5 minutes
    ],
    // variables
    // @warn No arrays here! - Only "string"
    'variables' => [
        'host' => getenv('HOST_NAME'),
        'copyright' => 'Maprox LLC',
        'copyrightUrl' => 'https://maprox.net',
        'title' => 'Maprox',
        'product' => 'Maprox',
        'notifyEmail' => 'noreply@maprox.net',
        'notifyEmailSubjectPrefix' => 'Maprox',
        'docsLink' => 'https://help.maprox.net/',
        'contactEmail' => 'contact@maprox.net',
        'supportHtml' => 'Contact the techsupport',
        'supportEmail' => '42@maprox.net',
        'class' => 'maprox',
    ],
    // caching
    'cache' => [
        // is cache enabled
        'enabled' => true,
        // cache prefix
        'prefix' => 'observer_',
        // serialize. php - use php serialization, json - use json. Any other - don't serialize
        'serialize' => 'php',
        // default lifetime of a cache
        'lifetime' => 7 * 24 * 60 * 60, // a week
        // cache type: memcache, files, redis
        'type' => 'files',
        // cache store directory. false == /tmp
        'file_dir' => 'cache/zend/',
        // port. false == 11211 for memcache, 6379 for redis
        'port' => false,
        // host. false == localhost
        'host' => false,
        // wich controllers a cached
        'types' => [
            'settings',
            'table',
            'notification_setting',
            'ext',
            'images',
            'geocoder',
            'rebuild_tracks',
            'osrm',
        ],
    ],
    // caching
    'cache_pipe' => [
        // is cache enabled
        'enabled' => true,
        // cache prefix
        'prefix' => 'tracker_',
        // serialize. php - use php serialization,
        // json - use json. Any other - don't serialize
        'serialize' => 'json',
        // default lifetime of a cache
        'lifetime' => 60 * 60, // a hour
        // cache type: memcache, files, redis
        'type' => 'redis',
        // cache store directory. false == /tmp
        'file_dir' => 'cache/zend/',
        // port. false == 11211 for memcache, 6379 for redis
        'port' => false,
        // memcache host. false == localhost
        'host' => false,
        // password for redis
        'password' => false,
        // wich controllers a cached
        'types' => [
            'action',
            'controller',
        ],
    ],
    // Queue
    'queue' => [
        'scheme' => 'tcp',
        'host' => getenv('REDIS_HOST') ?: 'localhost',
        'port' => getenv('REDIS_PORT') ?: 6379,
    ],
    'amqp' => [
        'host' => getenv('AMQP_HOST') ?: 'localhost',
        'port' => getenv('AMQP_PORT') ?: 5672,
        'login' => getenv('AMQP_USER') ?: 'guest',
        'password' => getenv('AMQP_PASSWORD') ?: 'guest',
        'namespace' => 'production',
    ],
    // js/css compiler settings
    'compiler' => [
        'js' => [],
        'css' => [],
    ],
    // jasper reports server configuration
    'jasper' => [
        // Url for SOAP requests
        'url' => getenv('JASPER_URL') ?: 'http://localhost:8080/jasperserver/services/repository',
        // requisites
        'username' => getenv('JASPER_USERNAME') ?: 'observer',
        'password' => getenv('JASPER_PASSWORD') ?: 'observer',
        // URL to files retrieved from JasperServer ('/' at the end)
        'files_url' => 'reportsdata/',
        // Physical path to files retrieved from JasperServer ('/' at the end)
        'files' => $root . 'public/reportsdata/',
        // regexp of page break sentence
        'rexp_page' => '|<a name="JR_PAGE_ANCHOR_\d+_\d+"></a>|s',
    ],
    // pipe-server configuration
    'pipe' => [
        // timeout in seconds for waiting an answer from pipe-server
        'timeout' => 10,
    ],
    'tracker' => [
        // частота отсыла пакетов в состоянии покоя "по умолчанию", в секундах
        'default_freq' => 5 * 60,
        // попправка на возможную плохую связь, в секундах
        'bad_connection_gap' => 30 * 60,
    ],
    'tracks' => [
        // Max distance between two packets from same group, in meters
        'max_distance' => 10000,
        // Max time between two packets from same group, in seconds
        'max_time_between' => 1200,
        // Maximum distance, which stopping can wander from last track
        'max_stop_fluctuation' => 1000,
        // Distance, after which track is considered moving for sure
        'track_sure_length' => 300,
        // Minimum time, needed to consider group as a stopping in seconds
        'min_stop_time' => 300,
        // Minimum time, needed to consider group as a movement track in seconds
        'min_track_time' => 10,
        // Coefficient to get from settings max time between packets. Is added to freq idle.
        'freq_idle_coeff' => 0.2,
        // Minimum seconds for that coefficient
        'min_freq_idle_shift' => 10,
    ],
    // Настройки URL адресов
    'url' => [
        // Базовый URL
        'base' => $baseUrl,
        // Адрес папки где лежат js файлы
        'js' => $baseUrl . 'frontend',
        // Урл к гифу 1x1
        'BLANK_IMAGE_URL' => $baseUrl . '1.gif',
    ],
    // Физические пути
    'path' => [
        // Физический путь к корню сайта
        'root' => $root,
        // Путь к библиотекам
        'library' => $root . 'kernel/models/',
        // Путь к ядру
        'kernel' => $root . 'kernel/',
        // Путь к контроллерам
        'controllers' => $root . 'kernel/controllers/',
        // public
        'public' => $root . 'public/',
        // Путь к JS файлам fronend'а
        'js' => $root . 'frontend/',
        // Путь к кешу
        'cache' => $root . 'cache/',
        // Путь к кешированным файлам
        'cached' => $root . 'cache/cached/',
        // Путь к скомпилированным (скомпрессированным) файлам
        'compiled' => $root . 'cache/compiled/',
        // Путь к пользовательским файлам
        'uploaded' => $root . 'uploaded/',
        // Путь к загруженным библиотекам
        'downloads' => $path_download,
    ],
    // Common settings
    'common' => [
        // Charset
        'charset' => 'utf-8',
        // http_host
        'http_host' => 'observer.maprox.net',
    ],
    // Available languages
    'locales' => [
        'ru' => 'ru_RU',
        'en' => 'en_GB',
    ],
    // File upload constraints
    'upload_constraints' => [
        'common' => [
            'max_file_size' => 5000000 // 5 MB
        ],
        'dn_doc' => [
            'max_file_size' => 20000000 // 20 MB
        ],
        'mon_vehicle' => [
            'max_file_size' => 20000000 // 20 MB
        ],
        'x_person' => [
            'max_file_size' => 5000000 // 5 MB
        ],
    ],
    // Zend_Translate settings
    'translate' => [
        // Adapter
        'adapter' => 'array',
        // Path to a language files
        'path' => $root . 'kernel/languages',
        // Extension of language files (with a dot)
        'extension' => '.php',
    ],
    // SMS settings
    'sms' => [
        'adapter' => 'SmsPilotRu',
        'serverPhone' => getenv('SMS_SERVER_PHONE') ?: '',
        'SmsPilotRu' => [
            'apikey' => getenv('SMSPILOT_KEY'),
        ],
        'SmsTeamRu' => [
            'login' => getenv('SMSTEAM_LOGIN'),
            'password' => getenv('SMSTEAM_PASS'),
            'secret_key' => [
                'md5' => getenv('SMSPILOT_KEY'),
            ],
        ],
    ],
    // Mail config
    'mail' => [
        // Transport type [ smtp | default ] ( default = mail() )
        'transport' => 'smtp',
        // Smtp-transport settings
        'config' => [
            // Host
            'host' => getenv('SMTP_HOST') ?: 'localhost',
            'auth' => 'plain',
            'username' => getenv('SMTP_USERNAME'),
            'password' => getenv('SMTP_PASSWORD'),
        ],
    ],
    // Logging configuration
    'logger' => [
        'timestampFormat' => 'Y-m-d H:i:s',
        'format' => "%timestamp%: %message%\n",
        'maxDepth' => 10,
        'watchLogin' => true,
    ],
    // Debug flag
    'debug' => false,
    // Version info
    'version' => [
        'o' => [
            'major' => '3',
            'minor' => '0',
            'revision' => GetHeadRevision($root . 'kernel/version.txt'),
            'status' => '',
        ],
        'sencha' => [
            'extjs' => '4.2.1',
            'touch' => '2.0.1.1',
        ],
        'openlayers' => '2.12',
        // Возможные варианты: observer, docsnet, servicedesk
        'service' => 'observer',
    ],
    // registration
    'register' => [
        'enabled' => false,
        'url' => getenv('REGISTER_URL') ?: '/register',
    ],
    // иконки авто
    'icons' => [
        // путь к каталогу с иконками
        'path' => '/img/icons/',
        // файл иконки
        'imageFile' => 'image.png',
        // regexp алиасов (остальные папки не будут сканироваться)
        // все папки содержащие a-z и цифры (без подчеркиваний)
        'regExp' => '/^[a-z\d]*$/',
    ],
    // 64-разрядная ОС (bool)
    'is64' => true,
    'maps' => [
        'apikeys' => [
            'yandex' => GetMapsApiKey('yandex'),
        ],
    ],
    //карты - api ключи, адреса URL и прочие параметра
    'geocoder' => [
        // Геокодер по умолчанию обязательно писать с большой буквы
        'query' => ['Maprox', 'Google', 'Openlayers'],
        // Параметры всех геокодеров
        'maprox' => [
            'url' => 'http://51.15.137.164:8080/search?' .
                'format=json&zoom=18&addressdetails=1&',
            'urlReverse' => 'http://51.15.137.164:8080/reverse?' .
                'format=json&zoom=18&addressdetails=1&' .
                'accept-language=ru_RU',
            'timeout' => 5,
        ],
        'google' => [
            'url' => 'http://maps.googleapis.com/maps/api/geocode/' .
                'json?sensor=false&language=ru',
            'timeout' => 1,
        ],
        'openlayers' => [
            'url' => 'http://nominatim.openstreetmap.org/search?' .
                'format=json&zoom=18&addressdetails=1',
            'urlReverse' => 'http://nominatim.openstreetmap.org/reverse?' .
                'format=json&zoom=18&addressdetails=1&' .
                'accept-language=ru_RU',
            'timeout' => 5,
        ],
    ],
    'osrm' => [
        'domain' => ['http://router.project-osrm.org/'],
    ],
    'payment' => [
        'message' => [
            'ru' => 'Пополнение баланса в системе Мапрокс, счет №%d',
            'en' => 'Account refill, invoice №%d',
        ],
        'webmoney' => [
            'wallet' => '',
        ],
        'rbkmoney' => [
            'wallet' => getenv('RBKM_WALLET'),
            'shopId' => getenv('RBKM_IDSHOP'),
            'secretKey' => getenv('RBKM_KEY'),
        ],
        // Payment logging configuration
        'log' => [
            'timestampFormat' => 'Y-m-d H:i:s',
            [
                'writerName' => 'Stream',
                'writerParams' => [
                    'stream' => $root . 'logs/payment.log',
                ],
                'formatterName' => 'Simple',
                'formatterParams' => [
                    'format' => "%timestamp% [%priorityName%]: %message%\n",
                ],
            ],
        ],
    ],
    // support for mobile layout
    'mobile' => [
        // Support for mobile layout
        // @type {Boolean|String}
        // false = not supported
        // true = detects device type
        // 'forced' = force mobile layout
        'support' => true,
    ],
    'resources' => [
        'static' => getenv('HOST_STATIC') ?: 'static.maprox.net',
        'node' => getenv('NODE_HOST'),
        'node_ssl' => getenv('NODE_HOST_SSL'),
    ],
    // frontend configuration
    'frontend' => [
        // toplevel-modules configurations
        'modules' => [
            // a list of disabled modules
            'disabled' => [],
        ],
    ],
    // list of user logins/ip, wich allowed to access from multiple locations
    'multipleInstancesAllowed' => [
        // logins
        'login' => [
            'demo',
            'sunsay',
        ],
        'ip' => [
            // NOT IMPLEMENTED
        ],
    ],
    // analytics js-code injections into html files
    'analytics' => [
        'header' => [],
        'footer' => [],
    ],
    //    Настройки доступа с ip-адресов. Помимо этого, надо чтобы в классе
    //    контроллера было protected $_ipCheck = true;
    //    Формат:
    //    controller => array(
    //        action1 => array('localhost', '192.168.0.1', '255.255.255.255'), //  разрешить несклоько айпи
    //        action2 => array('localhost'), // разрешить один айпи
    //        action3 => array(), // запретить доступ отовсюду
    //        // action4 не упоминается в массиве, поэтому он доступен для любого айпи
    //    ),
    'allowedIp' => [
        'pipe' => [
            'get' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'set' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'process' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'billing' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'billingcalc' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'createtracks' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'fixodometertracks' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
        ],
        'node' => [
            'data' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
            'auth' => ['localhost', getenv('LOCAL_IP'), getenv('NODEJS_IP'), getenv('CRON_IP')],
        ],
    ],
    // Security settings.
    // TODO move allowedIp into "security" leaf
    'security' => [
        // Key salt
        // For example, for device_key variable
        // It must be filled in config.local.php
        'key_salt' => getenv('KEY_SALT') ?: null,
    ],
    // Версии библиотек (папки)
    'libs' => [
        // JpGraph
        //'jpgraph' => 'jpgraph-3.5.0b1/src/',
        // Wurfl
        //'wurfl' => $path_wurfl_lib,
        // PhpExcel
        'phpexcel' => 'PhpExcel-1.7.7/Classes/',
        // Zend Framework
        //'zend' => 'ZendFramework-1.11.11-minimal/library/',
    ],
    'elma' => [
        'registration' => [
            'url' => 'https://corp.maprox.net/Modules/' .
                'EleWise.ELMA.Workflow.Processes.Web/WFPWebService.asmx?WSDL',
            'uri' => 'http://www.elma-bpm.ru/WFPWebService/',
            'method' => 'Run',
            'username' => '',
            'password' => '',
            'token' => '',
        ]
    ],
    'oauth2' => [
        'latitude' => [
            'client_id' => '502260551897.apps.googleusercontent.com',
            'client_secret' => 'FFKd7vOaqOey3_rvxm_6TRLX',
            'redirect_uri' => 'http://observer.maprox.net/latitude',
            'authorization_endpoint' =>
                'https://accounts.google.com/o/oauth2/auth',
            'token_endpoint' =>
                'https://accounts.google.com/o/oauth2/token',
            'scope' =>
                'https://www.googleapis.com/auth/userinfo.email ' .
                'https://www.googleapis.com/auth/latitude.all.best',
        ],
    ],
    'ssl_enabled' => true,

    /**
     * Partner specific configurations
     */
    'partners' => [
        // Linkom LLC
        'linkomm' => [
            'variables' => [
                'copyright' => 'Linkom LLC',
                'copyrightUrl' => 'http://www.linkomm.ru',
                'title' => 'Линком / Мониторинг транспорта',
                'product' => 'Линком.Мониторинг',
                'notifyEmail' => 'contact@linkomm.ru',
                'notifyEmailSubjectPrefix' => '',
                'docsLink' => 'http://help.linkomm.ru/',
                'contactEmail' => 'contact@linkomm.ru',
                'supportHtml' => 'Contact the techsupport',
                'supportEmail' => 'support@linkomm.ru',
                'hostLink' => 'http://observer.linkomm.ru',
                'class' => 'linkomm',
            ],
            // registration
            'register' => [
                'enabled' => false,
            ],
        ],
    ]
];

if (file_exists($root . 'kernel/config.local.php')) {
    include $root . 'kernel/config.local.php';
    if (isset($local_config) && is_array($local_config)) {
        $config = array_replace_recursive($config, $local_config);
    }
}

/**
 * Temporarily change variables according to hostname
 */
if (isset($_SERVER['HTTP_HOST'])) {
    $serverHost = $_SERVER['HTTP_HOST'];
    foreach ($config['partners'] as $key => $partner_config) {
        if (strpos($serverHost, $key) !== false) {
            $config = array_replace_recursive($config, $partner_config);
        }
    }
}

// global file version function
function getFileVersionPostfix($config)
{
    //return implode('.', (array)$config->version->o);
    return $config->version->o->major .
    '.' . $config->version->o->minor .
    '.' . $config->version->o->revision;
}

// current ExtJS version
function getExtVersionPostfix($config)
{
    return $config->version->sencha->extjs;
}

// current Sencha-Touch version
function getTouchVersionPostfix($config)
{
    return $config->version->sencha->touch;
}

/**
 * Returns protocol string
 *
 * @global array $config
 * @param bool $forceSecure True to force https if possible
 * @return string
 */
function getProtocol($forceSecure = false)
{
    global $config;
    if ($config['ssl_enabled']) {
        if ($forceSecure
            || (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (isset($_SERVER['HTTP_SSL']) && $_SERVER['HTTP_SSL'] != 'off')
            || $_SERVER['SERVER_PORT'] == PORT_SSL
        ) {
            return 'https';
        }
    }
    return 'http';
}
