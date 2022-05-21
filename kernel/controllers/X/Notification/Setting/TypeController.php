<?php

/**
 * Контроллер типов настроек уведомлений
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class X_Notification_Setting_TypeController extends Falcon_Controller_Action
{
    /**
     * Получение возможных типов настроек
     */

    public function get()
    {
        $records = Falcon_Mapper_X_Notification_Setting_Type::getInstance()
            ->load(null, true);

        return new Falcon_Message($records);
    }
}
