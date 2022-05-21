<?php

/**
 * Openlayers (nominatim - http://nominatim.openstreetmap.org) class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Geocoder_Openlayers extends Falcon_Geocoder_Abstract
{
    /*
     * Constructor.
     * Reads urls from config.
     */
    public function __construct()
    {
        $registry = Zend_Registry::getInstance();
        $config = $registry->config->geocoder;
        $this->_baseUrl = $config->openlayers->url;
        $this->_baseUrlReverse = $config->openlayers->urlReverse;
        $this->_timeout = $config->openlayers->timeout;
    }

    /*
     * Подготавливаем URL для обратного геокодинга
     * @param {String} $lat - Широта
     * @param {String} $lng - Долгота
     * @return {String}
     */
    protected function formatUrlReverse($lat, $lng)
    {
        return $this->_baseUrlReverse . '&lat=' . $lat . '&lon=' . $lng;
    }

    /*
     * Подготавливаем URL для прямого геокодинга
     * @param {String} $address - Строка адреса
     * @return {String}
     */
    protected function formatUrl($address)
    {
        return $this->_baseUrl . '&q=' . urlencode($address);
    }

    /*
     * Осуществление функции обратного геокодинга
     * @param {String} $lat - Широта
     * @param {String} $lng - Долгота
     * @return {Falcon_Message}
     */
    public function revGeocode($lat, $lng)
    {
        $answer = new Falcon_Message();
        $url = $this->formatUrlReverse($lat, $lng);
        $response = $this->getServerResponse($url);
        if (!$response) {
            // request to the geocoder service has failed
            return $answer->setSuccess(false);
        }
        $params = Zend_Json::decode($response);
        $answer->setSuccess(true);

        $buildAddress = true;
        $addressString = '';
        if (isset($params['address'])) {

            $address = $params['address'];

            if (isset($address['state'])) {
                if (empty($address['city'])) {
                    $addressString .= (!empty($addressString) ? ', ' : '') .
                        $address['state'];
                }

                if (!isset($address['road'])) {
                    if (isset($address['county'])) {
                        $addressString .= (!empty($addressString) ? ', ' : '') .
                            $address['county'];
                    }
                }

                // get city part
                $parts = ['city', 'town', 'suburb', 'village', 'hamlet'];
                foreach ($parts as $part) {
                    if (isset($address[$part])) {
                        $addressString .= (!empty($addressString) ? ', ' : '') .
                            $address[$part];
                        break;
                    }
                }

                if (isset($address['road'])) {
                    $addressString .= (!empty($addressString) ? ', ' : '') .
                        $address['road'];
                    if (isset($address['house_number'])) {
                        $addressString .= (!empty($addressString) ? ', ' : '') .
                            $address['house_number'];
                    }
                }
            } else {
                $buildAddress = false;
            }

        } else {
            $buildAddress = false;
        }

        if ($buildAddress == false) {
            if (isset($params['display_name'])) {
                $compiledAddress = $params['display_name'];
            } else {
                $compiledAddress = '';
                $answer->setSuccess(false);
            }
        } else {
            $compiledAddress = $addressString;
        }

        // fix compiled address, delete all english parts
        $compiledAddress = preg_replace(
            '/[a-zA-Z- ]+,/i', '', $compiledAddress);

        $answer->addParam('address', $compiledAddress);
        return $answer;
    }

    /*
     * Осуществление функции прямого геокодинга
     * @param {String} $address - Строка адреса
     * @return {Falcon_Message}
     */
    public function geocode($address)
    {
        $answer = new Falcon_Message();
        $url = $this->formatUrl($address);
        $response = $this->getServerResponse($url);
        if ($response == '' || $response == '[]') { //запрос к серверу завершился неудачно
            $answer->setSuccess(false);
            return $answer;
        }
        $answer->setSuccess(true);
        if (!is_bool($response)) {
            $params = Zend_Json::decode($response);
            $answer->addParam('latitude', $params[0]['lat']);
            $answer->addParam('longitude', $params[0]['lon']);
        } else {
            $answer->addParam('latitude', null);
            $answer->addParam('longitude', null);
            $answer->setSuccess(false);
        }
        return $answer;
    }
}