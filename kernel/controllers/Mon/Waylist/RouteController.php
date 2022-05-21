<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2014, Maprox LLC
 *
 * Rest controller
 */
class Mon_Waylist_RouteController extends Falcon_Controller_Action_Rest
{
    /**
     * url: /mon_waylist_route/route
     * Returns route information from OSRM
     */
    public function routeAction()
    {
        $params = $this->getParams();
        if (
            empty($params['fromLat'])
            || empty($params['fromLon'])
            || empty($params['toLat'])
            || empty($params['toLon'])
        ) {
            return new Falcon_Message(null, false);
        }

        $osrm = null;
        try {
            $osrm = new Falcon_Osrm(
                $params['fromLat'], $params['fromLon'],
                $params['toLat'], $params['toLon']
            );
        } catch (Exception $e) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error-route', $e);
        }

        if (!$osrm || !$osrm->isSuccess()) {
            return new Falcon_Message(null, false);
        }

        return new Falcon_Message([
            'found' => $osrm->haveRoute(),
            'coords' => $osrm->getCoords(),
            'distance' => $osrm->getDistance(),
            'time' => $osrm->getTime()
        ]);
    }
}