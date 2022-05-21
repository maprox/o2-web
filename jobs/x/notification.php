<?php

class Job_X_Notification extends Job_Abstract
{
    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'x.notification';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'process';

    public static $keys = [
        'notification.process.onpacket',
    ];

    protected function process($params)
    {
        $id = (int)$params['id'];
        $packet = new Falcon_Record_Mon_Packet($id);

        $n = new Falcon_Action_X_Notification();
        $n->processByPacket($packet);
    }
}