<?php

/**
 * Warehouse list controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Dn_Warehouse_ListController extends Falcon_Controller_Action
{
    /**
     * Returns a list of all accessible warehouses
     */
    public function get()
    {
        $m = new Falcon_Model_Manager();
        return $m->loadDnWarehouseList($this->getUserFirmId());
    }
}
