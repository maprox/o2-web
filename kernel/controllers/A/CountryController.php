<?php

/**
 * Класс работы со странами
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class A_CountryController extends Falcon_Controller_Action
{
    /**
     * Массив имен экшенов контроллера, где нет необходимости
     * авторизации пользователя
     * @var {Array}
     */
    protected $_noCheckActions = ['index', 'load'];

    /**
     * Получение списка всех стран
     */
    public function get()
    {
        $langId = Falcon_Action_Address::getLangId();

        $countries = Falcon_Mapper_A_Country::getInstance()->
        load(['id_lang = ?' => $langId], null, true);

        return new Falcon_Message($countries);
    }
}
