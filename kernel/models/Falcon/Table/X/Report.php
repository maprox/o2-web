<?php

/**
 * Class of report table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Table_X_Report extends Falcon_Table_Common
{
    /**
     * Load reports with parameters
     * @var String
     */
    /*private $sqlLoadWithParams = "
        SELECT r.id, r.name, r.identifier, r.remote_path, r.state, r.invisible,
            rp.alias AS param_alias, rp.param_type
        FROM x_report AS r
        LEFT JOIN x_report_param_link AS rpl
            ON rpl.id_report = r.id
        INNER JOIN x_report_param as rp
            ON rp.id = rpl.id_param
    ";*/

    /**
     * Load reports with parameters
     * @return Mixed[]
     *//*
	public function loadWithParams()
	{
		return $this->query($this->sqlLoadWithParams);
	}*/
}
