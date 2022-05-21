<?php

/**
 * Class of "x_user" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_User extends Falcon_Mapper_Common
{
    /**
     * @param {Number} $id User id
     * @return {Falcon_Message}
     */
    public function loadSettingsFor($id)
    {
        return new Falcon_Message($this->getTable()->loadSettingsFor($id));
    }

    /**
     * Save setting for given user
     * @param {Number} $id
     * @param {String} $setting
     * @param {String} $value
     * @return Falcon_Message
     */
    public function saveSettingFor($id, $setting, $value)
    {
        $answer = new Falcon_Message();

        try {
            $code = $this->getTable()->saveSettingFor($id, $setting, $value);
            $answer->addParam('code', $code);
        } catch (Zend_Db_Exception $e) {
            $answer->setSuccess(false);
        }

        return $answer;
    }

    /**
     * Returns users by right alias
     * @param type $alias
     */
    public function getUsersByRightAlias($alias)
    {
        return $this->getTable()->getUsersByRightAlias($alias);
    }

    /**
     * Returns users by firmId, right_alias and type
     * @param Integer $firmId
     * @param String $alias
     * @param Integer $type
     */
    public function getFirmUsersByRight($firmId, $alias, $type)
    {
        return $this->getTable()->getFirmUsersByRight($firmId, $alias, $type);
    }
}
