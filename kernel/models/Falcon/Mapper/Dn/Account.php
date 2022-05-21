<?php

/**
 * Table "dn_account"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Account extends Falcon_Mapper_Common
{
    /**
     * Returns an account record by field "id_firm_client"
     * @param {Number} $id Value of a field "id_firm_client"
     * @return {Falcon_Record_Dn_Account|null}
     */
    public function getAccountByIdFirmClient($id)
    {
        $account = $this->getTable()->getAccountByIdFirmClient($id);
        return ($account) ? new Falcon_Record_Dn_Account($account) : null;
    }

    /**
     * Updates an account record
     * @param {Falcon_Record_Dn_Account}
     */
    public function updateAccount(Falcon_Record_Dn_Account $record,
                                  $loadDeleted = false)
    {
        $where = [
            'id_firm_client = ?' => $record->get('id_firm_client')
        ];
        $this->update($where, $record->toArray(), $loadDeleted);
    }

    /**
     * Returns an array of child firms records by major firm $id
     * @param {Number} $id Value of a field "id_firm"
     * @param {Boolean} $loadDeleted True to load deleted accounts
     * @return {Array}
     */
    public function getClients($id, $loadDeleted = false)
    {
        return $this->getTable()->getClients($id, $loadDeleted);
    }
}
