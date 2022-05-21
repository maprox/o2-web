<?php

/**
 * Класс ответа сервера
 *
 * Ошибка должна содержать в себе код ошибки - числовое значение
 * однозначно определенная на стороне клиента (можно посмотреть в файле
 * o/lang/ru/err.js). Также в дополнение к коду ошибки должны быть
 * переданы:
 * 0. сообщение об ошибке (на английском языке) / либо имя объекта ошибки
 * 1. имя метода в котором произошла ошибка;
 * 2. имя класса, которому принадлежит метод.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Message_Abstract
{
    /**
     * Результат ответа
     * @var Boolean
     */
    private $_success;

    /**
     * Массив ошибок
     * @var Array
     */
    private $_errors;

    /**
     * Выводит в массив результата массив errors в любом случае
     * @var Boolean
     */
    protected $_errorsArrayForced;

    /**
     * Настройки имен полей в результирующем массиве
     * @var Array
     */
    protected $_names = [
        'success' => 'success',
        'errors' => 'errors'
    ];

    /**
     * Конструктор.
     * @param {Boolean} $success [Опц. = true] Значение результата ответа
     */
    public function __construct($data = null, $success = true)
    {
        $this->reset();
        $this->setSuccess($success);
    }

    /**
     * Очистка данных
     * @return {Falcon_Message_Abstract} $this
     */
    public function reset()
    {
        $this->_success = true;
        $this->_errors = [];
        return $this;
    }

    /**
     * Установка имен полей вывода
     * @param {Array} $names Массив новых имен
     * @return {Falcon_Message_Abstract} $this
     */
    public function setNames($names)
    {
        if (!is_array($names))
            throw new Falcon_Exception(
                'Incorrect input data', 4042, $names);
        if (!isset($names['success']))
            throw new Falcon_Exception(
                'Param not found', 4042, 'success');
        if (!isset($names['errors']))
            throw new Falcon_Exception(
                'Param not found', 4042, 'errors');
        $this->names = $names;
        return $this;
    }

    /**
     * Возвращает список последних ошибок
     * @return {Array}
     */
    public function getErrorsList()
    {
        return $this->_errors;
    }

    /**
     * Возвращает массив последней ошибки
     * @return {Array}
     */
    public function getLastError()
    {
        $errors = $this->getErrorsList();
        $count = count($errors);
        return ($count > 0) ? $errors[$count - 1] : null;
    }

    /**
     * Установка результата
     * @param {Boolean} $value Значение
     * @param {Boolean} $clearErrors [Опц. [false]] Очищать список ошибок
     */
    public function setSuccess($value, $clearErrors = false)
    {
        if ($clearErrors) {
            $this->reset();
        }
        $this->_success = $value;
        return $this;
    }

    /**
     * Возвращает результат ответа
     * @return {Boolean}
     */
    public function isSuccess()
    {
        return $this->_success;
    }

    /**
     * Возвращает булевое значение является ли результат отрицательным
     * @return {Boolean}
     */
    public function isFailure()
    {
        return !$this->isSuccess();
    }

    /**
     * Adding of an error
     * @param {Number} $code Error code
     * @param {Array} $params Error params array (defaults to empty array)
     * @return {Falcon_Message_Abstract} this
     */
    public function error($code, $params = [])
    {
        $this->_success = false;
        $this->_errors[] = [
            'code' => $code,
            'params' => $params
        ];
        return $this;
    }

    /**
     * Добавление списка ошибок
     * @param {Array} $errors Массив ошибок для добавления в ответ
     * @return {Falcon_Message_Abstract} this
     */
    public function appendErrors($errors)
    {
        foreach ($errors as $error)
            $this->error(
                isset($error['code']) ? $error['code'] : 0,
                isset($error['params']) ? $error['params'] : []
            );
        return $this;
    }

    /**
     * Объединение (математическое и) ответа с ответом $answer
     * @param {Falcon_Message_Abstract} $answer Объект ответа
     * @return {Falcon_Message_Abstract} this
     */
    public function append(Falcon_Message_Abstract $answer)
    {
        if ($answer->isFailure())
            $this->setSuccess(false);
        return $this->appendErrors($answer->getErrorsList());
    }

    /**
     * Вывод данных ввиде массива
     * @return array
     */
    public function toArray()
    {
        $result = [];
        $result[$this->_names['success']] = $this->isSuccess();
        if (!empty($this->_errors)) {
            $result[$this->_names['errors']] = $this->getErrorsList();
        }
        return $result;
    }
}
