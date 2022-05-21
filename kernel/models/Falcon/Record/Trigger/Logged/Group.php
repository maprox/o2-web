<?php

/**
 * Logged record trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Logged_Group extends Falcon_Record_Trigger_Logged
{
    /**
     * Insert data into [updates] table
     */
    public function writeUpdateTable($record)
    {
        return;
    }
}