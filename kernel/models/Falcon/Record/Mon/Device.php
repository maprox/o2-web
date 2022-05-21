<?php

/**
 * Table "mon_device" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Record_Mon_Device extends Falcon_Record_Abstract
{
    const
        DEFAULT_WINTER_FUEL_CONSUMPTION = 12,
        DEFAULT_SUMMER_FUEL_CONSUMPTION = 10,
        DEFAULT_WINTER_FUEL_CONSUMPTION_PER_HOUR = 1,
        DEFAULT_SUMMER_FUEL_CONSUMPTION_PER_HOUR = 1,
        DEFAULT_MINIMAL_REFUEL = 10,
        DEFAULT_MINIMAL_DRAIN = 10;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'connected',
        'connection_status',
        'lastpacket',
        'lastconnect',
        'fuel_expense',
        'configured',
        'last_configured_change',
        'protocol',
        'identifier',
        'name',
        'phone',
        'note',
        'provider',
        'apn',
        'login',
        'password',
        'imagealias',
        'blockdate',
        'odometer',
        'lastimage',
        'settings',
        'state'
    ];

    public static $ignoredFieldsOnUpdate = [
        'odometer',
        'lastpacket',
        'lastconnect'
    ];

    /**
     * Table fields that should not be known through shared access
     * When toSharedArray is called, they are removed
     * @var String[]
     */
    public static $protectedFields = ['settings', 'identifier'];

    /**
     * Table fields that should not be modified through shared access
     * @var String[]
     */
    public static $readonlyFields = ['protocol'];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = [
        'logged',
        'journaled' => [
            'exclude' => [
                'onBeforeUpdate',
                'onAfterUpdate'
            ]
        ],
        'grouped',
        'autoshared'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'mon_device_setting',
            'alias' => 'setting',
            'fields' => ['id_device', 'id_protocol', 'option', 'value']
        ],
        [
            'table' => 'mon_device_sensor',
            'alias' => 'sensor',
            'fields' => ['*']
        ]
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        parent::insert();

        $this->setDefaultFuelOptions();

        return $this;
    }

    /**
     * Sets default options for fuel consumption
     */
    public function setDefaultFuelOptions()
    {
        // Зима 2011-2012 была взята из-за високосности
        $dateFrom = new DateTime('first day of December 2011');
        $dateTo = new DateTime('last day of February 2012');

        $this->setOption('fuel_expense_winter',
            self::DEFAULT_WINTER_FUEL_CONSUMPTION);
        $this->setOption('fuel_expense_summer',
            self::DEFAULT_SUMMER_FUEL_CONSUMPTION);
        $this->setOption('fuel_expense_per_hour_winter',
            self::DEFAULT_WINTER_FUEL_CONSUMPTION_PER_HOUR);
        $this->setOption('fuel_expense_per_hour_summer',
            self::DEFAULT_SUMMER_FUEL_CONSUMPTION_PER_HOUR);
        $this->setOption('fuel_winter_to_month', $dateTo->format('n'));
        $this->setOption('fuel_winter_from_month', $dateFrom->format('n'));
        $this->setOption('fuel_winter_to_day', $dateTo->format('j'));
        $this->setOption('fuel_winter_from_day', $dateFrom->format('j'));
        $this->setOption('minimal_refuel', self::DEFAULT_MINIMAL_REFUEL);
        $this->setOption('minimal_drain', self::DEFAULT_MINIMAL_DRAIN);
        $this->setOption('minimal_refuel_tank2', self::DEFAULT_MINIMAL_REFUEL);
        $this->setOption('minimal_drain_tank2', self::DEFAULT_MINIMAL_DRAIN);
    }

    /**
     * Sets mon_device_setting option
     * @param string $type
     * @param mixed $value
     * @param int $idProtocol
     */
    public function setOption($type, $value, $idProtocol = 0)
    {
        $settings = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
            'id_device = ?' => $this->getId(),
            'id_protocol = ?' => $idProtocol,
            'option = ?' => $type
        ]);

        if (empty($settings)) {
            $record = new Falcon_Record_Mon_Device_Setting();
            $record->setProps([
                'id_device' => $this->getId(),
                'id_protocol' => $idProtocol,
                'option' => $type,
                'value' => $value
            ])->insert();
        } else {
            $setting = array_shift($settings);
            $setting->set('value', $value);
            $setting->update();
            foreach ($settings as $obsolete) {
                $obsolete->delete();
            }
        }
    }

    /**
     * Get mon_device_setting option
     * @param string $option
     */
    public function getOption($option)
    {
        if (!$this->get('protocol')) {
            return null;
        }

        $options = Falcon_Mapper_Mon_Device_Setting::getInstance()->load([
            'id_device = ?' => $this->getId(),
            'id_protocol = ?' => $this->get('protocol'),
            'option = ?' => $option
        ]);

        if (!$options) {
            return null;
        }

        $option = $options[0];

        return $option->get('value');
    }

    /**
     * Changes connected status
     * @param Boolean $data
     * @param Boolean $connected
     * @return Falcon_Message
     */
    public function connectionChanged($data, $connected)
    {
        $this->set('connected', (int)$data)
            ->set('connection_status', (int)$connected)->update();
    }

    /**
     * Creates connection event
     * @param type $connected
     */
    public function addConnectionEvent($connected)
    {
        $eventName = $connected ? 'Connected' : 'Lost';
        $this->getMapper()->addDeviceEvent($this->getId(), $eventName);
    }

    /**
     * Returns coeff for device odometer
     * @return Float
     */
    public function getOdometerCoeff()
    {
        $protocol = new Falcon_Record_Mon_Device_Protocol(
            $this->get('protocol'));
        $coeff = $protocol->get('odometer_coeff');
        return empty($coeff) ? 1 : $coeff;
    }

    /**
     * Loads all active waylists for device
     * @return {Falcon_Record_Mon_Waylist[]}
     */
    public function getActiveWaylists()
    {
        return Falcon_Mapper_Mon_Waylist::getInstance()
            ->loadByDevice($this->getId(), true);
    }

    /**
     * Checking if device available for packets writing (new version)
     * @return {Boolean}
     */
    public function isWriteableNew()
    {
        $logger = Falcon_Logger::getInstance();
        $uid = $this->getId();

        // Firm object
        $firmId = $this->get('id_firm');
        $firm = new Falcon_Record_X_Firm($firmId);
        // Checking if firm is not active
        if (!$firm->isActive()) {
            $logger->log('packet_info', $uid . ' firm is not active');
            return false;
        }

        // Checking if device blocked by date
        if ($this->isBlocked()) {
            $logger->log('packet_info', $uid . ' blocked: ' . date('Y-m-d'));
            return false;
        }

        // Get tariff id
        $mxp = Falcon_Mapper_X_Package::getInstance();
        $tariff = $mxp->getFirmTariffByPackageAlias($firmId, 'mon');

        if (!$tariff) {
            $logger->log('packet_info', $uid . ' no tariff');
            return true;
        }

        // Get tariff options
        $mxt = Falcon_Mapper_X_Tariff::getInstance();
        $options = $mxt->getOptions($tariff);

        $maxcountdaypackets = 0;
        $minpacketsinterval = 0;
        $maxdaydistance = 0;

        foreach ($options as $option) {
            switch ($option['identifier']) {
                // Max count of day packets
                case 'maxcountdaypackets':
                    $maxcountdaypackets = $option['value'];
                    break;
                // Min packets interval
                case 'minpacketsinterval':
                    $minpacketsinterval = $option['value'];
                    break;
                // Max day distance
                case 'maxdaydistance':
                    $maxdaydistance = $option['value'] * 1000;
            }
        }

        // Checking interval
        /*$interval = $this->getPacketInterval();
        if ($interval !== null && $minpacketsinterval > $interval) {
            $logger->log('packet_info', $uid . ' interval ' .
                $minpacketsinterval . ' > ' . $interval);
            return false;
        }*/

        // maxcountdaypackets and maxdaydistance check
        $data = $this->getMapper()->getTodayParams($this->getId());
        $todayPacketCount = $data['packetsCount']; // Count of packets
        $todayMileage = $data['mileage']; // Today's odometer
        // Checking
        if (($maxcountdaypackets && $todayPacketCount >= $maxcountdaypackets) ||
            ($maxdaydistance && $todayMileage >= $maxdaydistance)
        ) {
            $logger->log('packet_info', $uid . ' ' .
                $maxcountdaypackets . ', ' . $todayPacketCount . '; ' .
                $maxdaydistance . ', ' . $todayMileage);
            $this->setBlocked();
            return false;
        }

        return true;
    }

    /**
     * Returns true if device is blocked on this date
     * @return Boolean
     */
    private function isBlocked()
    {
        $blockdate = $this->get('blockdate');
        return ($blockdate == date('Y-m-d'));
    }

    /**
     * Sets current device to a block state
     */
    private function setBlocked()
    {
        return $this
            ->set('blockdate', date('Y-m-d'))
            ->update();
    }

    /**
     * Returns packets interval in seconds between
     * packet inserts for device
     * @return Integer
     */
    private function getPacketInterval()
    {
        return time() - strtotime($this->get('lastconnect'));
    }
}
