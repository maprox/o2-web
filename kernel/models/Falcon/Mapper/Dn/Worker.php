<?php

/**
 * Class of "dn_worker" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Worker extends Falcon_Mapper_Common
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
            $sql->join('x_person', 'x_person.id = t.id_person', []);
        }
        return 'x_person';
    }

    /**
     * It seems to be no used anywhere
     * does not work because $primaryKey is not array
     * And conflicts with updates approach
     *
     * Trash record in the table by ID
     * @param Integer $id Record identifier
     * @return instanceof Falcon_Mapper_Abstract
     */
    /*public function trashRecord($primaryKey)
    {
        $r = new Falcon_Record_X_Person($primaryKey['id_person']);
        $r->trash();
        return $this;
    }*/
}