<?php

/**
 * Greeting helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_EmailGreeting
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @param string $text
     * @return string
     */
    public function html($text = '')
    {
        if (!$text) {
            return '<p>' . $this->_('Hello') . '.</p>';
        }
        return '<p>' . $this->_('Hello') . ', ' . $text . '.</p>';
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @return string
     */
    public function text($text = '')
    {
        if (!$text) {
            return $this->_('Hello') . ".\n";
        }
        return $this->_('Hello') . ', ' . $text . ".\n";
    }
}
