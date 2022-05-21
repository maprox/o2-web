<?php

/**
 * Message action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
abstract class Falcon_Notification_Action_Abstract
{
    /**
     * Action array
     * @var type
     */
    protected $action = null;

    /**
     * Set action
     * @param type $action
     */
    public function setAction($action)
    {
        $this->action = $action;
    }

    /**
     * Get action
     * @return type
     */
    public function getAction()
    {
        return $this->action;
    }
}