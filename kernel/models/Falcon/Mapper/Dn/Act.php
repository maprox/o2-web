<?php

/**
 * Class of "dn_act" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Act extends Falcon_Mapper_Common
{
    // Number of digits for act's number
    const ACT_NUMBER_OF_DIGITS = 4;

    // Default executor firm id (Maprox LLC)
    const DEFAULT_ID_FIRM_EXECUTOR = 16,
        ID_FIRM_LINKOMM = 1438408;

    /**
     * Returns number for the new act by supplied date
     * @param DateTime $date
     * @warn NOT THREADSAFE!
     */
    public function getActNumber(DateTime $date)
    {
        $number = 1; // we will start from 1
        $prefix = $date->format('ymd');
        $lastNum = $this->loadBy(function ($sql) use ($prefix) {
            $sql
                ->where("num like ?", $prefix . '%')
                ->order('num desc')
                ->limit(1);
        }, ['fields' => ['num']]);
        if (!empty($lastNum)) {
            $number = substr($lastNum[0]['num'], strlen($prefix));
            $number++;
        }
        return $prefix . str_pad($number,
            self::ACT_NUMBER_OF_DIGITS, "0", STR_PAD_LEFT);
    }

    /**
     * Returns cost of the act for the supplied date
     * @param int $firmId Firm identifier for wich we will calculate act cost
     * @param DateTime $date Calc period
     * @return float
     */
    public function getActCost($firmId, DateTime $date)
    {
        $isTransition = (date('Y-m') == '2014-03');
        $sdt = new DateTime($date->format('Y-m-2'));
        $edt = new DateTime($date->format('Y-m-2'));
        $edt->add(new DateInterval('P1M'));
        $edt->sub(new DateInterval('PT1S'));
        if ($isTransition) {
            // first day of the month
            $sdt = new DateTime($date->format('Y-m-1'));
        }
        $cost = $this->getTable()->getActCost($firmId, $sdt, $edt);
        return $cost;
    }

    /**
     * Creates act
     * @param array $data
     * @return int Created act identifier
     */
    public function generate(array $data)
    {
        $periodDate = $data['period'];
        $firm = $data['firm'];
        $contract = $firm['contract'];
        if (!isset($contract['num'])
            || !isset($contract['dt'])
        ) {
            return;
        }

        // get contract details
        $firmExecutor = $contract['id_firm_supplier'];
        if (!$firmExecutor) {
            $firmExecutor = self::DEFAULT_ID_FIRM_EXECUTOR;
        }
        $firmClient = $contract['id_firm_reciever'];
        if (!$firmClient) {
            $firmClient = $firm['id'];
        }

        $c = Zend_Registry::get('config');
        $zt = Zend_Registry::get('translator');
        $t = $zt['zt'];
        $locale = $t->getLocale();
        $productName = $t->_($c->variables->title);

        if ($firmExecutor !== self::DEFAULT_ID_FIRM_EXECUTOR) {
            if ($firmExecutor == self::ID_FIRM_LINKOMM) { // ООО Линком / TMP
                $productName = $c->partners->linkomm->variables->title;
            }
        }

        $date = new Zend_Date($periodDate->format('Y-m-d'));
        $date->setLocale($locale);

        if ($locale == 'ru_RU') {
            $monthName = Zend_Locale_Data::getContent($locale, 'month',
                ['gregorian', 'stand-alone', 'wide',
                    $date->get(Zend_Date::MONTH_SHORT)]);
        } else {
            $monthName = $date->get(Zend_Date::MONTH_NAME);
        }
        $periodName = $monthName . ' ' . $date->get(Zend_Date::YEAR);

        $date->set($contract['dt']);
        $contractDate = $date->get(
            Zend_Date::DAY . ' ' .
            Zend_Date::MONTH_NAME . ' ' .
            Zend_Date::YEAR);

        $number = $this->getActNumber($periodDate);
        $cost = $this->getActCost($firmClient, $periodDate);
        $message = vsprintf($t->_(
            'Providing access to the web service %s ' .
            'for %s under the contract #%s dated %s'
        ), [$productName, $periodName, $contract['num'], $contractDate]);

        // insert act record
        $act = $this->newRecord([
            'num' => $number,
            'id_firm' => $firm['id'],
            'id_firm_executor' => $firmExecutor,
            'id_firm_client' => $firmClient,
            'dt' => $periodDate->format('Y-m-d')
        ]);
        $act->insert();

        // insert act item
        $actItem = new Falcon_Record_Dn_Act_Item([
            'id_act' => $act->getId(),
            'num' => 1, // it will be the first (and the last) item
            'name' => $message,
            'cost' => $cost,
            'count' => 1, // one item
            'id_measure' => Falcon_Record_Dn_Measure::MEASURE_UNITS
        ]);
        $actItem->insert();

        return intval($act->getId());
    }
}