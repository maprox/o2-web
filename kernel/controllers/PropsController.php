<?php

/**
 * Props controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class PropsController extends Falcon_Controller_Action
{
    /**
     * load
     */
    public function loadAction()
    {
        $this->sendAnswer($this->get());
    }

    public function get()
    {
        return Falcon_Action_Mon_Packet::getProps();
    }
}
