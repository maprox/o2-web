<?php

/**
 * Abstract geocoder class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class Falcon_Geocoder_Abstract
{
    protected static $secondary = [];

    /*
     * Base part of the URL
     */
    protected $_baseUrl = '';
    protected $_baseUrlReverse = '';
    protected $_timeout = 1;

    /**
     * HTTP Headers
     * @var {String[]}
     */
    protected $_headers = [
        'Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
        'Accept-Charset: windows-1251,utf-8;q=0.7,*;q=0.3'
    ];

    /*
     * Code wich disables geocoder
     */
    const GEOCODER_DOWN = 4070;

    /*
     * Get server response
     * @param String $url
     */
    protected function getServerResponse($url)
    {
        $result = "";
        try {
            $handler = curl_init();
            curl_setopt($handler, CURLOPT_URL, $url);
            curl_setopt($handler, CURLOPT_HEADER, 0);
            curl_setopt($handler, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($handler, CURLOPT_CONNECTTIMEOUT, $this->_timeout);
            curl_setopt($handler, CURLOPT_HTTPHEADER, $this->_headers);
            $result = curl_exec($handler);
            curl_close($handler);
        } catch (Exception $e) {
            // silent
        }
        return $result;
    }

    /*
     * Prepares url for reverse geocoding
     * @param {String} $lat - Latitude
     * @param {String} $lng - Longitude
     * @return {String}
     */
    protected function formatUrlReverse($lat, $lng)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /*
     * Prepares url for geocoding
     * @param {String} $address - Address
     * @return {String}
     */
    protected function formatUrl($address)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /*
     * Performs geocodings
     * @param {String} $address - Address
     * @return {Falcon_Message}
     */
    public function geocode($addr)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /*
     * Performs reverse geocoding
     * @param {String} $lat - Latitude
     * @param {String} $lng - Longitude
     * @return {Falcon_Message}
     */
    public function revGeocode($lat, $lng)
    {
        throw new Falcon_Exception('Not implemented',
            Falcon_Exception::NOT_IMPLEMENTED);
    }
}
