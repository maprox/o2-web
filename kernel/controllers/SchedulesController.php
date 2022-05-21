<?php

/**
 * Schedules controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class SchedulesController extends Falcon_Controller_Action
{
    /**
     * load
     * Загрузка расписания
     */
    public function loadAction()
    {
        $this->sendAnswer($this->get());
    }

    public function get()
    {
        $scheduleId = json_decode($this->_getParam('scheduleId'));
        $schedule = new Falcon_Record_X_Schedule($scheduleId);
        // ответ сервера
        return new Falcon_Message($schedule->toArray());
    }

    /**
     * set
     * Изменение расписания
     */
    public function setAction()
    {
        // входные данные
        $data = $this->getJsonData();
        // объект ответа
        $answer = new Falcon_Message();
        // check for an id
        if (!isset($data->id)) {
            throw new Falcon_Exception('Bad request',
                Falcon_Exception::BAD_REQUEST);
        }
        $schedule = new Falcon_Record_X_Schedule($data->id);
        $schedule->setProps((array)$data)->update();
        // ответ сервера
        $this->sendAnswer(new Falcon_Message());
    }
}
