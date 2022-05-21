<?php

/**
 * Class of invoice mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Billing_Invoice extends Falcon_Mapper_Common
{
    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join(
                'billing_account',
                'billing_account.id = t.id_account',
                []
            );
        }
        return 'billing_account';
    }

    /**
     * Returns users by record object
     * @param type $record
     * @return Integer[]
     */
    public function getUsersByObject($record)
    {
        return $this->getTable()->getUsersByObject($record);
    }
}
