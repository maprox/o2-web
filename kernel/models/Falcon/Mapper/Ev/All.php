<?php

/**
 * Class of "ev_all" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Ev_All extends Falcon_Mapper_Common
{
    protected $coordEventIds = [1, 20, 24, 28, 29];
    protected $userEvents = [18, 19, 31, 32];
    protected $ignoredEvents = [1, 18, 19];
    protected $requiredValueFields = [
        18 => ['ip'],
        // Пустой массив требований значит, что eventval может быть любым кроме null или false
        23 => [],
        28 => [],
        31 => ['login', 'ip'],
        32 => ['login'],
    ];

    /**
     * Возвращает страницу из списка событий за период
     * @param {Integer[]} $objectIds Айдишники объектов, чьи события надо собрать
     * @param {String} $start Дата начала периода
     * @param {String} $end Дата завершения периода
     * @param {Integer} $page Номер страницы
     * @param {Integer} $limit Количество событий на страницу
     * @param {String} $sortProp Свойство, по которому сортировка
     * @param {String} $sortDirection Направление сортировки
     * @return Array[]
     */
    public function loadEvents($objectIds, $start, $end, $page, $limit,
                               $sortProp, $sortDirection)
    {
        $ignoredEvents = [1];

        // Get device events
        $events = $this->getTable()->loadEvents(
            $objectIds,
            $start,
            $end,
            $page,
            $limit,
            $sortProp,
            $sortDirection,
            [
                'default' => $this->ignoredEvents,
                'users' => array_merge(
                    $this->ignoredEvents,
                    $this->userEvents
                ),
                'devices' => array_merge(
                    $this->ignoredEvents,
                    $this->coordEventIds
                )
            ]
        );

        $packetMapper = Falcon_Mapper_Mon_Packet::getInstance();
        foreach ($events as &$event) {
            if (!$this->isCorrectEvent($event['eventid'], $event['eventval'])) {
                $event = null;
                continue;
            }
            if (!in_array($event['eventid'], $this->coordEventIds)) {
                continue;
            }
            $packet = $packetMapper->load([
                'id_device = ?' => $event['ownerid'],
                'time = ?' => $event['dt']]);
            if (empty($packet)) {
                continue;
            }
            $packet = reset($packet);
            $event['latitude'] = $packet->get('latitude');
            $event['longitude'] = $packet->get('longitude');
        }

        return array_values(array_filter($events));
    }

    /**
     * Проверяет событие на корректность данных
     * @param {Integer} $eventId
     * @param {Mixed[]} $values
     * @return Boolean
     */
    public function isCorrectEvent($eventId, $values)
    {
        if (!isset($this->requiredValueFields[$eventId])) {
            return true;
        }
        if (empty($values)) {
            return false;
        }
        if (!is_array($values)) {
            $values = json_decode($values, true);
        }
        foreach ($this->requiredValueFields[$eventId] as $required) {
            if (!isset($values[$required])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Возвращает количество событий за период
     * @param {Integer[]} $objectIds Айдишники объектов, чьи события надо собрать
     * @param {String} $start Дата начала периода
     * @param {String} $end Дата завершения периода
     * @return Array[]
     */
    public function countEvents($objectIds, $start, $end)
    {
        return $this->getTable()->countEvents(
            $objectIds,
            $start,
            $end,
            [
                'default' => $this->ignoredEvents,
                'users' => array_merge(
                    $this->ignoredEvents,
                    $this->userEvents
                ),
                'devices' => array_merge(
                    $this->ignoredEvents,
                    $this->coordEventIds
                )
            ]
        );
    }
}
