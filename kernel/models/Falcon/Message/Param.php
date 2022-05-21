<?php

/**
 * Класс ответа с параметрами.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Message_Param extends Falcon_Message_Abstract
{
    /**
     * Ассоциативный массив дополнительных параметров ответа
     * @var Array
     */
    protected $_params;

    /**
     * Очистка данных
     * @return {Falcon_Message_Abstract} this
     */
    public function reset()
    {
        parent::reset();
        $this->_params = [];
        return $this;
    }

    /**
     * Вывод списка параметров
     * @return {Array}
     */
    public function getParams()
    {
        return $this->_params;
    }

    /**
     * Добавление параметра в ответ
     * @param {String} $param Имя параметра
     * @param {Mixed} $value Значение параметра
     * @return {Falcon_Message_Abstract} this
     */
    public function addParam($param, $value)
    {
        $this->_params[$param] = $value;
        return $this;
    }

    /**
     * Удаление параметра из списка по имени
     * @param {String} $param Имя параметра
     * @return {Falcon_Message_Abstract} this
     */
    public function delParam($param)
    {
        unset($this->_params[$param]);
        return $this;
    }

    /**
     * Возвращает значение параметра по имени
     * @param {String} $param Имя параметра
     * @return {Mixed}
     */
    public function getParam($param)
    {
        if (isset($this->_params[$param])) {
            return $this->_params[$param];
        }

        return null;
    }

}
