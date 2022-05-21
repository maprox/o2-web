<?php

/**
 * Inline text helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_emailInline
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @param string $text
     * @return string
     */
    public function html($text = '')
    {
        return '<div style="padding:0.6em;background:#eee;' .
        'font-style:italic;font-size:90%">' . $text . '</div>';
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @return string
     */
    public function text($text = '')
    {
        return "\n[" . $text . "]\n";
    }
}
