<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Rest controller
 */
class Mon_Sim_CardController extends Falcon_Controller_Action_Rest
{
    /**
     * url: /mon_sim_card/configure
     * Creates task of device configuration
     */
    public function configureAction()
    {
        $logger = Falcon_Logger::getInstance();
        $user = Falcon_Model_User::getInstance();
        $answer = new Falcon_Message();

        // Check if user has mon_sim_card right
        if (!$user->hasRight('mon_sim_card')) {
            return $answer->error(403);
        }

        $data = $this->getJsonData();

        if (!isset($data->identifier)) {
            $answer = new Falcon_Message();
            return $answer->error(400, "Please, specify identifier");
        }

        return Falcon_Action_Device_Configure::startSim((array)$data);
    }
}