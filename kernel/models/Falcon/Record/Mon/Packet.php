<?php

/**
 * Table "mon_packet" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Record_Mon_Packet extends Falcon_Record_Abstract
{
    // State values
    const
        FROM_ARCHIVE = 1,
        SOS_TYPE = 1;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'id_type',
        'event_dt',
        'time',
        'latitude',
        'longitude',
        'altitude',
        'azimuth',
        'speed',
        'odometer',
        'odometer_ext',
        'odometer_forced',
        'odometer_calculated',
        'address',
        'satellitescount',
        'hdop',
        'from_archive',
        'state'
    ];

    /**
     * Sensors array
     * @var Array
     */
    protected $sensors;

    /**
     * Array of record triggers
     * @var mixed
     */
    //protected $triggers = array('logged');

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_packet_sensor',
            'alias' => 'sensor',
            'fields' => ['id_sensor', 'val', 'val_conv',
                'id_device_sensor']
        ]
    ];

    /**
     * Old: packet object properties
     * @var Array
     */
    public static $_props = [
        [
            'id' => 145,
            'name' => 'Address',
            'type_id' => 2,
            'type_name' => 'Строковое',
            'default_value' => NULL,
        ],
        [
            'id' => 147,
            'name' => 'SatellitesCount',
            'type_id' => 1,
            'type_name' => 'Целочисленное',
            'default_value' => NULL,
        ],
        [
            'id' => 107,
            'name' => 'Odometer',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 148,
            'name' => 'HDOP',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 5,
            'name' => 'Speed',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 106,
            'name' => 'Fuel',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 108,
            'name' => 'Fuel expense',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 6,
            'name' => 'Azimuth',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 7,
            'name' => 'Latitude',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 8,
            'name' => 'Longitude',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 186,
            'name' => 'Battery level',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
        [
            'id' => 10,
            'name' => 'Time',
            'type_id' => 4,
            'type_name' => 'Время',
            'default_value' => NULL,
        ],
        [
            'id' => 24,
            'name' => 'Altitude',
            'type_id' => 3,
            'type_name' => 'Дробное',
            'default_value' => NULL,
        ],
    ];

    /**
     * Get property
     * @param String $prop Property
     * @return Mixed
     */
    public function get($prop)
    {
        if ($prop == 'odometer_ext' && $this->props[$prop] === null) {
            $prop = 'odometer';
        }
        return parent::get($prop);
    }

    /**
     * Returns sensors in hashed list array(sensor => value).
     * If already loaded returns data from local variable
     * @return Array
     */
    public function getSensors()
    {
        // TODO: this method works incorrect
        if (!$this->sensors) {
            $m = Falcon_Mapper_Mon_Packet_Sensor::getInstance();
            $records = $m->loadByPacket($this->getId());
            $this->sensors = [];
            if ($records !== null) {
                foreach ($records as $record) {
                    $this->sensors[$record['sensor']] = $record['val'];
                }
            }
        }
        return $this->sensors;
    }

    /**
     * Gets address, fetches if not set
     * @return String
     */
    public function getAddress()
    {
        if (!$this->get('address')) {
            $geocoder = new Falcon_Geocoder_Query();
            $gAnswer = $geocoder->execute('revGeocode', [
                $this->get('latitude'), $this->get('longitude')
            ]);

            if ($gAnswer->isSuccess()) {
                $this->set('address', $gAnswer->getParam('address'));
                $this->update();
            }
        }

        return $this->get('address');
    }

    /**
     * Returns sensor value by its name
     * @param String $name
     * @return String | null if no sensor
     */
    public function getSensorValue($name)
    {
        // TODO: this method works incorrect
        $sensors = $this->getSensors();
        return isset($sensors[$name]) ? $sensors[$name] : null;
    }

    /**
     * Sets the sensors array
     * @param type $sensors
     * @return this
     */
    public function setSensors($sensors)
    {
        $this->sensors = $sensors;
        return $this;
    }

    /**
     * Returns old packet object properties
     * @return {Falcon_Message}
     */
    public static function getProps()
    {
        return new Falcon_Message(self::$_props);
    }

    /**
     * Returns true if there is no satellte signal
     * @return Boolean
     */
    public function isNoSignal()
    {
        return (!(float)$this->get('latitude')
            && !(float)$this->get('longitude'));
    }

    /**
     * Returns true if packet type is SOS
     * @return Boolean
     */
    public function isSOS()
    {
        return $this->get('id_type') == self::SOS_TYPE;
    }

    /**
     * Returns true if packet is from archive
     * @return Boolean
     */
    public function isFromArchive()
    {
        return $this->get('from_archive') == self::FROM_ARCHIVE;
    }
}
