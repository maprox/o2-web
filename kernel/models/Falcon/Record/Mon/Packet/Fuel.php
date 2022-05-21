<?php

/**
 * Table "mon_packet_fuel" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Record_Mon_Packet_Fuel extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_packet',
        'val',
        'state',
        'tank_number'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_packet', 'tank_number'];
}
