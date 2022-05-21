<?php

/**
 * Table "dn_feednorm_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Table_Dn_Feednorm_Value extends Falcon_Table_Abstract
{
    private $sqlLoadByFeednorm = "
		SELECT
			fv.id_feednorm, fv.id_product, fv.amount,
			fc.id_region, fc.id_warehouse, fc.count,
			w.name AS warehouse, w.address,
			r.name AS region,
			p.name AS product,
			a.code,
			m.name AS measure
		FROM
			dn_feednorm_value AS fv
		INNER JOIN
			dn_feednorm AS f
			ON f.id = fv.id_feednorm
		INNER JOIN
			dn_feednorm_count AS fc
			ON fc.id_feednorm = f.id
		INNER JOIN
			dn_product AS p
			ON p.id = fv.id_product
		INNER JOIN
			dn_article AS a
			ON a.id_product = p.id
		LEFT JOIN
			dn_warehouse AS w
			ON fc.id_warehouse = w.id
		LEFT JOIN
			dn_region AS r
			ON fc.id_region = r.id
		LEFT JOIN
			dn_measure AS m
			ON p.id_measure = m.id
		WHERE
			f.id = ?
			AND (w.id > 0 OR r.id > 0)
		ORDER BY
			fc.sdt DESC,
			fv.sdt DESC
		-- LIMIT 100
	";

    public function loadByFeednorm($feednormId)
    {
        return $this->query($this->sqlLoadByFeednorm, $feednormId);
    }
}
