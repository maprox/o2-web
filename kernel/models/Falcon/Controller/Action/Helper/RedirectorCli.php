<?php

/**
 * Хэлпер заменяющий хелпер редиректа для командной строки
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Action_Helper_RedirectorCli
    extends Zend_Controller_Action_Helper_Redirector
{
    /**
     * Зашибаем изначальный "redirector", взяв его имя
     * @return string
     */
    public function getName()
    {
        return 'Redirector';
    }

    /**
     * Instead of dying, lets throw an exception
     * It will let us know, that something went wrong -
     *      there should be on redirects during cli, right?
     */
    public function redirectAndExit()
    {
        throw new Falcon_Exception('Redirect during cli-mode');
    }
}
