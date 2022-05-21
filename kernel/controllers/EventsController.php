<?php

/**
 * Класс работы с событиями в режиме AJAX
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class EventsController extends Falcon_Controller_Action
{
    /**
     * index
     * Загрузка событий за период period
     */
    public function indexAction()
    {
        $params = $this->_getAllParams();
        if (!isset($params['objId'])) {
            $this->sendAnswer($this->getPeriod($params));
        } else // Для конкретного устройства
        {
            $this->sendAnswer($this->getPeriod($params, $params['objId']));
        }
    }

    /**
     * Получение списка событий за период
     * @param {Object} $period Период возникновения события
     */
    public function getPeriod($params, $device = null)
    {
        if (!isset($params['begin']) ||
            !isset($params['end'])
        ) {
            return new Falcon_Message();
        }
        if (isset($params['sort'])) {
            $params['sort'] = current(json_decode($params['sort']));
        } else {
            $params['sort'] = new stdClass();
            $params['sort']->property = 'dt';
            $params['sort']->direction = 'DESC';
        }

        if (!isset($params['page']))
            $params['page'] = 1;

        if ($params['page'] < 1)
            $params['page'] = 1;

        if (!isset($params['limit']))
            $params['limit'] = 25;

        if ($params['sort']->property == 'eventtext') {
            $params['sort']->property = 'val';
        }

        if ($params['sort']->property != 'val' &&
            $params['sort']->property != 'dt'
        ) {
            return new Falcon_Message();
        }

        if ($params['sort']->direction != 'ASC' &&
            $params['sort']->direction != 'DESC'
        ) {
            return new Falcon_Message();
        }

        // берем пользователя из БД
        $user = Falcon_Model_User::getInstance();

        $params['begin'] = $user->correctDate($params['begin'], true);
        $params['end'] = $user->correctDate($params['end'], true);

        if ($device == null) {
            $ids = [];
            //$ids = array($user->getId());
            $ids['users'] = [$user->getId()];
            $devices = Falcon_Mapper_Mon_Device::getInstance()
                ->loadByAccess(['fields' => ['id']]);
            $ids['devices'] = [];
            foreach ($devices as $device) {
                $ids['devices'][] = $device['id'];
                //$ids[] = $device['id'];
            }

            $events = $user->getEvents($params, $ids);
            $count = $user->getEventsCount($params, $ids);
        } else {
            $events = $user->getDeviceEvents($params);
            $count = $user->getDeviceEventsCount($params);
        }

        $count = $count->getParam('data');

        return $events->addParam('count', $count);
    }

}
