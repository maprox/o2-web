<?php

/**
 * Abstract class for callbacks
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
abstract class Falcon_Action_Callback_Abstract extends Falcon_Action_Abstract
{
    /**
     * @var {Boolean}
     */
    protected $finished = false;

    /**
     * Work to work with
     * @var Falcon_Record_N_Work
     */
    protected $work = null;

    // Defined for future use
    public function __construct($objectId)
    {
    }

    /**
     * Обрабатывает ответ Falcon_Sender-а, выполняет необходимые действия
     * @param {Falcon_Sender_Response} $response
     */
    abstract public function process(Falcon_Sender_Response $response);

    /**
     * Set work to work with
     * @param Falcon_Record_N_Work $work
     */
    public function setWork($work)
    {
        $this->work = $work;
    }

    /**
     * Get work
     * @return Falcon_Record_N_Work
     */
    public function getWork()
    {
        return $this->work;
    }

    /**
     * Отмечает то, что ответ обработан и в этом коллбеке уже нет нужды
     */
    protected function setFinished()
    {
        $this->finished = true;
    }

    /**
     * Возвращает отметку о том, завершена ли работа этого коллбека
     * @return {Boolean}
     */
    public function isFinished()
    {
        return (bool)$this->finished;
    }
}
