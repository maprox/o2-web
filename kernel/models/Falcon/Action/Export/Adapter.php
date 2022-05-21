<?php

/**
 * Abstract class which represents an adapter
 * for reading and writing to and from Falcon_Message_Track objects
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
abstract class Falcon_Action_Export_Adapter
{
    /**
     * Read input and return a Falcon_Message_Track
     * @param string $input
     * @return Falcon_Message_Track
     */
    abstract public function read($input);

    /**
     * Write out a Falcon_Message_Track in the adapter's format
     * @param Falcon_Message_Track $track
     * @return string
     */
    abstract public function write(Falcon_Message_Track $track);
}