<?php

/**
 * Requiredvolume value table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Dn_Requiredvolume_Value extends Falcon_Table_Common
{
    /**
     * Load requiredvolume values
     * @var String
     */
    private $sqlLoad = "
		SELECT rv.id_requiredvolume, rv.id_warehouse, rv.id_region,
			rv.id_product, rv.amount,
			w.name AS warehouse, w.address,
			r.name AS region,
			p.name AS product,
			a.code,
			m.name AS measure
		FROM dn_requiredvolume_value AS rv
		INNER JOIN dn_product AS p
			ON p.id = rv.id_product
		INNER JOIN dn_article AS a
			ON a.id_product = p.id
		LEFT JOIN dn_warehouse AS w
			ON rv.id_warehouse = w.id
		LEFT JOIN dn_region AS r
			ON rv.id_region = r.id
		LEFT JOIN dn_measure AS m
			ON p.id_measure = m.id
		WHERE rv.id_requiredvolume = ?
			AND rv.state <> 3
			AND (w.id > 0 OR r.id > 0)
	";

    /**
     * Load requiredvolume values
     * @return Array[]
     */
    public function queryLoad($requiredvolumeId)
    {
        return $this->query($this->sqlLoad, $requiredvolumeId);
    }
}
