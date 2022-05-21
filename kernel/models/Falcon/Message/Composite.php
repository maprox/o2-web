<?php

/**
 * Класс объединенного ответа сервера.
 * Нужен для объединения результатов нескольких запросов.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 * @author     kpakshaev <kpakshaev@maprox.net>
 */
class Falcon_Message_Composite extends Falcon_Message
{
    const DEFAULT_NAME = 'data';

    /**
     * Ассоциативный массив объектов ответа
     * @var Array
     */
    private $_answers = [];

    /**
     * Переменная отсчитывающая, сколько уже ответов
     * со стандартным именем добавлено
     * @var Integer
     */
    private $_increment = 0;

    /**
     * Конструктор.
     */
    public function __construct()
    {
        $this->reset();
    }

    /**
     * Добавляет еще один ответ к выводу
     * @param {Falcon_Message} $answer Объект ответа
     * @param {String} $name Имя ответа
     * @return {Falcon_Message_Abstract} $this
     */
    public function add($answer, $name = '')
    {
        if (empty($name)) {
            $name = self::DEFAULT_NAME . $this->_increment;
            $this->_increment++;
        }

        if (!($answer instanceOf Falcon_Message)) {
            throw new Falcon_Exception(
                'Incorrect answer object', 4042, 'errors');
        }

        $this->_answers[$name] = $answer;

        return $this;
    }

    /**
     * Возвращает скомпилированный ответ
     * @return {Falcon_Message_Abstract} $this
     */
    public function merge()
    {
        $success = true;
        $data = [];

        foreach ($this->_answers as $name => $answer) {
            if ($answer->isFailure()) {
                $success = false;
            }

            $answer = $answer->getParams();

            if (isset($answer["data"])) {
                $data[$name] = $answer["data"];
            } else {
                $data[$name] = $answer;
            }
        }

        $this->addParam("data", $data);
        $this->setSuccess($success);

        return $this;
    }
}
