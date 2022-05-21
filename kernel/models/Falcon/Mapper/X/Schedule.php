<?php

/**
 * Class of schedule mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Schedule extends Falcon_Mapper_Common
{
    /**
     * Returns true if specified $date (or current time if $date is
     * not specified) applies specified schedule (by $scheduleId)
     * @param {int} $scheduleId Schedule identifier
     * @param {string} $date Date to check
     * @return {boolean}
     */
    public function checkSchedule($scheduleId, $date = null)
    {
        $r = new Falcon_Record_X_Schedule($scheduleId);
        return $r->according($date);
    }
}