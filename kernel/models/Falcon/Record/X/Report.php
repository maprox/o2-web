<?php

/**
 * Class of report table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Report extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'identifier',
        'remote_path',
        'state',
        'invisible'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_report_param_link',
            'key' => 'id',
            'alias' => 'params',
            'fields' => ['*']
        ]
    ];
}