<?php

/**
 * Table "dn_product"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Table_Dn_Product extends Falcon_Table_Common
{
    /**
     * Load product list
     * @var String
     */
    private $sqlLoadWithMeasure = "
		SELECT p.id, p.id_measure, p.name, p.fullname, p.state,
			m.name AS measure,
			a.code
		FROM dn_product AS p
		INNER JOIN dn_measure AS m
			ON p.id_measure = m.id
		LEFT JOIN dn_article AS a
			ON a.id_product = p.id
		WHERE
			p.state = 1
	";

    /**
     * Load product list with associated data
     * @var String
     */
    private $sqlLoadWithData = "
		SELECT p.id, p.id_measure, p.name, p.fullname, p.state,
			m.name AS measure,
			a.code,
			d.ntd, d.shipmenttime, d.shelflife,
			COALESCE(sum(rv.amount * (CASE WHEN r.state = 1 THEN 1 ELSE 0 END)) > 0, false) as used
		FROM dn_product AS p
		INNER JOIN dn_measure AS m
			ON p.id_measure = m.id
		LEFT JOIN dn_article AS a
			ON a.id_product = p.id
			AND a.id_group = ?
		LEFT JOIN dn_product_data AS d
			ON p.id = d.id_product
			AND d.id_firm = ?
		LEFT JOIN dn_request_value AS rv
			ON rv.id_product = p.id
			AND rv.amount > 0
			AND rv.state = 1
		LEFT JOIN dn_request AS r
			ON r.id = rv.id_request
		WHERE
			p.state = 1
		GROUP BY p.id, p.id_measure, p.name, p.fullname, p.state,
			m.name, a.code, d.ntd, d.shipmenttime, d.shelflife
		ORDER BY p.name
	";

    /**
     * Load product list
     * @return Array[]
     */
    public function loadWithMeasure()
    {
        return $this->query($this->sqlLoadWithMeasure);
    }

    /**
     * Load product list with associated data
     * @param {String} $firmId
     * @return Array[]
     */
    public function loadWithData($articleGroup, $firmId)
    {
        return $this->query($this->sqlLoadWithData,
            [$articleGroup, $firmId]);
    }
}
