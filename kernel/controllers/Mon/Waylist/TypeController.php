<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Mon_Waylist_TypeController
 */
class Mon_Waylist_TypeController extends Falcon_Controller_Action
{
    /**
     * Get waylist types
     * @return \Falcon_Message
     */
    public function get()
    {
        $records = Falcon_Mapper_Mon_Waylist_Type::getInstance()
            ->load(null, true);

        return new Falcon_Message($records);
    }
}