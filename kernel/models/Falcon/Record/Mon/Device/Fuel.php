<?php

/**
 * Table "mon_device_fuel" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Record_Mon_Device_Fuel extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'type',
        'sdt',
        'edt',
        'amount',
        'state',
        'tank_number'
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        if ($this->get('type') != Falcon_Record_Blank_Mon_Device_Fuel::USAGE) {
            $sdt = $this->get('sdt');
            $deviceId = $this->get('id_device');

            $packet = Falcon_Mapper_Mon_Packet::getInstance()
                ->getPacketAtIndexFromDt($deviceId, 0, $sdt);

            // Refuels and drains must have addresses for reports
            if ($packet && !$packet->get('address')) {
                Falcon_Amqp::sendTo('mon.packet', 'update.address',
                    ['id' => $packet->getId()]);
            }
        }

        return parent::insert();
    }
}
