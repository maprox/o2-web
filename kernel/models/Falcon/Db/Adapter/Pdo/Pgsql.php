<?php

/**
 * Overridden adapter to work with PostgreSql.
 * Original method "quote" doesn't write 'null' for null parameters
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Db_Adapter_Pdo_Pgsql extends Zend_Db_Adapter_Pdo_Pgsql
{
    /**
     * Query string quoting
     * @param {String $value Query
     * @return {String} Quoted string
     */
    protected function _quote($value)
    {
        if (($value === null) || !isset($value)) return 'null';
        if (is_bool($value))
            return $value ? 'true' : 'false';
        return parent::_quote($value);
    }
}