<?php

/**
 * Table "dn_analytic_report" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Analytic_Report extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_type',
        'name',
        'note',
        'config',
        'state'
    ];
}
