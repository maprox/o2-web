<?php

/**
 * Logger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2023, Maprox LLC
 */
class Falcon_Logger extends Falcon_Singleton
{
    /**
     * Корень до папки с логами. Вычисляется автоматически.
     * @var {String}
     */
    protected $root = '';
    /**
     * Формат логирования сообщений. Берется из настроек.
     * @var {String}
     */
    protected $format = '';
    /**
     * Максимальная глубина вложенности. Берется из настроек.
     * @var {Integer}
     */
    protected $maxDepth = 0;
    /**
     * Формат таймстампа. Берется из настроек.
     * @var {String}
     */
    protected $timestampFormat = '';
    /**
     * Массив с готовыми логгерами.
     * @var {Zend_Log[]}
     */
    protected $loggers = [];

    /**
     * Логирование
     * @param {String} $flag Флаг (тип) лога
     * @param {Mixed} $params Параметры логируемого
     * @param {String} $prefix Префикс к дампу.
     * Можно поменять местами с предыдущим аргументом для читабельности.
     */
    public function log($flag, $params, $prefix = null)
    {
        if (!isset($this->loggers[$flag])) {
            $this->createLogger($flag);
        }

        if (is_string($params) && !empty($prefix)) {
            $tmpPrefix = $prefix;
            $prefix = $params;
            $params = $tmpPrefix;
        }

        $text = $this->formatParams($params, 0, $prefix);
        $this->loggers[$flag]->debug($text);
    }

    /**
     * Форматирование
     * @param {Mixed} $params Параметры логируемого
     * @param {Integer} $tabCount Отступ логируемого
     * @param {String} $key Ключ элемента
     */
    protected function formatParams($params, $tabCount = 0, $key = null)
    {
        if ($tabCount > $this->maxDepth) {
            return 'Max depth reached';
        }

        $addKey = $key === null ? '' : '[' . (string)$key . ']: ';

        if (is_object($params)) {
            $lines = [];
            $class = get_class($params);
            $lines[] = $this->formatParams(
                'Begin ' . $class . ' dump', $tabCount, $key);

            if (method_exists($params, 'toArray')) {
                $params = $params->toArray();
            } else {
                $params = (array)$params;
            }

            foreach ($params as $key => $item) {
                $lines[] = $this->formatParams($item, $tabCount + 1, $key);
            }
            return implode("\n", $lines);
        }

        if (is_array($params)) {
            $lines = [];
            $lines[] = $this->formatParams(
                'Begin array dump', $tabCount, $key);
            foreach ($params as $key => $item) {
                $lines[] = $this->formatParams(
                    $item, $tabCount + 1, $key);
            }
            return implode("\n", $lines);
        }

        return str_repeat("\t", $tabCount) . $addKey . $params;
    }

    /**
     * Создание логгера
     * @param String $flag Флаг (тип) лога
     */
    protected function createLogger($flag)
    {
        $logger = new Zend_Log();
        $writer = new Zend_Log_Writer_Stream('php://output');
        $formatter = new Zend_Log_Formatter_Simple($this->format);

        $writer->setFormatter($formatter);
        $logger->addWriter($writer);
        $logger->setTimestampFormat($this->timestampFormat);

        $this->loggers[$flag] = $logger;
    }
}
