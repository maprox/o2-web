<?php

/**
 * Table "dn_account"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Dn_Account extends Falcon_Table_Common
{
    /**
     * SQL requests
     * @private
     */
    private $sqlGetAccountByIdFirmClient = "select * from dn_account
		where id_firm_client = ?";

    /**
     * Returns an account record by field "id_firm_client"
     * @param {Number} $id Value of a field "id_firm_client"
     * @return {Falcon_Record_Dn_Account|null}
     */
    public function getAccountByIdFirmClient($id)
    {
        return $this->queryRow($this->sqlGetAccountByIdFirmClient, $id);
    }

    /**
     * Returns an array of child firms records by major firm $id
     * @param {Number} $id Value of a field "id_firm"
     * @param {Boolean} $loadDeleted True to load deleted accounts
     * @return {Array}
     */
    public function getClients($id, $loadDeleted = false)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('dn_account')
            ->where('id_firm = ?', $id);
        if (!$loadDeleted) {
            $sql->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
        }
        $rows = $db->query($sql)->fetchAll();
        return $this->tryToCastRowsToInt($rows);
    }
}
