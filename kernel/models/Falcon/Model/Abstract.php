<?php

/**
 * Abstract database object
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Model_Abstract extends Falcon_Db_Table_Abstract
{
    // служебные объекты
    protected $_cache;      // кеш запросов
    protected static $_reloadCache = [];      // кеш запросов
    protected $_id;         // идентификатор объекта
    protected $writeUpdates = true;

    /**
     * Соответствующая запись в нормальной таблице
     * @var Falcon_Record_Abstract
     */
    protected $record;

    /**
     * Класс записи. Обязательно переопределить в наследнике класса.
     * @var {String}
     */
    protected $mapperClass;

    /**
     * Флаг миграции, отсутствие которого в базе обозначает, что надо пользоваться старыми функциями
     * Если не переопределен, в любом случае используются новые функции
     * @var {String}
     */
    protected $migrateFlag = false;

    /**
     * Дополнительные данные, не хранящиеся в рекорде
     * @var {Mixed[]}
     */
    protected $additionalData = [];

    /**
     * Конструктор. Устанавливаем идентификатор объекта
     * @param {int} $id Идентификатор объекта
     */
    public function __construct($id = -1)
    {
        parent::__construct();
        $this->setId($id);
    }

    /**
     * Устанавливает идентификатор объекта
     * @param {Mixed} $value
     */
    public function setId($value)
    {
        $this->_id = (int)$value;
    }

    /**
     * Post event
     * @param {String} $name Event name
     * @param {String} $value Event value
     * @param {Date} $dt Event time
     */
    public function event($name, $value = null, $dt = null)
    {
        return $this->LoadQuery("select event(?) as code", [
            $this->getId(), $name, $value, $dt]);
    }

    /**
     * Password generation
     * @param {String} $pw
     * @param {String} $hash
     * @param int $length
     */
    public static function genPw(&$pw, &$salt, $length = 8)
    {
        $s = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z'
        ];
        $pw = $salt = '';
        // generate password and salt
        for ($i = 0; $i < $length; $i++) {
            $symb = $s[array_rand($s)];
            $pw .= mt_rand(0, 1) ? strtoupper($symb) : $symb;
            $salt .= $s[mt_rand(0, 15)]; // 1...f
        }
    }

    protected function getModelName()
    {
        $model = get_called_class();
        $model = preg_replace('/^falcon_model_+/ui', '', $model);

        return strtolower($model);
    }

    protected function getCached($idString)
    {
        return Falcon_Cacher::getInstance()
            ->get($this->getModelName(), $idString);
    }

    protected function setCached($data, $idString)
    {
        return Falcon_Cacher::getInstance()->
        set($data, $this->getModelName(), $idString);
    }

    protected function dropCached($idString)
    {
        return Falcon_Cacher::getInstance()
            ->drop($this->getModelName(), $idString);
    }

    /**
     * Returns model record
     * @param {Boolean} $createIfMissing
     * @return Falcon_Record_Abstract
     */
    public function getRecord($createIfMissing = true)
    {
        if (!$this->record) {
            $class = $this->mapperClass;
            if (empty($class)) {
                throw new Falcon_Exception(
                    'mapperClass is not defined for ' . get_called_class());
            }
            $mapper = $class::getInstance();
            $id = $this->_id;

            $records = $mapper->loadBy(function ($sql) use ($id) {
                $sql->where('t.id = ?', $id);
            });
            if (empty($records)) {
                // create new record
                if ($createIfMissing) {
                    $this->record = $mapper->newRecord([
                        'id' => $this->getId(),
                        'id_firm' => $this->getFirmId()
                    ]);
                    $this->record->insert();
                }
            } else {
                $this->record = $mapper->newRecord();
                foreach ($records[0] as $key => $item) {
                    if (in_array($key, $this->record->getFields())) {
                        $this->record->set($key, $item);
                    } else {
                        $this->additionalData[$key] = $item;
                    }
                }
            }
            if ($this->record) {
                $this->record->resetChanges();
            }
        }
        return $this->record;
    }

    /**
     * Returns true if device is enabled, false otherwise
     */
    public function isEnabled()
    {
        $record = $this->getRecord();
        return ($record->get('state') == Falcon_Record_Abstract::STATE_ACTIVE);
    }

    /**
     * Set's the status of device (true = enabled, false = disabled)
     * @param {Boolean} $value
     */
    public function setEnabled($value = true)
    {
        $record = $this->getRecord();
        $record->set('state', $value ? Falcon_Record_Abstract::STATE_ACTIVE :
            Falcon_Record_Abstract::STATE_INACTIVE);
        $record->update();

        $answer = new Falcon_Message();
        return $answer;
    }

    /**
     * Updates record field value
     * @param string $field
     * @param mixed $value
     * @param bool $update If true, then record is updated in database
     */
    public function set($field, $value, $update = true)
    {
        $this->setFields([$field => $value], $update);
    }

    /**
     * Добавление/обновление свойства объекта
     * @param {String} $prop Имя свойства
     * @param {String} $value Значение свойства
     * @param {Boolean} $errorCheck Писать ошибку, если свойство не найдено
     * @return Falcon_Message
     */
    public function setField($prop, $value, $errorCheck = true)
    {
        $this->setFields([$prop => $value], $errorCheck);
        return new Falcon_Message();
    }

    /**
     * Updates record fields values
     * @param mixed[] $values
     */
    public function setFields($values, $update = true)
    {
        $r = $this->getRecord();
        foreach ($values as $field => $value) {
            $r->set($field, $value);
        }
        if ($update) {
            $r->update();
        }
    }

    /**
     * Возвращает значение поля $field
     * @param {String} $field Имя поля
     * @return {Mixed} Значение поля
     */
    public function get($field)
    {
        if (empty($this->record)) {
            $this->getRecord();
        }
        if (isset($this->additionalData[$field])) {
            return $this->additionalData[$field];
        }
        return $this->getRecord()->get($field);
    }

    /**
     * Returns an array of {'key' => 'value'} fields of object
     * @return {Array}
     */
    public function getFields()
    {
        return array_merge($this->getRecord()->toArray(),
            $this->additionalData);
    }

    /**
     * Возвращает идентификатор объекта
     * @return {int}
     */
    public function getId()
    {
        $record = $this->getRecord(false);
        return $record ? $record->getId() : -1;
    }

    /**
     * Returns firm identifier
     * @return null (by default)
     */
    public function getFirmId()
    {
        return null;
    }
}
