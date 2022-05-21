<?php

/**
 * Class for working with firm addresses, by firm's user id
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 * @version    $Id: $
 * @link       $HeadURL: $
 */
class Falcon_Action_Address_Object_Userfirm extends Falcon_Action_Address_Object_Firm
{
    /**
     * Собирает необходимую подготовку по id пользователя
     * @param {Integer} $id
     */
    public function prepare($id)
    {
        $user = new Falcon_Model_User($id);
        $idFirm = $user->getFirmId();
        $this->firm = new Falcon_Model_Firm($idFirm);
    }

    /**
     * Получить айди языка
     */
    protected function getLang()
    {
        return Falcon_Action_Address_Utils::getLangId($this->obj);
    }
}
