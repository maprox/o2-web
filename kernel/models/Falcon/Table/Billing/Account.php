<?php

/**
 * Class of account table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Table_Billing_Account extends Falcon_Table_Common
{
    /**
     * Get accounts with tariff by firm identifier
     * @var String
     */
    private $sqlLoadWithTariff = "
		SELECT
			ba.id,
			ba.num,
			ba.id_type,
			ba.sdt,
			ba.balance,
			ba.state,
			ba.id_firm,
			t.id as id_tariff,
			t.name as tariff,
			t.id_package as id_package,
			bat.sdt as tariff_sdt,
			bat.edt as tariff_edt,
			coalesce(bal.limitvalue, ba.limitvalue) as limitvalue,
			bal.edt as limitvalue_edt
		FROM billing_account AS ba
		LEFT JOIN billing_account_tariff AS bat ON bat.id_account = ba.id
		LEFT JOIN x_tariff as t	ON t.id = bat.id_tariff
		LEFT JOIN billing_account_limit as bal ON bal.id_account = ba.id
		 AND (bal.edt IS NULL OR bal.edt > current_timestamp)
		WHERE ba.state != 3
		  AND coalesce(bat.state, 0) != 3
		  AND coalesce(bal.state, 0) != 3
		  AND (bat.edt IS NULL OR bat.edt > current_timestamp - INTERVAL '1 day')
		  AND ba.id_firm = ?
	";

    private $sqlLoadWithTariffByAccountId = "
		SELECT
			ba.id,
			ba.num,
			ba.id_type,
			ba.sdt,
			ba.balance,
			ba.state,
			ba.id_firm,
			t.id as id_tariff,
			t.name as tariff,
			t.id_package as id_package,
			bat.sdt as tariff_sdt,
			bat.edt as tariff_edt,
			coalesce(bal.limitvalue, ba.limitvalue) as limitvalue,
			bal.edt as limitvalue_edt
		FROM billing_account AS ba
		LEFT JOIN billing_account_tariff AS bat ON bat.id_account = ba.id
		LEFT JOIN x_tariff as t	ON t.id = bat.id_tariff
		LEFT JOIN billing_account_limit as bal ON bal.id_account = ba.id
		 AND (bal.edt IS NULL OR bal.edt > current_timestamp)
		WHERE coalesce(bat.state, 0) != 3
		  AND coalesce(bal.state, 0) != 3
		  AND (bat.edt IS NULL OR bat.edt > current_timestamp - INTERVAL '1 day')
		  AND ba.id = ?
	";

    private $sqlGetLimit = "SELECT f_account_limit(?, null) AS limitvalue";

    private $sqlNonpaymentEnabled = "
		select ba.* from billing_account ba
		join x_firm xf on xf.id = ba.id_firm
		where xf.have_unpaid_account != 1
		  and ba.state = 1
		  and xf.state = 1
		  and ba.balance < f_account_limit(ba.id, null)
	";

    private $sqlFirmNonpayment = "
		select ba.* from billing_account ba
		join x_firm xf on xf.id = ba.id_firm
		 and ba.state = 1
		 and xf.state = 1
		 and ba.balance < f_account_limit(ba.id, null)
		 and ba.id_firm = ?
	";

    /**
     * Returns account that need to be disabled for non-payment
     */
    public function getNonpaymentEnabledAccounts()
    {
        return $this->query($this->sqlNonpaymentEnabled);
    }

    /**
     * Returns non-payment accounts for firm
     * @param type $firmId
     * @return type
     */
    public function getNonpaymentAccountsForFirm($firmId)
    {
        return $this->query(
            $this->sqlFirmNonpayment,
            $firmId
        );
    }

    /**
     * Get accounts with tariff by firm identifier
     * @param Integer $firmId
     * @return Mixed[]
     */
    public function loadWithTariff($firmId)
    {
        return $this->query($this->sqlLoadWithTariff, $firmId);
    }

    /**
     * Get accounts with tariff by firm identifier
     * @param Integer $firmId
     * @return Mixed[]
     */
    public function loadWithTariffByAccountId($accountId)
    {
        return $this->query($this->sqlLoadWithTariffByAccountId, $accountId);
    }

    /**
     * Gets account limit, checking permanent limit and actual temporary limits
     * @param Integer $accountId
     * @return Mixed[]
     */
    public function getAccountLimit($accountId)
    {
        return $this->query($this->sqlGetLimit, $accountId);
    }

    /**
     * Returns low balance accounts, that has not been notified
     * @param {Integer} $balanceLimitDays Notify before N days
     */
    public function needBalanceNotify($balanceLimitDays)
    {
        $logger = Falcon_Logger::getInstance();

        $query = "
			select ba.*, f_account_limit(ba.id, null) as actuallimit,
				bh.sum as last_writeoff,
				(ba.balance + (($balanceLimitDays) * bh.sum)) balance_after,
				(ba.balance + (($balanceLimitDays) * bh.sum))
					< 0 as below_zero,
				(ba.balance + (($balanceLimitDays) * bh.sum))
					< f_account_limit(ba.id, null) as below_limit,
				coalesce((
					select value from x_flag
					where entity_table = 'billing_account'
					and id_entity = ba.id and type = 1
				), FALSE) as notified_zero,
				coalesce((
					select value from x_flag
					where entity_table = 'billing_account'
					and id_entity = ba.id
					and type = 2
				), FALSE) as notified_limit
				from billing_account ba
				join billing_history bh on ba.id = bh.id_account
				join x_firm xf on xf.id = ba.id_firm
				where bh.debitdt = (current_date - interval '1 day')
				  and bh.note = 'Daily debiting'
				  and (
					((ba.balance + (($balanceLimitDays) * bh.sum)) < 0
					AND coalesce((
						select value from x_flag
						where entity_table = 'billing_account'
						  and id_entity = ba.id and type = 1
					), FALSE) = FALSE)
					OR
					((ba.balance + (($balanceLimitDays) * bh.sum))
						< f_account_limit(ba.id, null)
					AND coalesce((
						select value from x_flag
						where entity_table = 'billing_account'
						  and id_entity = ba.id and type = 2), FALSE
					) = FALSE)
				  )
				  -- don't notify firms disabled due non-payment
				  and xf.have_unpaid_account = 0
				  -- Exclude freeaccounts
				  and ( bh.sum != 0 )
		";

        $records = $this->query($query);

        return $records;
    }
}
