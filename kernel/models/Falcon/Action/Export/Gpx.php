<?php

/**
 * Adapter for exporting into GPX format
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Export_Gpx extends Falcon_Action_Export_Abstract
{
    /**
     * Read input and return a Falcon_Message_Track
     * @param string $input
     * @return Falcon_Message_Track
     */
    public function read($input)
    {
        throw new Falcon_Exception('read is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }

    /**
     * Write out a Falcon_Message_Track in the adapter's format
     * @param Falcon_Message_Track $track
     * @return string
     */
    public function write(Falcon_Message_Track $track)
    {
        throw new Falcon_Exception('write is not implemented!',
            Falcon_Exception::NOT_IMPLEMENTED);
    }
}