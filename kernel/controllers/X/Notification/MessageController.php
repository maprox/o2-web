<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class X_Notification_MessageController extends Falcon_Controller_Action
{
    public function get()
    {
        $t = Zend_Registry::get('translator');

        // Load messages
        $m = Falcon_Mapper_X_Notification_Message::getInstance();
        $messages = $m->loadBy(function ($sql) {
        });

        // Translate messages
        foreach ($messages as &$message) {
            $message['title'] = $t['zt']->_($message['title']);
            $message['text'] = $t['zt']->_($message['text']);
            // Generate id for frontend
            $message['id'] = $message['alias'] . '_' . $message['num'];
        }

        return new Falcon_Message($messages);
    }
}