<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 *
 * Rest controller
 */
class Mon_Device_ImageController extends Falcon_Controller_Action_Rest
{
    /**
     * Outputs image content
     */
    function drawAction()
    {
        $answer = $this->doGetItem();
        if (!$answer) return;
        $size = $this->getParam('size');
        $data = $answer->getData();

        // Check device access
        $deviceId = $data['id_device'];
        Falcon_Access::checkRead('mon_device', $deviceId);

        $path = Zend_Registry::get('config')->path->uploaded;
        $filename = $data['hash'];
        if (strtolower($size) === 'small')
            $filename .= '.thumb';

        header('Content-Type: ' . $data['mime']);
        header('Expires:');
        header('Pragma:');
        header('Cache-Control: public');
        header('Cache-Control: max-age=2592000');
        readfile($path . $filename);
        die();

    }
}