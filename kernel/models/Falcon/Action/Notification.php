<?php

/**
 * Class for working with notifications
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Notification extends Falcon_Action_Abstract
{
    /**
     * Constructs, binds instance of Falcon_Action_Notification_Setting class
     */
    public function __construct()
    {
        parent::__construct();
        $this->settings = new Falcon_Action_Notification_Setting();
    }

    /**
     * Возвращает список настроек пользователя
     * @param {Integer} $idUser айди пользователя
     * @return Falcon_Message
     */
    public function loadSettings($idUser)
    {
        return $this->settings->load($idUser);
    }

    /**
     * Создает новые настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function createSettings($idUser, $settings)
    {
        return $this->settings->create($idUser, $settings);
    }

    /**
     * Обновляет настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function updateSettings($idUser, $settings)
    {
        $this->settings->update($idUser, $settings);
    }

    /**
     * Удаляет настройки
     * @param {Integer} $idUser айди пользователя
     * @param {Array} $settings сами настройки
     */
    public function deleteSettings($idUser, $settings)
    {
        $this->settings->delete($idUser, $settings);
    }
}
