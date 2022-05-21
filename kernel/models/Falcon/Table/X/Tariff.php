<?php

/**
 * Class of tariff table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Table_X_Tariff extends Falcon_Table_Common
{
    /**
     * Get used tariffs
     * @var String
     */
    private $sqlUsedTariffs = "
		SELECT DISTINCT id_tariff as id
		FROM billing_account_tariff
		WHERE state <> 3
			AND edt IS NULL
	";

    /**
     * Get used tariffs
     * @return Integer[] Used tariffs ids
     */
    public function usedTariffs()
    {
        return $this->queryCol($this->sqlUsedTariffs);
    }
}