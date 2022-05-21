<?php

/**
 * Simple Request. Extended to be able to emulate POST
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Request_Simple extends Zend_Controller_Request_Simple
{
    /**
     * Emulated POST data
     * @var array
     */
    protected $postData = [];

    /**
     * Sets POST variable
     * @param mixed[] $data
     */
    public function setPost($data)
    {
        $this->postData = $data;
    }

    /**
     * Retrieve a member of the POST
     * If no $key is passed, returns the entire POST array.
     *
     * @param string $key
     * @param mixed $default Default value to use if key not found
     * @return mixed Returns null if key does not exist
     */
    public function getPost($key = null, $default = null)
    {
        if ($key === null) {
            return $this->postData;
        }

        return (isset($this->postData[$key])) ?
            $this->postData[$key] : $default;
    }

    /**
     * Was the request made by POST?
     * @return boolean
     */
    public function isPost()
    {
        return !empty($this->postData);
    }
}
