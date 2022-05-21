<?php

/**
 * Table "mon_waylist"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Waylist extends Falcon_Table_Common
{
    /**
     * Calculates distance by routes
     * @var String
     */
    private $sqlCalculateDistance = "select sum(distance)
		from mon_waylist_route
		where
			id_waylist = ?
			and state != ?";

    /**
     * Calculates distance based on routes
     * @param {Integer} $id
     * @return {Float}
     */
    public function calculateDistance($id)
    {
        return $this->queryCell($this->sqlCalculateDistance, [
            $id, Falcon_Record_Abstract::STATE_DELETED]);
    }
}