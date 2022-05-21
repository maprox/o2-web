<?php

/**
 * Abstract class for objects binded to addresses
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
abstract class Falcon_Action_Address_Object_Abstract
{
    /**
     * Содержит айди уже существующей записи с адресом, если таковая есть
     * @var {Integer}
     */
    protected $id = 0;

    /**
     * Содержит считанные данные об адресе
     * @var {Array}
     */
    protected $data = [];

    /**
     * Содержит айди объекта, от лица которого ведется работа
     * @var {Integer}
     */
    protected $obj;

    /**
     * Собирает необходимую подготовку по id объекта
     * @param {Integer} $id
     */
    abstract public function prepare($id);

    /**
     * Ище уже существующий адрес согласно входным данным
     * @param {String} $name
     */
    abstract public function readData($name);

    /**
     * Обновляет указатель на айди адреса у его владельца
     */
    abstract protected function updateSource();

    /**
     * Получить айди языка, зависит от объекта
     */
    abstract protected function getLang();

    /**
     * Проверяет, существует ли уже в базе адрес этого объекта
     * @return {Boolean}
     */
    public function isPhantom()
    {
        return ($this->id == 0);
    }

    /**
     * Запоминает пользователя, от которого идет работа, запускает сбор данных
     * @param {Integer} $idUser
     */
    public function build($id)
    {
        $this->obj = $id;

        $this->prepare($id);
    }

    /**
     * Возвращает данные адреса, если есть
     * @return {Array}
     */
    public function read()
    {
        $data = $this->data;
        $idLang = Falcon_Action_Address_Utils::getLangId();

        if (!empty($data['id_street'])) {
            $street = new Falcon_Record_A_Street([
                'id_street' => $data['id_street'],
                'id_lang' => $idLang
            ]);

            $street = $street->toArray();

            $data = array_merge($street, $data);

            $city = new Falcon_Record_A_City([
                'id_city' => $data['id_city'],
                'id_lang' => $idLang
            ]);

            $city = $city->toArray();

            $data = array_merge($city, $data);
            $data['street'] = $street['name'];
            $data['city'] = $city['name'];
        }

        return $data;
    }

    /**
     * Создает новый адрес в базе
     * @param {Object} $data
     */
    public function create($data)
    {
        $this->testInputData($data);

        $idStreet = $this->getStreetId($data);

        $languages = Falcon_Action_Address_Utils::getLangList();
        if (!$this->id) {
            $this->id = Falcon_Mapper_A_Address::getInstance()->getNextId();
        }

        foreach ($languages as $language) {
            $shortname = Falcon_Action_Address_Format::short($data, $language);
            $fullname = Falcon_Action_Address_Format::full($data, $language);

            $record = new Falcon_Record_A_Address();
            $record->setProps([
                'id_lang' => $language,
                'id_street' => $idStreet,
                'house' => $data->house,
                'flat' => $data->flat,
                'index' => (int)$data->index,
                'shortname' => $shortname,
                'fullname' => $fullname,
                'id_address' => $this->id,
            ]);

            if (is_numeric($data->floor)) {
                $record->set('floor', $data->floor);
            }

            $record->insert();
        }

        $this->updateSource();

        return new Falcon_Message($record->toArray());
    }

    /**
     * Обновляет существующий адрес в базе
     * @param {Object} $data
     */
    public function update($data)
    {
        $this->testInputData($data);

        $idStreet = $this->getStreetId($data);

        $idLang = $this->getLang();
        $record = new Falcon_Record_A_Address([
            'id_address' => $this->id,
            'id_lang' => $idLang,
        ]);

        $shortname = Falcon_Action_Address_Format::short($data, $idLang);
        $fullname = Falcon_Action_Address_Format::full($data, $idLang);

        $record->setProps([
            'id_street' => $idStreet,
            'house' => $data->house,
            'flat' => $data->flat,
            'index' => (int)$data->index,
            'shortname' => $shortname,
            'fullname' => $fullname,
        ]);

        if (is_numeric($data->floor)) {
            $record->set('floor', $data->floor);
        }

        $record->update();

        return new Falcon_Message($record->toArray());
    }

    /**
     * Проверяет корректность входных данных
     * @param {Object} $data
     */
    protected function testInputData($data)
    {
        if (empty($data->id_country)) {
            throw new Falcon_Action_Address_Exception(
                'Country must be defined',
                Falcon_Exception::OBJECT_NOT_FOUND);
        }

        if (empty($data->id_city)) {
            throw new Falcon_Action_Address_Exception(
                'City must be defined',
                Falcon_Exception::OBJECT_NOT_FOUND);
        }
    }

    /**
     * Возвращает улицу из базы данных, если надо - создает новую
     * @param {Object} $data
     */
    protected function getStreetId($data)
    {
        if (!empty($data->id_street)) {
            return $data->id_street;
        }

        $streets = Falcon_Mapper_A_Street::getInstance()->load([
            'id_city = ?' => $data->id_city,
            'name  = ?' => $data->street
        ], true);

        if (!empty($streets)) {
            return $streets[0]['id'];
        }

        $languages = Falcon_Action_Address_Utils::getLangList();
        $idStreet = Falcon_Mapper_A_Street::getInstance()->getNextId();

        foreach ($languages as $language) {
            $record = new Falcon_Record_A_Street();
            $record->setProps([
                'id_lang' => $language,
                'id_city' => $data->id_city,
                'name' => $data->street,
                'id_street' => $idStreet,
            ]);
            $record->insert();
        }

        return $idStreet;
    }
}
