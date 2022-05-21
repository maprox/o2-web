<?php

/**
 * Table "x_user"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_X_User extends Falcon_Table_Common
{
    private $settingsLoad = "select * from opt_load(?)";
    private $settingsSave = "select opt_save(?, ?, ?) as code";

    /**
     * Updates last loader field
     * @param Array $ids
     */
    public function updateLastLoader($ids = [])
    {
        if (empty($ids)) {
            return;
        }

        return $this->query("update x_user set last_loader = '"
            . date(DB_DATE_FORMAT)
            . "' where id in (" . implode(', ', $ids) . ")");
    }

    /**
     * Returns users with given email
     * @param String $email Email
     */
    public function getUsersByEmail($email)
    {
        $db = $this->_db;

        $query = $db
            ->select()
            ->distinct()
            ->from(['e' => 'x_person_email'])
            ->join(['p' => 'x_person'],
                'e.id_person = p.id'
            )
            ->join(['u' => 'x_user'],
                'u.id_person = p.id'
            )
            ->where('address = ?', $email)
            ->where('e.state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
            ->where('u.state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
        $rows = $db->query($query);
        $result = $rows->fetchAll();

        return $result;
    }

    /**
     * Returns users by right_alias
     * @param String $alias
     */
    public function getUsersByRightAlias($alias)
    {
        $db = $this->_db;
        $query = $db
            ->select()
            ->distinct()
            ->from(['xu' => 'x_user'])
            ->join(['xrllu' => 'x_right_level_link_user'],
                'xrllu.id_user = xu.id',
                []
            )
            ->join(['xrllr' => 'x_right_level_link_right'],
                'xrllr.id_right_level = xrllu.id_right_level',
                []
            )
            ->join(['xr' => 'x_right'],
                'xr.id = xrllr.id_right',
                []
            )
            ->where('xr.alias = ?', $alias)
            ->where('xu.state = ?', Falcon_Record_Abstract::STATE_ACTIVE);

        $rows = $db->query($query);
        $result = $rows->fetchAll();

        return $result;
    }

    /**
     * Returns users by firmId, right_alias and type
     * @param Integer $firmId
     * @param String $alias
     * @param Integer $type
     */
    public function getFirmUsersByRight($firmId, $alias, $type)
    {
        $db = $this->_db;
        $query = $db
            ->select()
            ->distinct()
            ->from(['xu' => 'x_user'])
            ->join(['xrllu' => 'x_right_level_link_user'],
                'xrllu.id_user = xu.id',
                []
            )
            ->join(['xrllr' => 'x_right_level_link_right'],
                'xrllr.id_right_level = xrllu.id_right_level',
                []
            )
            ->join(['xr' => 'x_right'],
                'xr.id = xrllr.id_right',
                []
            )
            ->where('xr.alias = ?', $alias)
            ->where('xr.type & ? > 0', $type)
            ->where('xu.id_firm = ?', $firmId)
            ->where('xu.state = ?', Falcon_Record_Abstract::STATE_ACTIVE);

        $rows = $db->query($query);
        $result = $rows->fetchAll();

        return $result;
    }

    /**
     * @param {Number} $id User id
     * @return {Falcon_Message}
     */
    public function loadSettingsFor($id)
    {
        $rows = $this->query($this->settingsLoad, $id);
        return $this->tryToCastRowsToInt($rows, true);
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
        return $this->queryCell($this->settingsSave,
            [$id, $setting, $value]);
    }
}