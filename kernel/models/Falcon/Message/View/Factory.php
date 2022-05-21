<?php

/**
 * Logger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Message_View_Factory extends Falcon_Singleton
{
    /**
     * The list of message exporters
     * @var type
     */
    private $views = [];

    /**
     * Register available views
     */
    protected function __construct()
    {
        $this->register(Falcon_Message_View_Json::getInstance());
        //$this->register(Falcon_Message_View_Xml::getInstance());
        $this->register(Falcon_Message_View_Gpx::getInstance());
        $this->register(Falcon_Message_View_Gpx10::getInstance());
        $this->register(Falcon_Message_View_Gpx11::getInstance());
        $this->register(Falcon_Message_View_Kml::getInstance());
    }

    /**
     *
     * @param Falcon_Message_View_Abstract $view
     */
    public function register(Falcon_Message_View_Abstract $view)
    {
        $this->views[strtolower($view->getFormat())] = $view;
    }

    /**
     * Sends message to the frontend
     * @param Falcon_Message $message
     * @param string $format
     */
    public function sendMessage(Falcon_Message $message, $format)
    {
        $view = Falcon_Message_View_Json::getInstance();
        if (isset($this->views[strtolower($format)])) {
            $view = $this->views[strtolower($format)];
        }
        echo $view->sendMessage($message);
    }
}