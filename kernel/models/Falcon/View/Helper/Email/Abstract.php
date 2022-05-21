<?php

/**
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_View_Helper_Email_Abstract extends Zend_View_Helper_Abstract
{
    /**
     * Save the view link
     * @param Zend_View_Interface $view
     */
    public function setView(Zend_View_Interface $view)
    {
        $this->view = $view;
    }

    /**
     * Not-found method handler
     * @param string $name
     * @param array $params
     * @return mixed
     */
    function __call($name, $params)
    {
        $format = $this->view->format;
        // check if such method exists
        if (!method_exists($this, $format)) {
            return null;
        }
        return call_user_func_array([$this, $format], $params);
    }

    /**
     * Translates given $text
     * @param string $text Text to translate
     * @return string
     */
    public function _($text)
    {
        $t = Zend_Registry::get('translator');
        return $t['zt']->_($text, $this->view->locale);
    }
}