<?php

/**
 * Abstract class for an singletone object
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Singleton
{
    /**
     * Массив объектов дочерних классов
     * @var Falcon_Singleton[]
     */
    private static $instances = [];

    protected function __construct()
    {
    }

    final private function __clone()
    {
    }

    /**
     * Returns an instance of this object
     * @param $option Опция для конструктора
     * @return static
     */
    final public static function getInstance($option = false)
    {
        $className = get_called_class();
        $key = $className . ($option ? ' ' . (string)$option : '');
        if (!array_key_exists($key, self::$instances)) {
            if ($option) {
                self::$instances[$key] = new $className($option);
            } else {
                self::$instances[$key] = new $className();
            }
        }
        return self::$instances[$key];
    }
}
