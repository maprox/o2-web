<?php

/**
 * Абстрактный класс singleton-объекта, работающего с базой данных
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011, Maprox LLC
 */
abstract class Falcon_Db_Singleton extends Falcon_Db_Table_Abstract
{
    /**
     * Массив объектов дочерних классов
     * @var instanceof Falcon_Db_Singleton[]
     */
    private static $instances = [];

    /**
     * Благословить создание экземпляров класса
     * Выставляется ТОЛЬКО в getInstance(),
     * чтобы нельзя было создать экземпляр извне
     * @var Boolean
     */
    private static $allowNew = false;

    final public function __construct()
    {
        // можно было бы сделать по нормальному (просто private),
        // но необходимо наследование от Falcon_Db_Table_Abstract
        // и, соответственно, такой же доступ для __construct(), как у него
        if (!self::$allowNew)
            throw new Exception (get_called_class() .
                ' must be singletone, use getInstance() method instead of NEW');
        parent::__construct();
    }

    final private function __clone()
    {
    }

    /**
     * Получение объекта
     * @return instanceof Falcon_Db_Singleton
     */
    final public static function getInstance()
    {
        $className = get_called_class();
        if (!array_key_exists($className, self::$instances)) {
            self::$allowNew = true;
            self::$instances[$className] = new $className();
            self::$allowNew = false;
        }
        return self::$instances[$className];
    }
}