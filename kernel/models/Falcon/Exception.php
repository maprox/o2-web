<?php

/**
 * Falcon library exception class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Exception extends Exception
{
    /**
     * Database error code
     * @var int
     */
    const SERVER_ERROR = 500;

    /**
     * Not implemented error code
     * @var int
     */
    const NOT_IMPLEMENTED = 501;

    /**
     * Object not found
     * @var int
     */
    const OBJECT_NOT_FOUND = 404;

    /**
     * Object not found
     * @var int
     */
    const NO_CONTENT = 204;

    /**
     * Object not found
     * @var int
     */
    const TEXT_ERROR = 200;

    /**
     * Something exists already, cannot create duplicate.
     * @var int
     */
    const ALREADY_EXISTS = 60;

    /**
     * Bad request
     * @var int
     */
    const BAD_REQUEST = 400;

    /**
     * User tries to do something without having proper access.
     * @var int
     */
    const ACCESS_VIOLATION = 403;

    /**
     * User have logged out.
     * @var int
     */
    const UNATHORIZED = 401;

    /**
     * Session is expired
     * @var int
     */
    const SESSION_IS_EXPIRED = 4010;

    /**
     * Multiple authorization (from other host/browser)
     * @var int
     */
    const MULTIPLE_AUTHORIZATION = 4011;

    /**
     * Schedule limit
     * @var int
     */
    const SCHEDULE_LIMIT = 4012;

    /**
     * Two started waylists for single vehicle
     * @var int
     */
    const WAYLIST_DOUBLE_STARTED = 4110;

    /**
     * Overlapping waylists by sdt/edt
     * @var int
     */
    const WAYLIST_OVERLAP = 4111;

    /**
     * Potential overlap by not defined edt/sdt of previous waylist
     * @var int
     */
    const WAYLIST_OVERLAP_BY_OTHER_UNDEFINED = 4112;

    /**
     * Potential overlap by not defined edt/sdt of previous waylist
     * @var int
     */
    const WAYLIST_OVERLAP_BY_UNDEFINED = 4113;

    /**
     * No Javascript code on client side
     * @var int
     */
    const NO_JAVASCRIPT = 80;

    /**
     * Exception params
     * @var array
     */
    protected $params;

    /**
     * Constructor
     * @param string $message Exception message
     * @param int $code Exception code
     * @param array $params Exception params
     */
    public function __construct($message,
                                $code = self::SERVER_ERROR,
                                $params = [])
    {
        parent::__construct($message, $code);
        $this->params = $params;
    }

    /**
     * Returns an array of exception params
     * @return string
     */
    public function getParams()
    {
        return $this->params;
    }
}
