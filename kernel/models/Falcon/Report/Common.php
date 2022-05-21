<?php

/**
 * Common report class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Report_Common extends Falcon_Report_Abstract
{
    /**
     * Report request data
     * @var Array
     */
    protected $request;

    /**
     * Construct
     * @param type $request
     */
    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * On before request
     */
    public function onBeforeRequest()
    {
    }
}