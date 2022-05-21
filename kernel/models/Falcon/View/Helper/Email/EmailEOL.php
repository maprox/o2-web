<?php

/**
 * End of line helper
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_View_Helper_Email_EmailEOL
    extends Falcon_View_Helper_Email_Abstract
{
    /**
     * HTML version
     * @return string
     */
    public function html()
    {
        return '<br/>';
    }

    /**
     * TEXT (default) version
     * @return string
     */
    public function text()
    {
        return "\n";
    }
}
