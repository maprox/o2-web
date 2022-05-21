<?php

/**
 * Class for working with firm addresses
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Action_Address_Object_Firm extends Falcon_Action_Address_Object_Abstract
{
    /**
     * Объект фирмы, которой принадлежит адрес
     * @var {Falcon_Model_Firm}
     */
    protected $firm;

    /**
     * Тип текущего адреса, с которым ведется работа
     * @var {String}
     */
    protected $currentName;

    /**
     * Собирает необходимую подготовку по id фирмы
     * @param {Integer} $id
     */
    public function prepare($id)
    {
        $this->firm = new Falcon_Model_Firm($id);
    }

    /**
     * Получить айди языка
     */
    protected function getLang()
    {
        $settings = $this->firm->getFields();
        return Falcon_Action_Address_Utils::getLangIdByAlias($settings['language']);
    }

    /**
     * Ищет уже существующий адрес согласно входным данным
     * @param {String} $name
     */
    public function readData($name)
    {
        $this->currentName = $name;
        $this->id = 0;
        $this->data = [];

        $idAddress = $this->firm->get($this->currentName);

        $records = Falcon_Mapper_A_Address::getInstance()
            ->load(['id_address = ?' => $idAddress]);

        if (!empty($records)) {
            $this->id = $idAddress;
            foreach ($records as $record) {
                if ($record->get('id_lang') ==
                    Falcon_Action_Address_Utils::getLangId()
                ) {
                    $this->data = $record->toArray();
                    break;
                }
            }
        }
    }

    /**
     * Обновляет указатель на айди адреса у его владельца
     */
    protected function updateSource()
    {
        $this->firm->setField($this->currentName, $this->id);
    }
}
