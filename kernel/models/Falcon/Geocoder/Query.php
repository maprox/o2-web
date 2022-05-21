<?php

/**
 * Geocoder query class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2013, Maprox LLC
 */
class Falcon_Geocoder_Query
{
    protected $query = [];

    const ERROR_RESPONSE_CODE = 4048; // Client error code
    const TIME_DISABLED = 1800; // Period of geocoder disabling

    public function __construct()
    {
        $registry = Zend_Registry::getInstance();
        $this->query = $registry->config->geocoder->query->toArray();
    }

    public function execute($function, $data)
    {
        $answer = new Falcon_Message(null, false);
        while ($geocoderAlias = array_shift($this->query)) {
            $isGeocoderDisabled = Falcon_Cacher::getInstance()
                ->get('geocoder', $geocoderAlias . '_disabled');

            if (!empty($isGeocoderDisabled)) {
                continue;
            }

            $class = 'Falcon_Geocoder_' . $geocoderAlias;
            $class = new $class();
            if (!($class instanceOf Falcon_Geocoder_Abstract)) {
                continue;
            }

            try {
                $answer = call_user_func_array(
                    [$class, $function], $data);
            } catch (Exception $E) {
                // silent exception
                $answer = new Falcon_Message();
                $answer->setSuccess(false);
            }

            if ($answer->isSuccess()) {
                break;
            }

            // processing geocoding error
            $error = $answer->getLastError();
            if ($error && $error['code'] ==
                Falcon_Geocoder_Abstract::GEOCODER_DOWN
            ) {
                $logger = Falcon_Logger::getInstance();
                $logger->log('geocoder', 'ERROR',
                    'Geocoder is disabled: ' . $geocoderAlias);
                Falcon_Cacher::getInstance()->set(true, 'geocoder',
                    $geocoderAlias . '_disabled', self::TIME_DISABLED);
            }
        }

        // Reset errors so users would not see internal errors
        if ($answer->isFailure()) {
            $answer->reset()->error(self::ERROR_RESPONSE_CODE);
        }

        return $answer;
    }
}
