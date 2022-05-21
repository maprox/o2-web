<?php

/**
 * Класс производящий вычисления абстрактынх отрезков информации о машине
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
abstract class Falcon_Action_Calculate_Abstract extends Falcon_Action_Abstract
{
    /*
     * Подготовленные для записи в базу
     * @var {Falcon_Record_Abstract[]}
     */
    protected $setRecords = [];
    /*
     * На удаление
     * @var {Falcon_Record_Abstract[]}
     */
    protected $unsetRecords = [];
    /*
     * ID устройства
     * @cfg {Integer}
     */
    protected $device = 0;
    /*
     * Дата начала
     * @cfg {String}
     */
    protected $sdt = '';
    /*
     * Дата завершения
     * @cfg {String}
     */
    protected $edt = '';
    /*
     * Прочие опции
     * @cfg {Mixed[]}
     */
    protected $options = [];
    /*
     * Настройки для загрзуки пакетов маппером
     * @cfg {Mixed[]}
     */
    protected $loadOptions = [];

    abstract protected function processPackets($packets);

    /**
     * Falcon_Action_Calculate_Abstract constructor.
     * @param $device
     * @param $sdt
     * @param array $options
     */
    public function __construct($device, $sdt, $options = [])
    {
        $this->setDevice($device);
        $this->setSdt($sdt);
        $this->setOptions($options);
    }

    /**
     * @return string
     * @throws Exception
     */
    public function process()
    {
        if (strtotime($this->getSdt()) > time() - 1200) {
            return false;
        }

        $options = $this->getOptions();
        if (isset($options['edt'])) {
            $this->setEdt($options['edt']);
        } else {
            $this->setEdt(date(DB_DATE_FORMAT,
                min(strtotime($this->getSdt()) + 86400, time())));
        }

        $originalSdt = $this->getSdt();
        $this->unsetRecords = $this->getUnsetRecords();

        if (!empty($this->unsetRecords)) {
            $lastRecord = end($this->unsetRecords);
            $lastRecordEdt = $lastRecord->get('edt');
            $firstRecord = reset($this->unsetRecords);
            $firstRecordSdt = $firstRecord->get('sdt');

            if (strtotime($lastRecordEdt) > strtotime($this->getEdt())) {
                $this->setEdt($lastRecordEdt);
            }
            if (strtotime($firstRecordSdt) < strtotime($this->getSdt())) {
                $this->setSdt($firstRecordSdt);
            }
        }

        if (strtotime($this->getEdt()) > (time() + 86400)) {
            return false;
        }
        $that = $this;
        $packets = Falcon_Mapper_Mon_Packet::getInstance()->loadBy(
            function ($sql) use ($that) {
                /** @var Zend_Db_Select $sql */
                $sql->where('t.state != ' .
                    Falcon_Record_Abstract::STATE_DELETED .
                    ' OR t.id_type = 1');
                $sql->where('t.id_device = ?', $that->getDevice());
                $sql->where('t.time >= ?', $that->getSdt());
                $sql->where('t.time <= ?', $that->getEdt());
                $sql->order('t.time', 'asc');
                $sql->order('t.id', 'asc');
                $that->joinAdditionalData($sql);
            }, $this->loadOptions, false, false);

        $haveNew = false;
        foreach ($packets as $packet) {
            if ($packet['time'] > $originalSdt) {
                $haveNew = true;
                break;
            }
        }

        if (!$haveNew) {
            $nextPacket = Falcon_Mapper_Mon_Packet::getInstance()->
            loadBy(function ($sql) use ($that) {
                /** @var Zend_Db_Select $sql */
                $sql->where('t.id_device = ?', $that->getDevice());
                $sql->where('t.state != ' .
                    Falcon_Record_Abstract::STATE_DELETED .
                    ' OR t.id_type = 1');
                $sql->where('t.time > ?', $that->getEdt());
                $sql->order('t.time asc');
                $that->joinAdditionalData($sql);
                $sql->limit(1);
            });
            if (!empty($nextPacket)) {
                $this->options['edt'] = $nextPacket[0]['time'];
                return $this->process();
            } else {
                return false;
            }
        }

        $preparedPackets = $this->preparePackets($packets);
        $this->processPackets($preparedPackets);

        self::startTransaction();
        try {
            $this->writeResults();
            self::commitTransaction();
        } catch (Exception $e) {
            Falcon_Logger::getInstance()->log('crit',
                'Error during calculate transaction', [
                    'Type' => $this->getActionName(),
                    'Unset' => $this->unsetRecords,
                    'Set' => $this->setRecords,
                    'Code' => $e->getCode(),
                    'Message' => $e->getMessage(),
                    'Backtrace' => $e->getTrace(),
                ]);
            self::rollbackTransaction();
            // Если не тот тип эксепшена, кидаем дальше
            if (!($e instanceof Zend_Db_Adapter_Exception) &&
                !($e instanceof Falcon_Exception) &&
                !($e instanceof PDOException)
            ) {
                throw $e;
            }
        }

        return $this->getEdt();
    }

    /**
     * Returns records to be deleted
     * @return array
     */
    protected function getUnsetRecords()
    {
        $mapperClassName = ucwords_custom(str_replace(
            'calculate_', 'falcon_mapper_', $this->getActionName()));
        $mapper = call_user_func([$mapperClassName, 'getInstance']);

        $params = [
            'id_device = ?' => $this->getDevice(),
            'sdt < ?' => $this->getEdt(),
            'edt >= ?' => $this->getSdt()
        ];

        // SPIKE-NAIL FOR MON_DEVICE_FUEL
        $options = $this->getOptions();
        if (isset($options['tank_number'])) {
            $params['tank_number = ?'] = $options['tank_number'];
        }

        return $mapper->load($params, 'sdt');
    }

    /**
     * @param $sql
     */
    public function joinAdditionalData($sql)
    {
    }

    /**
     * Make some preparations on packets
     * @param {array} $packets
     * @return array
     */
    protected function preparePackets($packets)
    {
        return $packets;
    }

    /**
     * Write results into database
     */
    protected function writeResults()
    {
        foreach ($this->unsetRecords as $record) {
            $record->delete();
        }

        foreach ($this->setRecords as $record) {
            $record->insert();
        }
    }

    /**
     * Set device Id
     * @param int $device
     */
    protected function setDevice($device)
    {
        $this->device = $device;
    }

    /**
     * Returns device Id
     * @return int
     */
    public function getDevice()
    {
        return $this->device;
    }

    /**
     * @param $edt
     */
    protected function setEdt($edt)
    {
        $this->edt = $edt;
    }

    /**
     * @return string
     */
    public function getEdt()
    {
        return $this->edt;
    }

    /**
     * @param $options
     */
    protected function setOptions($options)
    {
        $this->options = $options;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param $sdt
     */
    protected function setSdt($sdt)
    {
        $this->sdt = $sdt;
    }

    /**
     * @return string
     */
    public function getSdt()
    {
        return $this->sdt;
    }
}
