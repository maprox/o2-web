<?php

/**
 * @project    Maprox <http://maprox.net>
 * @copyright  2012, Maprox LLC
 */
abstract class Falcon_Action_Rest_Helper_Abstract
{
    /**
     * Entity name to work with
     * @var {string}
     */
    protected $name = false;
    /**
     * Entity id to work with
     * @var {string}
     */
    protected $id = false;

    /**
     * Constructs
     * @param {string} $name
     * @param {integer} $id
     */
    public function __construct($name = false, $id = false)
    {
        $this->setName($name);
        $this->setId($id);
    }

    /**
     * @param {string} $name
     */
    public function setName($name)
    {
        $this->name = strtolower($name);
    }

    /**
     * @return {string}
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param {integer} $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return {integer}
     */
    public function getId()
    {
        return $this->id;
    }
}