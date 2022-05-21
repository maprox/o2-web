<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class Dn_Operating_ModeController extends Falcon_Controller_Action_Rest
{
    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

}