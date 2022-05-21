<?php

/**
 * Class for working with addresses
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Action_Address extends Falcon_Action_Abstract
{
    /**
     * Массив рабочих для создания/редактирования адресов
     * @var {Falcon_Action_Address_Object_Abstract[][]}
     */
    protected $settingsWorkers = [];

    /**
     * Возвращает айди языка выбранного текущим пользователем
     * @return {Integer}
     */
    public static function getLangId()
    {
        return Falcon_Action_Address_Utils::getLangId();
    }

    /**
     * Возвращает полную версию адреса из базы по айди
     * @param {Integer} $idAddress айди адреса
     * @param {String} $lngAlias желаемый язык
     * @return {String}
     */
    public static function getFull($idAddress, $lngAlias = false)
    {
        if (empty($idAddress) || !is_numeric($idAddress)) {
            return '';
        }

        if (empty($lngAlias)) {
            $idLang = self::getLangId();
        } else {
            $idLang = Falcon_Action_Address_Utils::getLangIdByAlias($lngAlias);
        }

        $record = new Falcon_Record_A_Address([
            'id_address' => $idAddress,
            'id_lang' => $idLang,
        ]);

        $fullname = $record->get('fullname');

        if (!empty($fullname)) {
            return $fullname;
        }

        return '';
    }

    /**
     * Обновляет настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function updateSettings($idUser, $settings)
    {
        Falcon_Cacher::getInstance()->drop('settings', $idUser);

        $return = [];

        foreach ($settings as $item) {
            try {
                $worker = $this->getSettingsWorker($item->mode, $idUser);

                $worker->readData($item->name);

                if ($worker->isPhantom()) {
                    $return[] = $worker->create($item->data);
                } else {
                    $return[] = $worker->update($item->data);
                }
            } catch (Falcon_Action_Address_Exception $e) {
                $answer = new Falcon_Message();
                $answer->error($e->getCode(), [
                    'msg' => $e->getMessage()
                ]);
                $return[] = $answer;
            }
        }

        return $return;
    }

    /**
     * Возвращает рабочего для выполнения работы
     * по созданию/редактированию адреса
     * @param {String} $type требуемый тип рабочего
     * @param {Integer} $id айди объекта
     * @return {Falcon_Action_Address_Object_Abstract}
     */
    protected function getSettingsWorker($type, $id)
    {
        if (empty($this->settingsWorkers[$id])) {
            $this->settingsWorkers[$id] = [];
        }

        if (empty($this->settingsWorkers[$id][$type])) {

            $worker = 'Falcon_Action_Address_Object_' . ucfirst($type);

            if (!class_exists_warn_off($worker)) {
                throw new Falcon_Action_Address_Exception(
                    'Address type "' . $type . '" is not defined yet',
                    Falcon_Exception::NOT_IMPLEMENTED);
            }

            $worker = new $worker();

            if (!($worker instanceOf Falcon_Action_Address_Object_Abstract)) {
                throw new Falcon_Action_Address_Exception(
                    'Address type "' . $type . '" is not ' .
                    'configured properly',
                    Falcon_Exception::NOT_IMPLEMENTED);
            }

            $worker->build($id);

            $this->settingsWorkers[$id][$type] = $worker;
        }

        return $this->settingsWorkers[$id][$type];
    }
}
