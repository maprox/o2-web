<?php

/**
 * FontStyle text helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_emailFontStyle
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @param string $text
     * @return string
     */
    public function html($text = '', array $style = [])
    {
        $result = $text;
        if (in_array('bold', $style)) {
            $result = '<b>' . $result . '</b>';
        }
        if (in_array('italic', $style)) {
            $result = '<i>' . $result . '</i>';
        }
        return $result;
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @return string
     */
    public function text($text = '', array $style = [])
    {
        return $text;
    }
}