<?php

/**
 * No javascript handler
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class NoscriptController extends Zend_Controller_Action
{
    /**
     * Обработка ошибки 404 либо 500
     */
    public function indexAction()
    {
        $t = Zend_Registry::get('translator');
        $zt = $t['zt'];
        throw new Falcon_Exception(
            '<h1>' . $zt->translate('No javascript') . '</h1>' .
            $zt->translate('Your browser does not support scripting!') .
            '<br/>' .
            $zt->translate('Please, enable Javascript, or install browser' .
                ' with Javascript support.'),
            Falcon_Exception::NO_JAVASCRIPT);
    }
}