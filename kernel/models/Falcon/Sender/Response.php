<?php

/**
 * Sender response object
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Sender_Response
{
    const REJECTED = -2;
    const DELIVERY_ERROR = -1;
    const ACCEPTED = 0;
    const QUEUED = 1;
    const DELIVERED = 2;

    private $_status;
    private $_errorCode;
    private $_errorMessage;

    /**
     * Constructor
     * @param {int} $status Response status
     * @param {int} $errorCode Error code
     * @param {String} $errorMessage Error message
     */
    public function __construct(
        $status = Falcon_Sender_Response::DELIVERED,
        $errorCode = 0,
        $errorMessage = '')
    {
        $this->_status = $status;
        $this->_errorCode = $errorCode;
        $this->_errorMessage = $errorMessage;
    }

    /**
     * Return response status
     * @return int
     */
    public function getStatus()
    {
        return $this->_status;
    }

    /**
     * Return true if message is delivered
     * @return {Boolean}
     */
    public function isDelivered()
    {
        return ($this->_status == Falcon_Sender_Response::DELIVERED);
    }

    /**
     * Return true when sending data fails
     * @return {Boolean}
     */
    public function isFailure()
    {
        $status = $this->getStatus();
        return ($status == Falcon_Sender_Response::REJECTED ||
            $status == Falcon_Sender_Response::DELIVERY_ERROR);
    }

    /**
     * Return response error code
     * @return int
     */
    public function getErrorCode()
    {
        return $this->_errorCode;
    }

    /**
     * Return error message
     * @return int
     */
    public function getErrorMessage()
    {
        return $this->_errorMessage;
    }
}