<?php

/**
 * Special symbol helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_EmailSpecialSymbol
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @param string $text
     * @return string
     */
    public function html($text = '')
    {
        return '&' . $text . ';';
    }

    /**
     * TEXT (default) version
     * @param string $text
     * @return string
     */
    public function text($text = '')
    {
        switch ($text) {
            case 'copy':
                return '(c)';
            case 'ndash':
                return '-';
        }
        return $text;
    }
}
