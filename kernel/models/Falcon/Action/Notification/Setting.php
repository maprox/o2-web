<?php

/**
 * Class for working with notifications settings
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Notification_Setting extends Falcon_Action_Abstract
{
    /**
     * Возвращает список настроек пользователя
     * @param {Integer} $idUser айди пользователя
     * @return Falcon_Message
     */
    public function load($idUser)
    {
        // Проверяем нет ли кеша настроек
        $records = $this->getCached($idUser);

        // Если есть, возвращаем из кеша
        if (!empty($records)) {
            new Falcon_Message($records);
        }

        $records = Falcon_Mapper_X_Notification_Setting::getInstance()
            ->loadByUser($idUser);

        $this->setCached($records, $idUser);

        return new Falcon_Message($records);
    }

    /**
     * Создает новые настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function create($idUser, $settings)
    {
        $this->dropCached($idUser);

        $mapper = Falcon_Mapper_X_Notification_Setting::getInstance();

        $return = [];
        foreach ($settings as $item) {
            $item = (array)$item;
            unset($item['id']);
            unset($item['state']);
            $item['id_user'] = $idUser;
            $item['active'] = (int)$item['active'];

            $id = $mapper->createWithImportance($item);

            $return[$item['uid']] = $id;
        }

        return $return;
    }

    /**
     * Обновляет настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function update($idUser, $settings)
    {
        $this->dropCached($idUser);

        $mapper = Falcon_Mapper_X_Notification_Setting::getInstance();

        foreach ($settings as $item) {
            $item = (array)$item;
            $item['id_user'] = $idUser;
            $item['active'] = (int)$item['active'];

            $mapper->updateWithImportance($item);
        }
    }

    /**
     * Удаляет настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function delete($idUser, $settings)
    {
        $this->dropCached($idUser);

        $mapper = Falcon_Mapper_X_Notification_Setting::getInstance();

        foreach ($settings as $item) {
            $item = (array)$item;
            $item['id_user'] = $idUser;
            $item['active'] = (int)$item['active'];

            $mapper->deleteWithImportance($item);
        }
    }
}
