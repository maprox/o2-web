<?php

/**
 * Table "dn_feednorm_count" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Record_Dn_Feednorm_Count extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_feednorm',
        'id_region',
        'id_warehouse',
        'count',
        'sdt'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_region';
}
