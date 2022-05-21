<?php

/**
 * Реализация клиента для запроса отчетов с какого-либо сервера
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Reports_Loader extends Falcon_Reports_JasperClient
{
    /**
     * Конструктор
     */
    public function __construct()
    {
        $config = Zend_Registry::get('config');
        parent::__construct($config->jasper->toArray());
    }

    /**
     * Запрос отчета с JasperServer'а
     * @param {String} $request Входные данные:
     *   $request->report Полный путь к отчету
     *   $request->output Формат экспорта
     *   $request->params Массив входных параметров для отчета
     * @return {String} Тело отчета
     */
    public function requestReport($request)
    {
        // преобразуем $params в массив
        // и добавляем идентификатор пользователя к параметрам отчета
        $user = Falcon_Model_User::getInstance();
        if (!isset($request->params)) $request->params = [];
        $request->params = (array)$request->params;
        $request->params['loginid'] = $user->getId();

        $settings = $user->getSettings();
        $request->params['loginutcval'] = $settings['p.utc_value'];

        // Create devices array
        $devices = [];
        if (isset($request->params['mon_device'])) {
            $devices = $request->params['mon_device'];
        }
        if (isset($request->params['x_group_mon_device'])) {
            // All
            if (in_array(-1, $request->params['x_group_mon_device'])) {
                $a = new Falcon_Action_Mon_Device();
                $records = $a->doGetList(false);
                $devices = [];
                foreach ($records->getData() as $device) {
                    $devices[] = $device['id'];
                }
            } else {
                foreach ($request->params['x_group_mon_device'] as $groupId) {
                    $a = new Falcon_Action_X_Group_Mon_Device(
                        ['id' => $groupId]
                    );
                    $group = $a->doGetItem(false);
                    $group = $group->getData();
                    $devices = array_merge($devices, $group['items']);
                }
            }
        }

        $devices = array_unique($devices);
        if (!empty($devices)) {
            $request->params['device'] = $devices;
        }

        // Create zones array
        $zones = [];
        if (isset($request->params['mon_geofence'])) {
            $zones = $request->params['mon_geofence'];
        }
        if (isset($request->params['x_group_mon_geofence'])) {
            if (in_array(-1, $request->params['x_group_mon_geofence'])) {
                $a = new Falcon_Action_Mon_Geofence();
                $records = $a->doGetList(false);
                $zones = [];
                foreach ($records->getData() as $zone) {
                    $zones[] = $zone['id'];
                }
            }
        }

        $zones = array_unique($zones);
        if (!empty($zones)) {
            $request->params['zone'] = $zones;
        }

        $report = Falcon_Reports_Factory::get($request);
        $report->onBeforeRequest();
        return parent::requestReport($request);
    }
}