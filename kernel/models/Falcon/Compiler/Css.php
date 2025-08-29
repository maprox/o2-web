<?php

/**
 * Класс "объединителя" Css файлов
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Compiler_Css extends Falcon_Compiler_Abstract
{
    protected $staticTag = '%static%';
    protected $langTag = '%lang%';

    /**
     * Default content type for compiled files
     * @var string
     */
    protected $defaultContentType = 'text/css';

    /**
     * Конструктор
     * @param {array} $config Конфигурационный массив
     */
    public function __construct($config = null)
    {
        parent::__construct($config);

        $this->staticPath = Zend_Registry::get('config')->resources->static;
    }

    /**
     * Загрузка имен файлов по адресу $path
     * @param {string} $path Путь к загружаемому модулю
     */
    public function loadData($path)
    {
        return $this->load($path, ['modules', 'css']);
    }

    /**
     * Загрузка имен файлов модуля $module
     * @param {string} $module Имя модуля
     */
    public function loadModuleData($module)
    {
        return $this->loadModule($module, ['modules', 'css']);
    }

    /**
     * Возвращает текущее содержимое компилятора
     */
    public function getContent()
    {
        $content = $this->content;
        $content = str_ireplace($this->staticTag, $this->staticPath, $content);
        return $content;
    }
}
