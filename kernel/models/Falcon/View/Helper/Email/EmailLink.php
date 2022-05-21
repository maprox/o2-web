<?php

/**
 * Link helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_emailLink
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * example:
     *    $this->emailLink('%sthis is local host%s', 'http://localhost')
     * transforms to
     *    <a href="http://localhost">this is localhost</a>
     * @param string $text
     * @param string $link
     * @param string $style
     * @return string
     */
    public function html($text = '', $link = '', $style = '')
    {
        return sprintf($this->_($text), '<a href="' . $link . '"' .
            ($style != '' ? ' style="' . $style . '"' : '') . '>', '</a>');
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @param string $link
     * @param string $style
     * @return string
     */
    public function text($text = '', $link = '', $style = '')
    {
        return sprintf($this->_($text), '', ' <' . $link . '>');
    }
}
