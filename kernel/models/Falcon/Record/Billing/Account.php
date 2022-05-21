<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Class of account record
 */
class Falcon_Record_Billing_Account extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'num',
        'id_type',
        'sdt',
        'balance',
        'id_firm',
        'limitvalue',
        'state'
    ];

    /**
     * New tariff id to be set on update/insert
     * @var Integer
     */
    protected $idTariff;

    /**
     * Return billing history records for this account
     * @param {Boolean} $loadDetails [true] Join details for history record
     * @param array $params Order and paging params
     */
    public function loadHistory($loadDetails = true, $params = [])
    {
        $m = Falcon_Mapper_Billing_History::getInstance();
        $records = $m->loadByAccountId($this->getId(), $params);
        if ($loadDetails) {
            foreach ($records as &$record) {
                $md = Falcon_Mapper_Billing_History_Detail::getInstance();
                $details = $md->loadByHistoryId($record['id']);
                $record['details'] = $details;
            }
        }
        return $records;
    }

    /**
     * Update account limit, write to billing history
     * @param {Integer} $value new limit
     * @return instanceof Falcon_Record_Abstract
     */
    public function setLimit($value)
    {
        $this->testUserAccountRights('billing_edit_account_limit');

        $this->writeHistory($value);

        $value = (float)$value;
        $this->set('limitvalue', $value);
        $this->update();

        return $this;
    }

    /**
     * Create temporary account limit, write to billing history
     * @param {Integer} $value new limit
     * @param {String} $date limit expitation date
     * @return instanceof Falcon_Record_Abstract
     */
    public function setTempLimit($value, $date)
    {
        $this->testUserAccountRights('billing_edit_account_limit');

        $this->writeHistory($value, $date);

        $limit = new Falcon_Record_Billing_Account_Limit();
        $limit->setProps([
            'id_account' => $this->get('id'),
            'id_user' => Falcon_Model_User::getInstance()->getId(),
            'edt' => $date,
            'limitvalue' => $value
        ])->insert();

        return $this;
    }

    /**
     * Gets account limit, checking permanent limit and actual temporary limits
     * @return {Integer}
     */
    public function getLimit()
    {
        return $this->getMapper()->getAccountLimit($this->get('id'));
    }

    /**
     * Gets account limit date, if exists
     * @return {String}
     */
    public function getLimitDate()
    {
        $mapper = Falcon_Mapper_Billing_Account_Limit::getInstance();

        $limits = $mapper->load([
            'id_account = ?' => $this->get('id'),
            'edt > ? or edt is null' => $this->dbDate()
        ], true);

        $time = 0;
        $edt = false;
        foreach ($limits as $limit) {
            if (strtotime($limit['sdt']) > $time) {
                $time = strtotime($limit['sdt']);
                $edt = $limit['edt'];
            }
        }

        return $edt;
    }

    /**
     * Tests, if current user have enough rights to edit this account
     * @param {String} $rightName
     */
    protected function testUserAccountRights($rightName)
    {
        $user = Falcon_Model_User::getInstance();

        if (!$user->hasRight($rightName)) {
            throw new Falcon_Exception('Account limit rights violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }
    }

    /**
     * Creates billing history record
     * @param {Integer} $newValue
     * @param {String} $date
     */
    protected function writeHistory($newValue, $date = false)
    {
        $firm = new Falcon_Model_Firm($this->get('id_firm'));
        $langId = $firm->getLangId();

        $history = new Falcon_Record_Billing_History();
        $template = $history->getLimitTemplate($langId, empty($date));
        if (empty($date)) {
            $note = sprintf($template, $this->get('limitvalue'), $newValue);
        } else {
            $date = date('Y-m-d', strtotime($date));
            $note = sprintf($template, $newValue, $date);
        }

        $history->setProps([
            'id_account' => $this->get('id'),
            'balance' => $this->get('balance'),
            'sum' => null,
            'note' => $note
        ]);
        $history->insert();
    }

    /**
     * Sets new tariff id to be written on next update or insert
     * @param {Integer} $idTariff
     * @return instanceof Falcon_Record_Abstract
     */
    public function setTariff($idTariff)
    {
        $this->idTariff = $idTariff;

        return $this;
    }

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        parent::insert();

        if (!empty($this->idTariff)) {
            $this->createNewTariff($this->idTariff);
        }

        $id = $this->getId();
        $digits = str_split($id);
        $number = 0;
        $multiplier = 0;

        foreach ($digits as $digit) {
            $multiplier++;
            $number = $number + $digit * $multiplier;
        }

        $number = $number % 100;
        if ($number < 10) {
            $number = '0' . $number;
        }

        $this->set('num', $id . $number);
        parent::update();

        return $this;
    }

    /**
     * Update record in the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function update()
    {
        parent::update();

        if (!empty($this->idTariff)) {
            $this->testUserAccountRights('billing_edit_account_tariff');

            $tariff = $this->getTariffLink();
            if (!empty($tariff)) {
                $tariff->set('edt', $this->dbDate())->update();
            }

            $this->createNewTariff($this->idTariff);
        }

        return $this;
    }

    /**
     * Returns current tariff link
     * @return Falcon_Record_Billing_Account_Tariff
     */
    public function getTariffLink()
    {
        $mapper = Falcon_Mapper_Billing_Account_Tariff::getInstance();
        $records = $mapper->load([
            'id_account = ?' => $this->getId(),
            'edt is ?' => null,
        ]);
        return current($records);
    }

    /**
     * Gets current tariff for account on specified date.
     * If no $dt parameter specified then returns current tariff
     * @param string $dt Get tariff on specified date (opt.)
     * @return instanceof Falcon_Record_X_Tariff
     */
    public function getTariff($dt = null)
    {
        $accountId = $this->getId();
        $mapper = Falcon_Mapper_Billing_Account_Tariff::getInstance();
        $records = $mapper->loadBy(function ($sql) use ($accountId, $dt) {
            $sql
                ->where('id_account = ?', $accountId)
                ->where('edt is null or edt > current_timestamp')
                ->order('sdt desc')
                ->limit(1);
            if ($dt === null) {
                $sql->where('sdt <= current_timestamp');
            } else {
                $sql->where('sdt <= coalesce(?, current_timestamp)', $dt);
            }
        });
        if (!empty($records)) {
            $tariffId = $records[0]['id_tariff'];
            return new Falcon_Record_X_Tariff($tariffId);
        }
        return null;
    }

    /**
     * Creates new tariff record
     */
    protected function createNewTariff(&$idTariff)
    {
        $tariff = new Falcon_Record_Billing_Account_Tariff();
        $tariff->setProps([
            'id_account' => $this->get('id'),
            'id_tariff' => $idTariff,
            'sdt' => $tariff->dbDate()
        ])->insert();

        unset($idTariff);
    }

    /**
     * Changes balance, if allowed
     * @param {Integer} $value
     * @param {String} $note
     * @return instanceof Falcon_Record_Abstract
     */
    public function changeBalance($value, $note)
    {
        $this->testUserAccountRights('billing_edit_account_balance');

        $balance = $this->get('balance');
        $this->set('balance', $balance + $value);

        $history = new Falcon_Record_Billing_History();
        $history->setProps([
            'id_account' => $this->get('id'),
            'balance' => $this->get('balance'),
            'sum' => $value,
            'note' => $note
        ]);
        $history->insert();

        // Для обновления суммы баланса в интерфейсе
        $firm = new Falcon_Model_Firm($this->get('id_firm'));
        foreach ($firm->getFirmUsers() as $user) {
            Falcon_Cacher::getInstance()->drop('settings', $user->getId());
            Falcon_Action_Update::add([
                'id_user' => $user->getId(),
                'alias' => 'settings'
            ]);
        }

        return $this;
    }
}
