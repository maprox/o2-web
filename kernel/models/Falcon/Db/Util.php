<?php

/**
 * Database utilities
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Db_Util
{
    /**
     * Returns next value for specified sequence
     * @param string $sequenceName
     * @return int
     */
    static public function getNextSequenceId($sequenceName)
    {
        $result = Zend_Db_Table::getDefaultAdapter()
            ->fetchRow('select nextval(?) as num', $sequenceName);
        return $result['num'];
    }
}