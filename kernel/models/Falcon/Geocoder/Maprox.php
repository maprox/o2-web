<?php

/**
 * Maprox (nominatim at http://geocode.maprox.net) class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Geocoder_Maprox extends Falcon_Geocoder_Openlayers
{
    /*
     * Constructor.
     * Reads urls from config.
     */
    public function __construct()
    {
        $config = Zend_Registry::getInstance()->config->geocoder;
        $this->_baseUrl = $config->maprox->url;
        $this->_baseUrlReverse = $config->maprox->urlReverse;
        $this->_timeout = $config->maprox->timeout;
    }
}