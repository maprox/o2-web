<?php

/**
 * Table "mon_geofence" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Geofence extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
        'address',
        'id_type',
        'id_mode',
        'color',
        'style',
        'center_lat',
        'center_lon',
        'max_lat',
        'max_lon',
        'min_lat',
        'min_lon',
        'coords_cache',
        'note',
        'is_garage',
        'state'
    ];

    /**
     * Table fields that should not leave Back-end.
     * When toArray is called, they are removed
     * @var String[]
     */
    public static $privateFields = [
        'coords_cache',
        'max_lat',
        'max_lon',
        'min_lat',
        'min_lon',
        'style'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled', 'grouped'];

    /**
     * Updates _lat/_lon parameters
     */
    public function updateBounds()
    {
        $coords = $this->getMapper()->loadCoordinates($this->getId());
        if (empty($coords)) {
            return;
        }

        $first = array_shift($coords);
        $maxLat = $minLat = $first['latitude'];
        $maxLon = $minLon = $first['longitude'];

        foreach ($coords as $coord) {
            $maxLat = max($maxLat, $coord['latitude']);
            $maxLon = max($maxLon, $coord['longitude']);
            $minLat = min($minLat, $coord['latitude']);
            $minLon = min($minLon, $coord['longitude']);
        }

        $this->set('max_lat', $maxLat);
        $this->set('max_lon', $maxLon);
        $this->set('min_lat', $minLat);
        $this->set('min_lon', $minLon);
        $this->update();
    }

    /**
     * Check if geofence has specified point
     * @param float $latitude
     * @param float $longitude
     * @return {Boolean}
     */
    public function hasPoint($latitude, $longitude)
    {
        $result = $this->getMapper()
            ->hasPoint($this->getId(), $latitude, $longitude);
        return !empty($result);
    }
}
