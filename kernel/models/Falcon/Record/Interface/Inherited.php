<?php

/**
 * Interface of table record wich inherits columns from the master table
 * Example: x_person_passport
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
interface Falcon_Record_Interface_Inherited
{
    /**
     * Returns parent table name
     */
    public function getParentTableName();
}
