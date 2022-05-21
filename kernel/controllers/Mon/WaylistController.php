<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class Mon_WaylistController extends Falcon_Controller_Action_Rest
{
    /**
     * url: /mon_device/ownerinfo
     * Returns next number for given series
     * @deprecated
     */
    public function nextnumberAction()
    {
        $series = $this->getParam('series');

        // next
        $next = ['num' => 1];

        if (!$series) {
            return new Falcon_Message($next);
        }

        $user = Falcon_Model_User::getInstance();
        $firmId = $user->getFirmId();
        $m = Falcon_Mapper_Mon_Waylist::getInstance();
        $waylists = $m->loadBy(function ($sql) use ($series, $firmId) {
            $sql->where('id_firm = ?', $firmId)
                ->where('serial_num = ?', $series)
                ->order('num desc')
                ->limit(1);
        });

        if (!empty($waylists)) {
            $next['num'] = ++$waylists[0]['num'];
        }

        return new Falcon_Message($next);
    }
}