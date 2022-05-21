<?php

/**
 * Firm
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Model_Firm extends Falcon_Model_Abstract
{
    const DEFAULT_TARIFF = 6;

    /**
     * Класс записи. Обязательно переопределить в наследнике класса.
     * @var {String}
     */
    protected $mapperClass = 'Falcon_Mapper_X_Firm';

    /**
     * Флаг миграции, отсутствие которого в базе обозначает, что надо пользоваться старыми функциями
     * Если не переопределен, в любом случае используются новые функции
     * @var {String}
     */
    protected $migrateFlag = 'x_company';

    /**
     * Создание фирмы
     * @param String $name Название фирмы
     * @param Useless $parentId
     * @param Useless $indir
     * @return Falcon_Message
     */
    public function create($name, $parentId = null, $indir = true)
    {
        $record = new Falcon_Record_X_Firm();
        $record->insert();

        $id = $record->getId();
        $this->record = $record;

        $company = new Falcon_Record_X_Company(['name' => $name,
            'id_firm' => $id]);
        $company->insert();

        $record->set('id_company', $company->getId())->update();

        $account = new Falcon_Record_Billing_Account();
        $account->set('id_firm', $id)->setTariff(self::DEFAULT_TARIFF)->insert();

        $user = Falcon_Model_User::getInstance();
        if ($user && $user->getId() > 0) {
            $userFirmId = $user->getFirmId();
            $record->set('id_firm', $userFirmId)->update();
        }
        return new Falcon_Message();
    }

    /**
     * Returns users list of specified firm
     * @return {Falcon_Model_User[]}
     */
    public function getFirmUsers()
    {
        $firmId = $this->getId();
        $mapper = Falcon_Mapper_X_User::getInstance();
        $records = $mapper->load(['id_firm = ?' => $firmId], true);
        $users = [];
        foreach ($records as $record) {
            $users[] = new Falcon_Model_User($record['id']);
        }
        return $users;
    }

    /**
     * Имеет ли фирма документы для скачивания
     * @param Integer $firmId Идентификатор фирмы менеджера
     */
    public function hasDocs($firmId)
    {
        $where = [
            'id_firm_for = ?' => $this->getId(),
            'id_firm = ?' => $firmId
        ];
        return (bool)Falcon_Mapper_Dn_Doc::getInstance()->getCount($where);
    }

    /**
     * Имеет ли фирма доступ к модулю
     * @param String $module Название модуля
     * @param Boolean $onlyActive Только если доступ к модулю проплачен
     * @return Boolean
     */
    public function hasModule($module, $onlyActive = false)
    {
        /*$modules = $this->listModules($onlyActive);

        $modules = $modules->getCol('name');

        return in_array($module, $modules);*/
        return true;
    }

    /**
     * Получить id тарифов фирмы
     * @param Boolean $onlyActive Только проплаченные тарифы
     * @return Integer[]
     */
    public function getTariffIds($onlyActive = false)
    {
        $mapper = Falcon_Mapper_Billing_Account::getInstance();
        $accounts = $mapper->loadWithTariff($this->getId());

        $return = [];
        foreach ($accounts as $account) {
            if (!$onlyActive || $account['balance'] > $account['limitvalue']) {
                $return[] = $account['id_tariff'];
            }
        }

        return array_unique($return);
    }

    /**
     * Returns firm language id
     * @return int
     */
    public function getLangId()
    {
        return $this->getRecord()->get('id_lang');
    }

    /**
     * Returns lang alias for this firm settings (like ru, en, etc.)
     * @return string
     */
    public function getLang()
    {
        $langId = $this->getLangId();
        $lang = Falcon_Mapper_X_Lang::getInstance()->loadRecord($langId);
        return $lang ? $lang->get('name') : null;
    }

    /**
     * Returns locale from this firm settings (like ru_RU, en_GB, etc.)
     * @return string
     */
    public function getLocale()
    {
        $langId = $this->getLangId();
        $lang = Falcon_Mapper_X_Lang::getInstance()->loadRecord($langId);
        return $lang ? $lang->get('locale') : null;
    }

    /**
     * Returns welcome string
     * @return string
     */
    public function getWelcome()
    {
        return $this->getRecord()->get('welcome');
    }

    /**
     * Returns billing accounts for current firm
     * @return array
     */
    public function getBillingAccounts()
    {
        $varname = 'billingaccounts';
        if (!isset($this->_cache[$varname])) {
            $this->_cache[$varname] =
                Falcon_Mapper_Billing_Account::getInstance()
                    ->loadByFirm($this->getId());
        }
        return $this->_cache[$varname];
    }

    /**
     * Returns a list of available modules for the firm
     * @return array
     */
    public function getModules()
    {
        $varname = 'modules';
        if (!isset($this->_cache[$varname])) {
            $modules = [];
            foreach ($this->getBillingAccounts() as $record) {
                $accountId = $record['id'];
                $account = new Falcon_Record_Billing_Account($accountId);
                $tariff = $account->getTariff();
                if (!$tariff) {
                    Falcon_Logger::getInstance()->log('info',
                        'No tariff for account ' . $accountId);
                } else {
                    $tariffModules = $tariff->getModules();
                    $modules = array_merge($tariffModules, $modules);
                }
            }
            $modules = array_unique($modules, SORT_REGULAR);
            $this->_cache[$varname] = $modules;
        }
        return $this->_cache[$varname];
    }
}
