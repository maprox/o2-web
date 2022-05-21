<?php

/**
 * Server answer class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Message extends Falcon_Message_Param
    implements Iterator, ArrayAccess, Countable
{
    /**
     * Текущая позиция итератора
     * @var Integer
     */
    protected $_position;

    /**
     * Contructor
     * @param {Mixed} $data [Opt. = null]
     * @param {Boolean} $success [Opt. = true] Success flag
     */
    public function __construct($data = null, $success = true)
    {
        parent::__construct($data, $success);
        $this->addParam('data', ($data !== null) ? $data : []);
    }

    /**
     * Добавление параметра в ответ
     * @param {String} $param Имя параметра
     * @param {Mixed} $value Значение параметра
     * @return {Falcon_Message_Abstract} this
     */
    public function addParam($param, $value)
    {
        parent::addParam($param, $value);
        if ($param == "data") {
            if (is_array($value)) {
                $this->addParam('total', count($value));
                $this->_position = key($this->_params[$param]);
            }
        }
        return $this;
    }

    /**
     * Удаление параметра из списка по имени
     * @param {String} $param Имя параметра
     * @return {Falcon_Message_Abstract} this
     */
    public function delParam($param)
    {
        if ($param == "data") {
            $this->delParam("total");
        }
        parent::delParam($param);
        return $this;
    }

    /**
     * Объединение данных с другим ответом
     * @param {Falcon_Message} $answer Объект ответа
     * @return {Falcon_Message} $this
     */
    public function append(Falcon_Message_Abstract $answer)
    {
        parent::append($answer);
        foreach ($answer->getParams() as $param => $value) {
            $newValue = $value;
            $thisValue = $this->getParam($param);
            if ($thisValue) {
                if (is_array($thisValue) && is_array($value))
                    $newValue = array_merge($thisValue, $value);
            }
            $this->addParam($param, $newValue);
        }
        return $this;
    }

    /**
     * Adding of an error
     * @param {Number} $code Error code
     * @param {Array} $params Error params array (defaults to empty array)
     * @param {Boolean} $clearDataParam Clears the 'data' param of answer
     *   (defaults to true)
     * @return {Falcon_Message_Abstract} this
     */
    public function error($code, $params = [], $clearDataParam = true)
    {
        parent::error($code, $params);
        if ($clearDataParam) {
            $this->delParam('data');
        }
        return $this;
    }

    /**
     * Вывод данных ввиде массива
     * @return Array
     */
    public function toArray()
    {
        $result = parent::toArray();
        foreach ($this->getParams() as $name => $value) {
            $result[$name] = $value;
        }
        return $result;
    }

    /**
     * Получение данных запроса
     * @return Array[]
     */
    public function getData()
    {
        return $this->getParam('data');
    }

    /**
     * Получение строки данных запроса
     * @param Integer $rowIndex Номер строки
     * @return Mixed[]
     */
    public function getRow($rowIndex = 0)
    {
        $data = $this->getData();
        return isset($data[$rowIndex]) ? $data[$rowIndex] : null;
    }

    /**
     * Получение ячейки данных запроса
     * @param String $index Поле
     * @param Integer $rowIndex Номер строки
     * @return Mixed
     */
    public function getCell($index = null, $rowIndex = 0)
    {
        $data = $this->getData();
        if (!isset($data[$rowIndex]) || !count($data[$rowIndex])) {
            return null;
        }
        if ($index === null) {
            return array_shift($data[$rowIndex]);
        }
        if (!isset($data[$rowIndex][$index])) {
            return null;
        }
        return $data[$rowIndex][$index];
    }

    /**
     * Получение колонки (массива ячеек) данных запроса
     * @param String $index Поле
     * @return Mixed[]
     */
    public function getCol($index = null)
    {
        $data = $this->getData();
        if (!is_array($data)) {
            return null;
        }
        $col = [];
        foreach ($data as $row) {
            if (!count($row)) {
                return null;
            }
            if ($index === null) {
                $col[] = array_shift($row);
                continue;
            }
            if (!isset($row[$index])) {
                return null;
            }
            $col[] = $row[$index];
        }
        return $col;
    }

    /**
     * Функции необходимые для интерфейсов,
     * релизуют работу с объектом Falcon_Message как с массивом
     */

    public function count()
    {
        $data = $this->getData();

        return count($data);
    }

    /**
     *
     * @param type $offset
     * @param type $value
     */
    public function offsetSet($offset, $value)
    {
        if (is_null($offset)) {
            $this->_params['data'][] = $value;
        } else {
            $this->_params['data'][$offset] = $value;
        }

        $this->_params['total'] = $this->count();
    }

    /**
     *
     * @param type $offset
     */
    public function offsetUnset($offset)
    {
        unset($this->_params['data'][$offset]);
        $this->_params['total'] = $this->count();
    }

    /**
     *
     * @param type $offset
     * @return type
     */
    public function offsetExists($offset)
    {
        return isset($this->_params['data'][$offset]);
    }

    /**
     *
     * @param type $offset
     * @return type
     */
    public function offsetGet($offset)
    {
        return isset($this->_params['data'][$offset]) ?
            $this->_params['data'][$offset] : null;
    }

    /**
     *
     * @return type
     */
    public function rewind()
    {
        return reset($this->_params['data']);
    }

    /**
     *
     * @return type
     */
    public function current()
    {
        return current($this->_params['data']);
    }

    /**
     *
     * @return type
     */
    public function key()
    {
        return key($this->_params['data']);
    }

    /**
     *
     * @return type
     */
    public function next()
    {
        return next($this->_params['data']);
    }

    /**
     *
     * @return type
     */
    public function valid()
    {
        return key($this->_params['data']) !== null;
    }
}
