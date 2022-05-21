<?php

/**
 * Class of "z_migrate" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Z_Migrate_Flag extends Falcon_Mapper_Common
{
    /**
     * Array for storing checked flags
     * @var {Boolean[]}
     */
    protected static $flags = [];

    /**
     * Returns whether we are in migration mode for given flag
     * @param {String} $flag
     * @return {Boolean}
     */
    public static function isNew($flag)
    {
        if (!isset(self::$flags[$flag])) {
            $mapper = self::getInstance();

            $count = $mapper->getCount([
                'flag = ?' => $flag
            ]);

            self::$flags[$flag] = ($count > 0);
        }

        return self::$flags[$flag];
    }
}
