<?php

class Job_Mon_Packet extends Job_Abstract
{
    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'mon.packet';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'getAddress';

    public static $keys = [
        'update.address',
    ];

    protected function getAddress($params)
    {
        $id = (int)$params['id'];
        $packet = new Falcon_Record_Mon_Packet($id);
        $packet->getAddress();
    }
}