<?php

/**
 * Class of package table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2013, Maprox LLC
 */
class Falcon_Record_X_Package extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'alias',
        'billing_class',
        'state'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_package_fee_link',
            'alias' => 'fee',
            'fields' => ['id_fee'],
            'simple' => true
        ],
        [
            'table' => 'x_package_right_level_link',
            'alias' => 'right_level',
            'fields' => ['id_right_level'],
            'simple' => true
        ],
        [
            'table' => 'x_package_tariff_option_link',
            'alias' => 'tariff_option',
            'fields' => ['id_tariff_option'],
            'simple' => true
        ],
        [
            'table' => 'x_package_module_link',
            'alias' => 'modules',
            'fields' => ['id_module'],
            'simple' => true
        ]
    ];
}
