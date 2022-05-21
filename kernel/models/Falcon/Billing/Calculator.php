<?php

/**
 * Billing package abstract class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Billing_Calculator extends Falcon_Singleton
{
    /**
     * Calculates billing for specified account
     * @param int $accountId
     * @param string $dt
     * @return Falcon_Record_Billing_History_Detail[]
     */
    public function calculate($accountId, $dt)
    {
        $details = [];
        $daysCountInBilledMonth =
            Falcon_Util::getCountOfDaysInMonthForDate($dt);
        $db = Zend_Db_Table::getDefaultAdapter();
        $tariffInfo = $db->fetchRow("
			select
				bat.id_tariff,
				p.id id_package,
				p.billing_class,
				t.free_days,
				date_part('days', '$dt' -
					(select date_trunc('day', min(bat2.sdt))
					 from billing_account_tariff bat2
					 where bat2.id_account = bat.id_account)) as work_days
			from billing_account_tariff bat
			join x_tariff t on t.id = bat.id_tariff
			join x_package p on p.id = t.id_package
			where bat.id_account = $accountId
			  and bat.sdt <= '$dt'
			  and (bat.edt > '$dt' or bat.edt is null)
		");
        $billingClassName = $tariffInfo['billing_class'];
        $biller = $this->getBillingClassInstanceByName($billingClassName);
        if (!$biller) {
            // we didn't find billing class for this package, so exit
            return $details;
        }
        $packageId = $tariffInfo['id_package'];
        $tariffId = $tariffInfo['id_tariff'];
        $freeDays = $tariffInfo['free_days'];
        $workDays = $tariffInfo['work_days'];
        foreach ($biller->calculate($accountId, $packageId, $dt) as $detail) {
            $feeInfo = new Falcon_Record_X_Fee_Value([
                'id_fee' => $detail->get('feeid'),
                'id_tariff' => $tariffId
            ]);
            $payedCount = $detail->get('feecount') -
                $feeInfo->get('no_fee_count');
            if ($payedCount < 0 || ($freeDays >= $workDays)) {
                $payedCount = 0;
            }
            $cost = $feeInfo->get('amount');
            if ($feeInfo->get('is_monthly')) {
                $cost = round($cost * 30 / $daysCountInBilledMonth, 4);
            }
            $detail->setProps([
                'payedcount' => $payedCount,
                'cost' => $cost,
                'id_package' => $packageId,
                'id_tariff' => $tariffId
            ]);
            $details[] = $detail;
        }
        return $details;
    }

    /**
     * Returns billing class instance by name
     * @param string $className
     * @return Falcon_Billing_Package_Abstract
     */
    public function getBillingClassInstanceByName($className)
    {
        $billingClassName = 'Falcon_Billing_Package_' . $className;
        if (!$className || !class_exists_warn_off($billingClassName)) {
            return null;
        }
        return $billingClassName::getInstance();
    }
}