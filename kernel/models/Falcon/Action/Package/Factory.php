<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * @author     Alexander Lyapko <sunsay@maprox.net>
 * @author     Anton Grinin <agrinin@maprox.net>
 * @author     Konstantin Pakshaev <kpakshaev@maprox.net>
 */
class Falcon_Action_Package_Factory
{
    /**
     * Packet initialization
     * @param string $name
     * @param array $params
     */
    public static function initPackage($name, $params)
    {
        $className = 'Falcon_Action_Package_Factory_' . ucfirst($name);
        $className::init($params);
    }
}