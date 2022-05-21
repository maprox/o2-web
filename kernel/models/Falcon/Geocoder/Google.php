<?php

/**
 * Google geocoder class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Geocoder_Google extends Falcon_Geocoder_Abstract
{
    /*
     * Contructor of geocoder
     * Reads configuration
     */
    public function __construct()
    {
        $registry = Zend_Registry::getInstance();
        $this->_baseUrl = $registry->config->geocoder->google->url;
        $this->_baseUrlReverse = $this->_baseUrl;
        $this->_timeout = $registry->config->geocoder->google->timeout;
    }

    /*
     * Prepares url for reverse geocoding
     * @param {String} $lat - Latitude
     * @param {String} $lng - Longitude
     * @return {String}
     */
    protected function formatUrlReverse($lat, $lng)
    {
        return $this->_baseUrlReverse . '&latlng=' . $lat . ',' . $lng;
    }

    /*
     * Prepares url for geocoding
     * @param {String} $address - Address
     * @return {String}
     */
    protected function formatUrl($address)
    {
        return $this->_baseUrl . '&address=' . urlencode($address);
    }

    /*
     * Performs geocodings
     * @param {String} $address - Address
     * @return {Falcon_Message}
     */
    public function geocode($address)
    {
        $answer = new Falcon_Message();
        $answer->setSuccess(true);

        $url = $this->formatUrl($address);
        $response = $this->getServerResponse($url);

        if ($response == "") { // request to the server has failed
            $answer->setSuccess(false);
            return $answer;
        }

        $params = Zend_Json::decode($response);
        $results = [];
        if (isset($params['results'])) {
            $results = $params['results'];
        }
        if ($params['status'] == "OK" && !empty($results)) {
            $answer->setSuccess(true);
            $answer->addParam('address', $results[0]['formatted_address']);
            $location = $results[0]['geometry']['location'];
            $answer->addParam('latitude', $location['lat']);
            $answer->addParam('longitude', $location['lng']);
        } else {
            $answer->addParam('address', '');
            $answer->setSuccess(false);
            if ($params['status'] == "OVER_QUERY_LIMIT") {
                $answer->error(self::GEOCODER_DOWN);
            }
            // write error info to the log file
            $logger = Falcon_Logger::getInstance();
            $logger->log('geocoder', 'ERROR', $params);
        }
        return $answer;
    }

    /*
     * Performs reverse geocoding
     * @param {String} $lat - Latitude
     * @param {String} $lng - Longitude
     * @return {Falcon_Message}
     */
    public function revGeocode($lat, $lng)
    {
        $answer = new Falcon_Message();
        $answer->setSuccess(true);

        $url = $this->formatUrlReverse($lat, $lng);
        $response = $this->getServerResponse($url);

        if ($response == "") { // request to the server has failed
            $answer->setSuccess(false);
            return $answer;
        }
        $params = Zend_Json::decode($response);
        $results = [];
        if (isset($params['results'])) {
            $results = $params['results'];
        }
        if ($params['status'] == "OK" && !empty($results)) {
            $answer->setSuccess(true);
            $answer->addParam('address', $results[0]['formatted_address']);
            $location = $results[0]['geometry']['location'];
            $answer->addParam('latitude', $location['lat']);
            $answer->addParam('longitude', $location['lng']);
        } else {
            $answer->addParam('address', '');
            $answer->setSuccess(false);
            if ($params['status'] == "OVER_QUERY_LIMIT") {
                $answer->error(self::GEOCODER_DOWN);
            }
            // write error info to the log file
            $logger = Falcon_Logger::getInstance();
            $logger->log('geocoder', 'ERROR', $params);
        }
        return $answer;
    }
}
