<?php

/**
 * Table "mon_device_protocol" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Protocol extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'alias',
        'need_azimuth_check',
        'odometer_coeff',
        'state'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_device_protocol_sensor_link',
            'key' => 'id',
            'alias' => 'sensors',
            'fields' => ['*']
        ]
    ];

    public function needAzimuthCheck()
    {
        return (bool)$this->get('need_azimuth_check');
    }
}
