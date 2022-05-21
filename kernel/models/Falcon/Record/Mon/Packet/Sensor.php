<?php

/**
 * Table "mon_packet_sensor" record class
 *
 * @project    Maprox <http://www,maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Packet_Sensor extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_packet',
        'id_sensor',
        'val',
        'val_conv',
        'id_device_sensor'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_packet', 'id_sensor',
        'id_device_sensor'];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_packet';

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_sensor',
            'key' => 'id_sensor',
            'alias' => 'sensor',
            'fields' => ['name']
        ]
    ];

    /**
     * Returns actual sensor value
     * @param $unit Unit
     * @return type
     */
    public function getValue($unit = null, $precision = null)
    {
        $value = $this->get('val_conv') ? $this->get('val_conv')
            : $this->get('val');

        // get precision
        if ($precision === null) {
            $precision = 2;
        }

        // Convert value to float and round
        $value = round((float)$value, $precision);

        if ($unit) {
            $unit = trim($unit);
            // unit separator
            if (preg_match('#^(.+?)\|(.+)$#iu', $unit, $matches)) {
                if (!$value) {
                    // Off
                    $value = $matches[2];
                } else {
                    // On
                    $value = $matches[1];
                }
            } else {
                $value = $value . ' ' . $unit;
            }
        }

        return $value;
    }
}