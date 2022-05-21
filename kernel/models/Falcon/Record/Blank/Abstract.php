<?php

/**
 * Класс под заготовки для record-ов
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
abstract class Falcon_Record_Blank_Abstract
{
    /*
     * Тип отрезка данных
     * @cfg {String}
     */
    protected $type = null;
    /*
     * ID устройства
     * @cfg {Integer}
     */
    protected $device = 0;
    /*
     * Additional parameters of record
     * @cfg {Integer}
     */
    protected $params = null;
    /*
     * Вес данной заготовки
     * @cfg {Float}
     */
    protected $weight = null;
    /*
     * Набор основной информации о заготовке:
     * @cfg {Float[]}
     */
    protected $packetData = null;
    /*
     * Пакеты принадлежащие этой заготовке
     * @cfg {Mixed[][]}
     */
    protected $packets = [];
    /*
     * Ключ последнего по времени пакета
     * @cfg {Integer}
     */
    protected $maxKey = null;
    /*
     * Ключ первого по времени пакета
     * @cfg {Integer}
     */
    protected $minKey = null;

    /*
     * Конструктор
     * @param {Mixed[]} $packet - первый пакет на добавление к треку. Не обязателен.
     * @return {Falcon_Record_Mon_Track_Blank}
     */
    public function __construct($device, $packet = null, $params = null)
    {
        if (!empty($packet)) {
            $this->addPacket($packet);
        }

        $this->device = $device;
        $this->params = $params ?: [];
    }

    /*
     * Добавляет пакет к заготовке.
     * Возвращает true если пакет подходит заготовке по типу, и false если нарушает.
     * @param {Mixed[]} $packet - пакет на добавление.
     * @return {Boolean}
     */
    public function addPacket($packet)
    {
        $type = $this->getPacketType($packet);

        if ($this->type === null) {
            $this->type = $type;
        }

        $this->packets[$packet['id']] = $packet;
        $this->dropData();

        return $this->type == $type;
    }

    /**
     * Определяет тип пакета
     * @param $packet
     * @return mixed
     */
    abstract protected function getPacketType($packet);

    /*
     * Возвращает вес заготовки, рассчитывает если еще не рассчитан.
     * @return {Float}
     */
    abstract public function getWeight();

    /*
     * Возвращает, удовлетворяет ли заготовка
     * минимальным требованиям согласно своему типу.
     * @return {Boolean}
     */
    abstract public function isSatisfactory();

    /*
     * Присоединяет переданную заготовку к себе.
     * @param {Falcon_Record_Blank_Abstract}
     * @return Falcon_Record_Blank_Abstract
     */
    public function merge(Falcon_Record_Blank_Abstract $record)
    {
        foreach ($record->getPackets() as $packet) {
            $this->addPacket($packet);
        }

        return $this;
    }

    /*
     * Возвращает все пакеты заготовки.
     * @return {Mixed[][]}
     */
    public function getPackets()
    {
        return $this->packets;
    }

    /*
     * Returns a record for writing to the database
     * @return {Falcon_Record_Abstract}
     */
    abstract public function getRecord();

    /*
     * Возвращает основные данные
     * @return {Float[]}
     */
    abstract protected function getPacketData();

    /*
     * Возвращает ключ последнего по времени пакета.
     * @return {Integer}
     */
    protected function getLastPacketKey()
    {
        if ($this->maxKey === null) {
            $max = 0;
            $foundKey = 0;
            foreach ($this->packets as $key => $packet) {
                $time = strtotime($packet['time']);
                if ($time >= $max) {
                    $max = $time;
                    $foundKey = $key;
                }
            }
            $this->maxKey = $foundKey;
        }
        return $this->maxKey;
    }

    /*
     * Возвращает ключ первого по времени пакета.
     * @return {Integer}
     */
    protected function getFirstPacketKey()
    {
        if ($this->minKey === null) {
            $min = null;
            $foundKey = 0;
            foreach ($this->packets as $key => $packet) {
                $time = strtotime($packet['time']);
                if ($min === null || $time < $min) {
                    $min = $time;
                    $foundKey = $key;
                }
            }
            $this->minKey = $foundKey;
        }
        return $this->minKey;
    }

    /*
     * Обнуляет промежуточные данные, вызывается при смене состава пакетов.
     */
    protected function dropData()
    {
        $this->weight = null;
        $this->packetData = null;
        $this->minKey = null;
        $this->maxKey = null;
    }
}
