<?php

/**
 * Abstract notification
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
abstract class Falcon_Notification_Abstract
{
    /**
     * Work instance
     * @type {Falcon_Model_Work}
     */
    private $_work;

    /**
     * Constructor
     * @param {Falcon_Model_Work} $work Work instance
     */
    public function __construct($work = null)
    {
        $this->_work = $work;
    }

    /**
     * Returns action work instance
     * @return {Falcon_Record_N_Work}
     */
    public function getWork()
    {
        return $this->_work;
    }

    /**
     * Executes an action
     * @return Falcon_Message
     */
    public function execute()
    {
        return new Falcon_Message();
    }
}
