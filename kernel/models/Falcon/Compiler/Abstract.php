<?php

/**
 * Abstract compiler
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Compiler_Abstract
{
    protected $content;
    protected $noLoadList;

    /**
     * Список уже загруженных модулей
     * @var string[]
     */
    protected $loadedModules;

    /**
     * Массив настроек
     */
    public $config;

    /**
     * Список путей до папок с модулями
     * @var string[]
     */
    protected $modulePath = [
        'current' => 'o/modules/'
    ];

    /**
     * Default content type for compiled files
     * @var string
     */
    protected $defaultContentType = 'text/plain';

    /**
     * Регулярное выражение для поиска указания базового пути
     * @var string
     */
    protected $pathRegex;

    /**
     * Constructor
     * На входе принимает в качестве параметра массив $config,
     * который содержит поля
     *   path         - корневой путь к файлам компиляции
     *   content-type - тип содержимого скомпилированного файла
     * @param {array} $config Конфигурационный массив
     */
    public function __construct(array $config)
    {
        $this->config = $config;
        $this->reset();
        // загружаем конфигурационный файл
        $this->config['frontendConfig'] =
            $this->loadConfig($this->config['path']);

        $static = Zend_Registry::get('config')->resources->static;
        $this->staticPath = getProtocol() . '://' . $static;

        $node = Zend_Registry::get('config')->resources->node;
        $nodeSsl = Zend_Registry::get('config')->resources->node_ssl;

        if (getProtocol() == 'http') {
            $this->nodePath = getProtocol() . '://' . $node;
        }

        if (getProtocol() == 'https') {
            $this->nodePath = getProtocol() . '://' . $nodeSsl;
        }

        if (isset($this->config['frontendConfig']->path->modules)) {
            $this->modulePath = $this->config['frontendConfig']->path->modules->toArray();
        }
    }

    /**
     * Возвращает тип содержимого
     * @return {string}
     */
    public function getContentType()
    {
        if (!isset($this->config['content-type'])) {
            $this->setContentType($this->defaultContentType);
        }
        return $this->config['content-type'];
    }

    /**
     * Устанавливает тип содержимого
     * @return this
     */
    public function setContentType($value)
    {
        $this->config['content-type'] = $value;
        return $this;
    }

    /**
     * Прицепляет к названиям файлов путь $path
     * @param {string[]} $list Массив имен файлов
     * @param {string} $path [Опц.] Корневой путь, если не указан берется из настроек
     * @return string[]
     */
    public function applyPathToList($list, $path = null)
    {
        $result = [];
        if (is_array($list)) {
            if (!$path) {
                $path = $this->config['path'];
            }
            foreach ($list as $filename) {
                $result[] = realpath($path . '/' . $this->applyParams($filename));
            }
        }
        return $result;
    }

    /**
     * Замена параметров в строке $line
     * @param {string} $line
     */
    protected function applyParams($string)
    {
        if (!isset($this->config['params'])) {
            return $string;
        }


        foreach ($this->config['params'] as $param => $value) {
            if (is_string($value)) {
                $string = str_replace("{{{$param}}}", $value, $string);
            }
        }
        return $string;
    }

    /**
     * Компиляция файлов, переданных в переменной $list
     * @param {array} $list Список файлов
     * @return {string} Окончательный код
     */
    public function compile($list)
    {
        $this->concat($list);
        // некомпрессированный код
        $content = $this->getContent();
        return $content;
    }

    /**
     * Добавление имени файла для исключения
     * @param {String[]} $list массив имен файлов
     * @return this
     */
    public function addFilesToNoLoadList($list)
    {
        $this->noLoadList = array_merge($this->noLoadList, $list);
        return $this;
    }

    /**
     * Объединение файлов
     * @param {array} $list Массив имен файлов
     * @param {Boolean} $reset Флаг очистки предыдущих данных
     * @return {string}
     */
    public function concat($list, $reset = false)
    {
        if (!is_array($list)) {
            return ''; // может через Exception?
        }

        if ($reset) {
            $this->reset();
        }

        $result = '';
        foreach ($list as $filename) {
            if (!is_string($filename)) {
                continue; // может через Exception?
            }

            $path = realpath($this->applyParams($filename));
            if (file_exists($path) && !in_array($path, $this->noLoadList)) {
                $result .= file_get_contents($path) . "\r\n";
                $this->noLoadList[] = $path;
            }
        }

        $this->content .= $result;
        return $result;
    }

    /**
     * Загрузка конфигурации по адресу $path
     * @return Zend_Config
     */
    protected function loadConfig($path)
    {
        if (file_exists(realpath($path) . '/config.json')) {
            return new Zend_Config_Json(realpath($path) . '/config.json');
        } else
            if (file_exists(realpath($path) . '/config.xml')) {
                return new Zend_Config_Xml(realpath($path) . '/config.xml');
            } else
                if (file_exists(realpath($path) . '/config.ini')) {
                    return new Zend_Config_Ini(realpath($path) . '/config.ini');
                } else
                    if (file_exists(realpath($path) . '/config.yaml')) {
                        return new Zend_Config_Yaml(realpath($path) . '/config.yaml');
                    }
        return null;
    }

    /**
     * Загрузка имен файлов по адресу $path
     * @param {string} $path Путь к загружаемому модулю
     * @param {string[]} $sections Список секций конфигурационного файла
     * @param {string} $useRootPath [Опц. = false] Использовать базовую директорию
     * @param {string} $defaultKey [Опц. = current] Путь до модулей по умолчанию
     * @return {string[]} Массив имен файлов
     */
    public function load($path, array $sections, $useRootPath = true, $defaultKey = 'current')
    {
        $list = [];

        if ($useRootPath) {
            $path = realpath($this->config['path'] . $path);
        }

        // считываем настройки модуля
        $config = $this->loadConfig($path);

        if ($config) {
            $arrayConfig = $config->toArray();

            foreach ($sections as $section) {
                if (!isset($arrayConfig[$section])) {
                    continue;
                }
                if ($section == 'modules') {
                    if (is_array($arrayConfig['modules'])) {
                        foreach ($arrayConfig['modules'] as $module) {
                            $list = array_merge($list,
                                $this->loadModule($module, $sections, $defaultKey));
                        }
                    }
                } else {
                    $root = ($section == 'include') ? null : $path;
                    if (isset($arrayConfig[$section])) {
                        $list = array_merge($list,
                            $this->applyPathToList(
                                $arrayConfig[$section], $root)
                        );
                    }
                }
            }
        }

        return $list;
    }

    /**
     * Returns true if specified module is enabled and can be loaded
     * @param {string} $module alias/path of the module
     * @return boolean
     */
    public function isModuleEnabled($module)
    {
        $globalConfig = Zend_Registry::get('config');
        $disabledModules = $globalConfig->frontend->modules->disabled;
        return !in_array($module, $disabledModules->toArray());
    }

    /**
     * Module loading
     * @param {string} $module Alias/path of the module
     * @param {string[]} $sections Sections list to load from module
     * @param {string} $defaultKey
     * @return {string[]} A list of module files
     */
    public function loadModule($module, array $sections, $defaultKey = 'current')
    {
        $module = $this->applyParams($module);
        $list = [];

        $config = $this->config['frontendConfig'];
        if (!$config || !$this->isModuleEnabled($module)) {
            return $list;
        }

        if ($config->aliases) {
            $aliases = $config->aliases->toArray();
            if (isset($aliases[$module])) {
                $module = $aliases[$module];
            }
        }

        if (preg_match($this->getPathRegex(), $module, $result)) {
            $key = $result['key'];
            $module = str_replace($result[0], '', $module);
        } else {
            $key = $defaultKey;
        }

        // защитимся от рекурсии - проверим не загружен ли модуль
        $hash = $this->hash($key, $module);
        if (in_array($hash, $this->loadedModules)) {
            return $list;
        }

        // выясняем адрес модуля и загружаем его
        $this->loadedModules[] = $hash;
        $path = $this->applyParams($this->modulePath[$key]);
        $list = $this->load($path . '/' . $module, $sections, true, $key);

        return $list;
    }

    /**
     * Очищаем / инициализируем параметры класса
     * @return this
     */
    public function reset()
    {
        $this->content = '';
        $this->noLoadList = [];
        $this->loadedModules = [];
        return $this;
    }

    /**
     * Возвращает текущее содержимое компилятора
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Возвращает регулярное выражения для поиска указания базового пути
     * @return string
     */
    protected function getPathRegex()
    {
        if (empty($this->pathRegex)) {
            $variants = array_keys($this->modulePath);
            $variants = implode('|', $variants);
            $this->pathRegex = '/\s*(?P<key>' . $variants . ')\s*>\s*/us';
        }

        return $this->pathRegex;
    }

    /**
     * Создает хеш из адреса модуля и базового пути
     * Нужно, чтобы избежать повторений при подключении
     * @param {String} $base
     * @param {String} $module
     * @return string
     */
    protected function hash($base, $module)
    {
        // no chance to have null byte in any of this strings
        $string = $base . "\0" . $module;

        return md5($string, true);
    }

    /**
     * Returns additional data
     * @return string
     */
    public function getHeader()
    {
        return '';
    }

    /**
     * Returns additional data
     * @return string
     */
    public function getFooter()
    {
        return '';
    }
}
