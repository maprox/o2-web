<?php

/**
 * Abstract class of table record trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Record_Trigger_Abstract
{
    protected $params = [];

    /**
     * @construct
     * @param mixed $params Any trigger parameters
     */
    public function __construct($params = null)
    {
        $this->params = $params;
    }

    /**
     * Returns true if method by name $method is excluded
     * from trigger handling
     * @param string $method
     */
    protected function notExcluded($method)
    {
        if ($this->params && isset($this->params['exclude'])) {
            return !in_array($method, $this->params['exclude']);
        }
        return true;
    }

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    public function onBeforeInsert($record)
    {
        if ($this->notExcluded('onBeforeInsert')) {
            return $this->doBeforeInsert($record);
        }
    }

    public function onBeforeUpdate($record)
    {
        if ($this->notExcluded('onBeforeUpdate')) {
            return $this->doBeforeUpdate($record);
        }
    }

    public function onBeforeDelete($record)
    {
        if ($this->notExcluded('onBeforeDelete')) {
            return $this->doBeforeDelete($record);
        }
    }

    public function onBeforeTrash($record)
    {
        if ($this->notExcluded('onBeforeTrash')) {
            return $this->doBeforeTrash($record);
        }
    }

    // ---------------------------------------
    public function onAfterInsert($record)
    {
        if ($this->notExcluded('onAfterInsert')) {
            return $this->doAfterInsert($record);
        }
    }

    public function onAfterUpdate($record)
    {
        if ($this->notExcluded('onAfterUpdate')) {
            return $this->doAfterUpdate($record);
        }
    }

    public function onAfterDelete($record)
    {
        if ($this->notExcluded('onAfterDelete')) {
            return $this->doAfterDelete($record);
        }
    }

    public function onAfterTrash($record)
    {
        if ($this->notExcluded('onAfterTrash')) {
            return $this->doAfterTrash($record);
        }
    }

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doBeforeInsert($record)
    {
    }

    protected function doBeforeUpdate($record)
    {
    }

    protected function doBeforeDelete($record)
    {
    }

    protected function doBeforeTrash($record)
    {
    }

    // ---------------------------------------
    protected function doAfterInsert($record)
    {
    }

    protected function doAfterUpdate($record)
    {
    }

    protected function doAfterDelete($record)
    {
    }

    protected function doAfterTrash($record)
    {
    }

}