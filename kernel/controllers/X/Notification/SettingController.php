<?php

/**
 * Контроллер настроек уведомлений
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class X_Notification_SettingController extends Falcon_Controller_Action
{
    /**
     * Получение настроек пользователя
     */

    public function get()
    {
        // берем пользователя из БД
        $user = Falcon_Model_User::getInstance();

        $model = new Falcon_Action_Notification();

        return $model->loadSettings($user->getId());
    }
}
