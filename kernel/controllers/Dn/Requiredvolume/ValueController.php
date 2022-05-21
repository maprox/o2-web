<?php

/**
 * Dn Requiredvolume Value controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Dn_Requiredvolume_ValueController extends Falcon_Controller_Action
{
    /**
     * Получение списка значений коммерческих предложений
     */
    public function get()
    {
        $m = new Falcon_Model_Manager();
        return $m->loadDnRequiredvolumeValue();
    }
}