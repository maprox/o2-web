<?php

/**
 * Table "x_history_diff" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_History_Diff extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_history',
        'id_value',
        'prev',
        'new',
        'prev_name',
        'new_name',
        'is_dt',
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_history_value',
            'key' => 'id_value',
            'fields' => ['name as field']
        ],
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_history';
}
