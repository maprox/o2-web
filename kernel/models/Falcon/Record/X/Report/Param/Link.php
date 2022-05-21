<?php

/**
 * Table "x_report_param_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Report_Param_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_report',
        'id_param'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_report';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_report_param',
            'key' => 'id_param',
            'fields' => ['*']
        ]
    ];
}
