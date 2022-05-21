<?php

/**
 * Class of package mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Package extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

    /**
     * Load records by a supplied query function
     * @param function $queryFn
     * @param array $params Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $records = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);
        $available = $this->getFirmPackages(false);
        foreach ($records as &$record) {
            if (in_array($record['id'], $available)) {
                $record['available'] = true;
            } else {
                $record['available'] = false;
            }
        }
        return $records;
    }

    /**
     * Return firm tariff id by package alias
     * @param int $firmId
     * @param string $alias
     */
    public function getFirmTariffByPackageAlias($firmId, $alias)
    {
        $mba = Falcon_Mapper_Billing_Account::getInstance();
        $accounts = $mba->loadWithTariff($firmId);

        $result = [];
        foreach ($accounts as $account) {
            $r = new Falcon_Record_X_Package([
                'id' => $account['id_package']
            ]);

            if ($r->get('alias') == $alias) {
                $result = $account;
                break;
            }
        }
        if (isset($result['id_tariff'])) {
            return $result['id_tariff'];
        } else {
            return false;
        }
    }

    /**
     * Returns array of packages id available for firm
     * @param int $firmId
     */
    public function getFirmPackages($firmId)
    {
        $ids = [];

        if (!is_array($firmId)) {
            if ($firmId == false) {
                $firmId = Falcon_Model_User::getInstance()->getFirmId();
            }
            $ids[] = $firmId;
        } else {
            $ids = $firmId;
        }

        $mapper = Falcon_Mapper_Billing_Account::getInstance();
        $time = time();
        $firms = [];
        $tariffIds = [];
        $tariffLinks = [];
        foreach ($ids as $firm) {
            $firms[$firm] = [];
            $accounts = $mapper->loadWithTariff($firm);
            foreach ($accounts as $account) {
                if ((strtotime($account['tariff_sdt']) < $time)
                    && (empty($account['tariff_edt'])
                        || (strtotime($account['tariff_edt']) > $time))
                ) {
                    $tariffLinks[$account['id_tariff']][] = $firm;
                    $tariffIds[] = $account['id_tariff'];
                }
            }
        }

        if (!empty($tariffIds)) {
            $tariffs = Falcon_Mapper_X_Tariff::getInstance()
                ->load(['id in (?)' => $tariffIds]);
        } else {
            $tariffs = [];
        }

        foreach ($tariffs as $tariff) {
            foreach ($tariffLinks[$tariff->getId()] as $firm) {
                $firms[$firm][] = $tariff->get('id_package');
            }
        }

        if (!is_array($firmId)) {
            return $firms[$firmId];
        } else {
            return $firms;
        }
    }
}
