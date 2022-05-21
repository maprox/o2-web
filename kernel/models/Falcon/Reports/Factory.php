<?php

/**
 * Reports factory
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Reports_Factory
{
    /**
     * Get report class
     * @param $request
     */
    public static function get($request)
    {
        $request = (array)$request;
        if (!empty($request['report'])) {
            switch ($request['report']) {
                case '/reports/observer/monitoring/movement_2':
                    return new Falcon_Report_Zones($request);
                case '/reports/observer/monitoring/movement_1_1_1':
                    return new Falcon_Report_Overspeed($request);
            }
        }

        return new Falcon_Report_Common($request);
    }
}