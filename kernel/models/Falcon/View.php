<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 *
 * Base View
 */
class Falcon_View extends Zend_View
{
    /**
     * Constructor
     *
     * Register Zend_View_Stream stream wrapper if short tags are disabled.
     *
     * @param  array $config
     * @return void
     */
    public function __construct($config = [])
    {
        parent::__construct($config);

        // config settings
        $config = Zend_Registry::get('config');
        $this->config = $config;

        // language settings
        $t = Zend_Registry::get('translator');
        $this->locale = $t['locale'];
        $this->lang = $t['lang'];
        $this->zt = $t['zt'];

        $httpHost = '';
        // For cli mode get http_host from config
        if (isset($_SERVER['HTTP_HOST'])) {
            $httpHost = $_SERVER['HTTP_HOST'];
        } else {
            if (isset($config->common->http_host)) {
                $httpHost = $config->common->http_host;
            }
        }
        // host data
        $this->hostLink = getProtocol() . '://' . $httpHost;
    }
}
