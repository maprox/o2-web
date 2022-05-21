<?php

/**
 * @project    Maprox <http://maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Rest_Helper_Access
    extends Falcon_Action_Rest_Helper_Abstract
{
    /**
     * Entity to work with
     * @var {Falcon_Record_Abstract}
     */
    protected $record = false;

    /**
     * Allow shared access
     * @var Boolean
     */
    protected $shared = true;

    /**
     * @param Falcon_Record_Abstract $record
     */
    public function setRecord($record)
    {
        $this->record = $record;
    }

    /**
     * @return Falcon_Record_Abstract
     */
    public function getRecord()
    {
        return $this->record;
    }

    /**
     * @param  $shared
     */
    public function setShared($shared)
    {
        $this->shared = $shared;
    }

    /**
     * @return Boolean
     */
    public function getShared()
    {
        return $this->shared;
    }

    // Proxy function for access checking

    public function isShared()
    {
        return Falcon_Access::isShared($this->getName(), $this->getRecord());
    }

    public function checkGrant()
    {
        return Falcon_Access::checkGrant($this->getName());
    }

    public function checkReadList()
    {
        Falcon_Access::checkRead($this->getName());
    }

    public function checkRead()
    {
        Falcon_Access::checkRead($this->getName(), $this->getId(),
            false, $this->getShared());
    }

    public function checkWrite()
    {
        Falcon_Access::checkWrite($this->getName(), $this->getId());
    }

    public function checkGlobalWrite()
    {
        return Falcon_Access::checkGlobalWrite($this->getName());
    }

    public function checkCreate()
    {
        return Falcon_Access::checkCreate($this->getName());
    }
}