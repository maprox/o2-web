<?php

class Job_N_Work extends Job_Abstract
{
    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'n.work';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'process';

    public static $keys = [
        'work.process',
    ];

    protected function process($params)
    {
        // Config
        $config = Zend_Registry::get('config')->toArray();
        $confmail = $config['mail'];

        $m = Falcon_Mapper_N_Work::getInstance();
        $message = $params;

        // Reconnect to smtp server
        $transport = new Zend_Mail_Transport_Smtp(
            $confmail['config']['host'],
            $confmail['config']
        );
        if ($transport) {
            Zend_Mail::setDefaultTransport($transport);
        }

        // Process work
        $m->processWork($message);

        // Disconnect from smtp
        if (isset($message['type'])
            && ($message['type'] == 'email' ||
                $message['type'] == 'user')
        ) {
            if (Zend_Mail::getDefaultTransport()->getConnection()) {
                Zend_Mail::getDefaultTransport()->getConnection()
                    ->disconnect();
            }
        }
    }
}