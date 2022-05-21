<?php

/**
 * Table "dn_measure" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Record_Dn_Measure extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    const MEASURE_KG = 1;
    const MEASURE_LITRES = 2;
    const MEASURE_UNITS = 3;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_base',
        'name',
        'conv',
        'state'
    ];
}
