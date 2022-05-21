<?php

/**
 * Class for working with readonly action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Rest_Readonly extends Falcon_Action_Rest_Common
{
    /**
     * Create instance
     * @param type $c
     */
    public function instanceCreate($c)
    {
        $this->getAnswer()->error(Falcon_Exception::NOT_IMPLEMENTED,
            'Not implemented');
    }

    /**
     * Update instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        $this->getAnswer()->error(Falcon_Exception::NOT_IMPLEMENTED,
            'Not implemented');
    }

    /**
     * Delete instance
     * @param type $c
     */
    public function instanceDelete($c)
    {
        $this->getAnswer()->error(Falcon_Exception::NOT_IMPLEMENTED,
            'Not implemented');
    }
}
