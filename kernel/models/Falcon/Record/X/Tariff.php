<?php

/**
 * Class of tariff table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Record_X_Tariff extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'individual',
        'id_package',
        'identifier',
        'period_begin',
        'period_end',
        'refill_alert',
        'free_days',
        'limitvalue',
        'state'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_tariff_module_link',
            'alias' => 'modules',
            'fields' => [
                'id_module'
            ],
            'simple' => true
        ],
        [
            'table' => 'x_tariff_option_value',
            'alias' => 'tariff_option',
            'fields' => [
                'id_tariff_option',
                'value'
            ]
        ],
        [
            'table' => 'x_fee_value',
            'alias' => 'fee',
            'fields' => [
                'id_fee',
                'amount',
                'no_fee_count',
                'is_monthly'
            ]
        ]
    ];

    /**
     * Is tariff currently used
     * @return Boolean
     */
    public function isUsed()
    {
        return in_array(
            $this->getId(),
            Falcon_Mapper_X_Tariff::getInstance()->usedTariffs()
        );
    }

    /**
     * Get tariff packages
     * @return Integer[] Packages identifiers
     */
    public function getPackages()
    {
        return (array)$this->get('id_package');
    }

    /**
     * Returns a modules list for current tariff
     * @return array
     */
    public function getModules()
    {
        return $this->getMapper()->getModules($this->getId());
    }
}
