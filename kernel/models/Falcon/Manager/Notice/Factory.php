<?php

/**
 * Notice manager factory
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Manager_Notice_Factory
{
    /**
     * Get notice manager by given alias
     * @param {String} $alias
     */
    public static function get($alias)
    {
        $className = 'Falcon_Manager_Notice_' . ucwords_custom($alias);
        return new $className();
    }
}