<?php

/**
 * Класс ответа pipe-серверу.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 * @author     kpakshaev <kpakshaev@maprox.net>
 */
class Falcon_Message_Pipe extends Falcon_Message_Param
{
    /**
     * Добавляет еще один ответ к выводу
     * @param {String} $type Тип команды
     * @param {Mixed} $data Имя ответа
     * @return {Falcon_Message_Pipe} $this
     */
    public function addCommand($type, $data = null)
    {
        $commands = $this->getParam('commands');
        if (!empty($data)) {
            $commands[] = [
                'cmd' => $type,
                'data' => $data,
            ];
        } else {
            $commands[] = [
                'cmd' => $type,
            ];
        }
        $this->addParam('commands', $commands);
        return $this;
    }

    /**
     * Составляет команду к pipe-серверу
     * @return {String}
     */
    public function getCommand()
    {
        $commands = $this->getParam('commands');
        return 'OBS,' . ($this->isSuccess() ? 'success' : 'error')
        . ',request(' . json_encode($commands) . ')';
    }
}
