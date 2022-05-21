<?php

/**
 * Inline text helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_emailParagraph
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @param string $text
     * @return string
     */
    public function html($text = '')
    {
        return '<p>' . $text . '</p>';
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @return string
     */
    public function text($text = '')
    {
        return "\n" . $text . "\n";
    }
}
