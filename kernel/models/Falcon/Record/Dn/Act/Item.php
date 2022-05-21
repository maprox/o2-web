<?php

/**
 * Table "dn_act_item" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Act_Item extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Multiple
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_act',
        'num',
        'name',
        'count',
        'id_measure',
        'cost'
    ];

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id_act';
}
