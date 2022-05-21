<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Waylist extends Falcon_Action_Rest_Common
{
    /**
     * Fires when sdt is updated, creates update for route
     * @param Falcon_Record_Mon_Waylist $c
     * @param Mixed $value
     * @return Boolean
     */
    public function onUpdateSdt($c, $value)
    {
        Falcon_Action_Update::addToFirm(
            ['alias' => 'mon_waylist_route_update'],
            $c->get('id_firm')
        );

        return true;
    }

    /**
     * Fires when status is updated, creates update for device
     * @param Falcon_Record_Mon_Waylist $c
     * @param Mixed $value
     * @return Boolean
     */
    public function onUpdateStatus($c, $value)
    {
        Falcon_Action_Update::addToFirm(
            ['alias' => 'mon_device'],
            $c->get('id_firm')
        );
        return true;
    }

    /**
     * Actions to perform before creating instance
     * @param Falcon_Record_Abstract $c
     * @return Boolean
     */
    protected function onBeforeCreate($c)
    {
        return parent::onBeforeCreate($c) && $this->checkConflict($c);
    }

    /**
     * Actions to perform before updating instance
     * @param Falcon_Record_Abstract $c
     * @return Boolean
     */
    protected function onBeforeUpdate($c)
    {
        return parent::onBeforeUpdate($c) && $this->checkConflict($c);
    }

    /**
     * Checks for conflict situations in waylist status/timing
     * @param Falcon_Record_Abstract $c
     * @return Boolean
     */
    protected function checkConflict($c)
    {
        $id = (int)$c->getId();
        $status = (int)$this->getParam('status', $c->get('status'));
        $idVehicle = $this->getParam('id_vehicle', $c->get('id_vehicle'));
        $sdt = $this->getParam('sdt', $c->get('sdt'));
        $edt = $this->getParam('edt', $c->get('edt'));

        // Если пытаются поставить статус "started", а такой статус уже есть у другого листа
        if ($status == Falcon_Record_Mon_Waylist::STATUS_STARTED && $idVehicle) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'status = ?' => Falcon_Record_Mon_Waylist::STATUS_STARTED,
                'id != ?' => $id
            ]);
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_DOUBLE_STARTED,
                    $exist[0]);
            }
        }

        // Если у этого листа нет edt и sdt, то нечего проверять
        if (empty($edt) && empty($sdt)) {
            return true;
        }

        // Если у этого листа нет edt, и он может пересечься с другим из-за этого
        if (empty($edt)) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'sdt > ?' => $sdt,
                'sdt is not null' => false,
                'id != ?' => $id
            ]);
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_OVERLAP_BY_UNDEFINED,
                    $exist[0]);
            }
        }
        // Если у этого листа нет sdt, и он может пересечься с другим из-за этого
        if (empty($sdt)) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'edt < ?' => $edt,
                'edt is not null' => false,
                'id != ?' => $id
            ]);
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_OVERLAP_BY_UNDEFINED,
                    $exist[0]);
            }
        }

        // Если у другого листа нет edt, и он может пересечься с нашим из-за этого
        if (!empty($sdt)) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'sdt < ?' => $sdt,
                'sdt is not null' => false,
                'edt is null' => false,
                'id != ?' => $id
            ]);
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_OVERLAP_BY_OTHER_UNDEFINED,
                    $exist[0]);
            }
        }
        // Если у другого листа нет sdt, и он может пересечься с нашим из-за этого
        if (!empty($edt)) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'edt > ?' => $edt,
                'sdt is null' => false,
                'edt is not null' => false,
                'id != ?' => $id
            ]);
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_OVERLAP_BY_OTHER_UNDEFINED,
                    $exist[0]);
            }
        }

        // Если у другого листа sdt/edt пересекаются с нашим
        if (!empty($sdt) && !empty($edt)) {
            $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                'id_vehicle = ?' => $idVehicle,
                'sdt >= ?' => $sdt,
                'sdt < ?' => $edt,
                'sdt is not null' => false,
                'id != ?' => $id
            ]);
            if (empty($exist)) {
                $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                    'id_vehicle = ?' => $idVehicle,
                    'edt > ?' => $sdt,
                    'edt <= ?' => $edt,
                    'edt is not null' => false,
                    'id != ?' => $id
                ]);
            }
            if (empty($exist)) {
                $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                    'id_vehicle = ?' => $idVehicle,
                    'sdt >= ?' => $sdt,
                    'edt <= ?' => $edt,
                    'edt is not null' => false,
                    'sdt is not null' => false,
                    'id != ?' => $id
                ]);
            }
            if (empty($exist)) {
                $exist = Falcon_Mapper_Mon_Waylist::getInstance()->load([
                    'id_vehicle = ?' => $idVehicle,
                    'sdt <= ?' => $sdt,
                    'edt >= ?' => $edt,
                    'edt is not null' => false,
                    'sdt is not null' => false,
                    'id != ?' => $id
                ]);
            }
            if (!empty($exist)) {
                return $this->setConflictError(
                    Falcon_Exception::WAYLIST_OVERLAP, $exist[0]);
            }
        }

        return true;
    }

    /**
     * Actions to perform before deleting instance
     * @param Falcon_Record_Abstract $c
     * @return Boolean
     */
    protected function onBeforeDelete($c)
    {
        return parent::onBeforeDelete($c)
        && ($c->get('status') == Falcon_Record_Mon_Waylist::STATUS_CREATED);
    }

    /**
     * Unsets params which can cause a conflict, adds error
     * @param Integer $code
     * @param Falcon_Record_Mon_Waylist $list
     * @return bool
     */
    protected function setConflictError($code, Falcon_Record_Mon_Waylist $list)
    {
        $this->getAnswer()->error($code, $list->getSerial());

        $this->unsetParam('status');
        $this->unsetParam('id_vehicle');
        $this->unsetParam('sdt');
        $this->unsetParam('edt');

        return true;
    }
}
