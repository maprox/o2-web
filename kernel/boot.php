<?php

// Load utility functions
require 'utils.php';

/**
 * Main class that is used to configure and run the application
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Bootstrap
{
    private $_config = null; // configuration object

    /**
     * Constructor. Inits autoloader.
     */
    public function __construct()
    {
        require 'Zend/Loader/Autoloader.php';
        $this->setLoader();

        // front controller creation
        Falcon_Controller_Front::getInstance();
    }

    /**
     * Application start
     */
    public function run($config)
    {
        try {
            $this->initialize($config);

            // run front controller
            $this->dispatch();
        } catch (Exception $e) {
            // handle exceptions
            Falcon_Error::catchException($e);
        }
    }

    /**
     * Run controller
     */
    public function dispatch()
    {
        Falcon_Controller_Front::getInstance()->dispatchCached();
    }

    /**
     * Run controller and return result
     */
    public function dispatchReturn()
    {
        return Falcon_Controller_Front::getInstance()->dispatchReturn();
    }

    /**
     * Application core tools initialization
     */
    public function initialize($config, $unit = false)
    {
        $this->setConfig($config);
        $this->setDbAdapter();
        $this->setView();
        $this->setTranslate();
        $this->setMailTransport();

        // start session only not in command line mode
        if (!isset($config['_cli']) || !$config['_cli']) {
            $this->setSession($unit);
        }

        // front controller initialization
        $front = Falcon_Controller_Front::getInstance();

        $front
            ->setBaseUrl($config['url']['base'])
            ->setControllerDirectory($config['path']['controllers'])
            ->setRouter($this->setRouter())// Подключение маршрутизации
            ->registerPlugin(new Falcon_Controller_Plugin_Startup())
            ->registerPlugin(new Zend_Controller_Plugin_PutHandler())
            ->registerPlugin(new Falcon_Controller_Plugin_DeleteHandler())
            ->throwexceptions($config['debug']);
    }

    /**
     * Loader configuration
     */
    public function setLoader()
    {
        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->suppressNotFoundWarnings(true);
        $autoloader->registerNamespace('Credis_');
        $autoloader->registerNamespace('Cm_');
        $autoloader->registerNamespace('Falcon_');
        $autoloader->registerNamespace('OAuth2\\');
    }

    /**
     * Session configuration
     */
    public function setSession($unit = false)
    {
        $config = Zend_Registry::get('config');

        // Starts the session
        Zend_Session::$_unitTestEnabled = $unit;
        Zend_Session::setSaveHandler(Falcon_Mapper_Session::getInstance());

        // IE fix
        // http://forum.joomla.org/viewtopic.php?p=528553#p528553
        if (!$unit) {
            header('P3P: CP="NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"');
        }
        //Falcon_Controller_Front::getInstance()->getResponse()->setHeader(
        //	'P3P', 'CP="NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"');

        Zend_Session::setOptions([
            'cookie_lifetime' => $config->session->lifeTime,
            'gc_maxlifetime' => $config->session->lifeTime
        ]);
        Zend_Session::start();
    }

    /**
     * Configuration
     * @param {Array} $config Config array object
     */
    public function setConfig($config)
    {
        $config = new Zend_Config($config);
        $this->_config = $config;
        Zend_Registry::set('config', $config);
    }

    /**
     * View configuration
     */
    public function setView()
    {
        // инициализация Zend_Layout, настройка пути к макетам, а также
        // имени главного макета.
        Zend_Layout::startMvc();

        // получение объекта Zend_Layout
        $layout = Zend_Layout::getMvcInstance();

        // настройка расширения макетов
        $layout->setViewSuffix('tpl');

        // инициализация объекта Zend_View
        $view = $layout->getView();

        // задание базового URL
        $view->baseUrl = $this->_config->url->base;
        $view->config = $this->_config;

        // установка объекта Zend_View
        $layout->setView($view);

        // настройка расширения view скриптов с помощью Action помошников
        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer();
        $viewRenderer
            ->setView($view)
            ->setViewSuffix('tpl');

        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);
    }

    /**
     * Database configuration
     */
    public function setDbAdapter()
    {
        // подключение к БД, так как Zend_Db "понимает" Zend_Config, нам
        // достаточно передать специально сформированный
        // объект конфигурации в метод factory
        $db = Zend_Db::factory($this->_config->db);

        // задание адаптера по умолчанию для
        // наследников класса Zend_Db_Table_Abstract
        Zend_Db_Table_Abstract::setDefaultAdapter($db);

        // turns on a profiler
        $db->getProfiler()->setEnabled($this->_config->debug);

        // занесение объекта соединения c БД в реестр
        Zend_Registry::set('db', $db);
    }

    /**
     * Routes setup
     */
    public function setRouter()
    {
        $config = $this->_config->toArray();
        $locale = new Zend_Locale('auto');
        $lang = array_key_exists($locale->getLanguage(), $config['locales'])
            ? $locale->getLanguage() : key($config['locales']);

        $router = new Zend_Controller_Router_Rewrite();
        $router->addRoute('default',
            new Zend_Controller_Router_Route(
                ':controller/:action/*',
                [
                    'package' => 'def',
                    'controller' => 'index',
                    'action' => 'index',
                    'lang_default' => $lang
                ],
                [
                    'package' => '\w{3,}'
                ]
            )
        );
        // маршрут для ускоренного "выноса" :) из системы
        $router->addRoute('logout',
            new Zend_Controller_Router_Route(
                'logout/*',
                [
                    'controller' => 'auth',
                    'action' => 'logout'
                ]
            )
        );
        $router->addRoute('default_lang',
            new Zend_Controller_Router_Route(
                ':lang/:controller/:action/*',
                [
                    'controller' => 'index',
                    'action' => 'index',
                    'forced' => '1'
                ],
                [
                    'lang' => '\w{2}'
                ]
            )
        );
        $router->addRoute('default_lang_js',
            new Zend_Controller_Router_Route(
                'frontend/lang/:lang/:root',
                [
                    'controller' => 'frontend',
                    'action' => 'lang',
                    'lang' => $lang,
                    'root' => 'index'
                ],
                [
                    'lang' => '\w{2}'
                ]
            )
        );
        // rest route
        $front = Zend_Controller_Front::getInstance();
        $router->addRoute('rest_route',
            new Zend_Rest_Route(
                $front,
                [],
                ['default' => [
                    'a_address',
                    'a_city',
                    'a_street',
                    //'billing_account',
                    'billing_invoice',
                    'dn_act',
                    'dn_analytic_report',
                    'dn_division',
                    'dn_offer',
                    'dn_offer_value',
                    'dn_warehouse',
                    'dn_worker',
                    'dn_worker_post',
                    'dn_worker_specialization',
                    'mon_call',
                    'mon_device',
                    'mon_device_image',
                    'mon_device_sensor',
                    'mon_device_sensor_history_setting',
                    'mon_device_protocol',

                    'mon_device_command_type',
                    'mon_device_command',
                    'mon_device_command_template',

                    'mon_fuel',
                    'mon_geofence',
                    'mon_geofence_presence',
                    'mon_packet',
                    'mon_sim_card',
                    'mon_vehicle',
                    'mon_vehicle_driver',
                    'mon_waylist',
                    'mon_waylist_route',
                    'mon_fuel_consumption_report',
                    'mon_fuel_consumption_report_item',
                    'n_work',
                    'sdesk_issue',
                    'sdesk_priority',
                    'sdesk_service',
                    'session', //!
                    'x_company',
                    'x_fee',
                    'x_fee_value',
                    'x_firm',
                    'x_group_mon_device',
                    'x_group_mon_geofence',
                    //'x_history',
                    'x_notification',
                    'x_notice',
                    'x_lang',
                    'x_module',
                    'x_package',
                    'x_person',
                    'x_report',
                    'x_right',
                    'x_right_level',
                    'x_tariff',
                    'x_tariff_option',
                    'x_tariff_module_link',
                    'x_tariff_option_value',
                    //'x_transport',
                    'x_utc',
                    'x_user'
                ]]
            )
        );
        $router->addRoute('mon_device_image_draw',
            new Zend_Controller_Router_Route(
                'mon_device_image/:id/draw/:size',
                [
                    'controller' => 'mon_device_image',
                    'action' => 'draw'
                ]
            )
        );
        $router->addRoute('attachment',
            new Zend_Controller_Router_Route(
                ':controller/attachment/:id/:option',
                [
                    'action' => 'attachment',
                    'option' => ''
                ],
                [
                    'id' => '\d+'
                ]
            )
        );
        $router->addRoute('x_history',
            new Zend_Controller_Router_Route(
                'x_history/:entity_table/:id_entity',
                [
                    'controller' => 'x_history',
                    'action' => 'index'
                ]
            )
        );
        return $router;
    }

    /**
     * Zend translator setup
     */
    public function setTranslate()
    {
        $config = $this->_config->toArray();
        $helperLanguage = new Falcon_Controller_Action_Helper_Language(
            $config['locales'],
            $config['translate']
        );
        Zend_Registry::set('helperLanguage', $helperLanguage);
        Zend_Controller_Action_HelperBroker::addHelper($helperLanguage);
    }

    /**
     * Mail transport setup
     */
    public function setMailTransport()
    {
        $config = $this->_config->toArray();
        $confmail = $config['mail'];
        $transport = Zend_Mail::getDefaultTransport();
        if (strtolower($confmail['transport']) == 'smtp') {
            $transport = new Zend_Mail_Transport_Smtp(
                $confmail['config']['host'],
                $confmail['config']
            );
        }
        if ($transport) {
            Zend_Mail::setDefaultTransport($transport);
        }
    }
}
