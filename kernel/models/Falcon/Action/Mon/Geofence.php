<?php

/**
 * Geofence rest action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Geofence extends Falcon_Action_Rest_Common
{
    /**
     * Applies coordinates to the specified geofence
     * @param Falcon_Record_Mon_Geofence $c
     */
    private function setCoordinates($c)
    {
        $coordinates = $this->getParam('coords');
        if ($coordinates && is_array($coordinates)) {
            if (count($coordinates) < 3) {
                throw new Falcon_Exception(
                    'Please, specify at least 3 coordinates!',
                    Falcon_Exception::BAD_REQUEST);
            }
            $m = $this->getEntityMapper();
            $m->setCoordinates($c->getId(), $coordinates);
        }
    }

    /**
     * Prepare input parameters
     * @param array $params
     */
    public function prepareInputParams($methodParams)
    {
        parent::prepareInputParams($methodParams);
        // conversion array
        $coordinates = $this->getParam('coords');
        if (is_string($coordinates)) {
            $coords = json_decode($coordinates);
            if (empty($coords)) {
                $this->unsetParam('center_lat');
                $this->unsetParam('center_lon');
            }
            $this->setParam('coords', $coords);
        }
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceCreate($c)
    {
        $this->setAddress($c);
        $data = parent::instanceCreate($c);
        $this->setCoordinates($c);
        $m = $this->getEntityMapper();
        $data['coords'] = $m->loadCoordinates($c->getId());
        return $data;
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        $this->setAddress($c);
        $data = parent::instanceUpdate($c);
        $this->setCoordinates($c);

        return $data;
    }

    /**
     * Address geocode getter
     * @param type $c
     */
    public function setAddress($c)
    {
        $centerLat = round((float)$this->getParam('center_lat'), 6);
        $centerLon = round((float)$this->getParam('center_lon'), 6);
        if ($centerLat &&
            $centerLon &&
            (float)$c->get('center_lat') != $centerLat &&
            (float)$c->get('center_lon') != $centerLon
        ) {
            $geocoder = new Falcon_Geocoder_Query();
            $g_answer = $geocoder->execute('revGeocode',
                [$centerLat, $centerLon]);
            if ($g_answer->isSuccess()) {
                $c->set('address', $g_answer->getParam('address'));
            }
        }
    }
}
