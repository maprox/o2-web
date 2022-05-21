<?php

/**
 * Reports history mapper
 *
 * @project    Maprox Observer <http://maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Mapper_X_Report_History extends Falcon_Mapper_Common
{
    /**
     *
     * @param type $reportId
     * @param type $firmId
     * @return type
     */
    public function historyGet($reportId, $firmId)
    {
        return $this->getTable()->loadHistory($reportId, $firmId);
    }

    /**
     *
     * @param type $request
     */
    public function historyAdd($request)
    {
        $translator = Zend_Registry::get('translator');
        $t = $translator['zt'];

        $user = Falcon_Model_User::getInstance();
        $firmId = $user->getFirmId();
        $name = $user->get('login');

        $md = Falcon_Mapper_Mon_Device::getInstance();
        $mg = Falcon_Mapper_Mon_Geofence::getInstance();
        $gmd = Falcon_Mapper_X_Group_Mon_Device::getInstance();

        $params = [];
        foreach ($request->params as $key => $value) {
            $m = null;
            if ($key == 'loginid') {
                continue;
            }
            if ($key == 'mon_device') {
                $m = $md;
            }
            if ($key == 'mon_geofence') {
                $m = $mg;
            }
            if ($key == 'x_group_mon_device') {
                $m = $gmd;
            }
            if ($m) {
                foreach ($value as &$val) {
                    if ($val == -1) {
                        $val = $t->_('All');
                    } else {
                        $val = $m->getPropById($val, 'name');
                    }
                }
            }
            $params[$key] = $value;
        }
        if (isset($params['x_group_mon_device'])
            && empty($params['x_group_mon_device'])
        ) {
            unset($params['x_group_mon_device']);
        }
        if (isset($params['x_group_mon_geofence'])
            && empty($params['x_group_mon_geofence'])
        ) {
            unset($params['x_group_mon_geofence']);
        }
        unset($params['zone']);
        unset($params['device']);
        $params = base64_encode(json_encode($params));
        $values = "{$firmId}, {$request->id}, '" .
            date(DB_DATE_FORMAT) . "', '{$name}', '{$params}'";
        $this->getTable()->addHistory($values);
    }
}
