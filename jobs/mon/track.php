<?php

class Job_Mon_Track extends Job_Abstract
{
    const
        MAX_LAUNCHES = 5,
        PAUSE_PERIOD = 600;

    /**
     * Should have single instance for each key
     * @var {Boolean}
     */
    public static $isSingle = true;

    /**
     * Channel name
     * @var {String}
     */
    protected $channel = 'mon.track';
    /**
     * Method name
     * @var {String}
     */
    protected $method = 'create';

    public static $keys = [
        'check.onpacket',
        'create.onpacket',
    ];

    /**
     * Methods for keys
     * @var {String[]|false}
     */
    protected $keysMethod = [
        'check.onpacket' => 'check'
    ];

    /**
     * Checks, if creation is needed
     * @param $params
     */
    protected function check($params)
    {
        $device = (int)$params['device'];

        $locker = Falcon_Locker::getInstance();
        if ($locker->isLocked('write_track', $device)) {
            return;
        }

        // unlock нигде не вызывается - это специально.
        // Поскольку lock вызывается с false ввиде третьего аргумента, умирать никто не будет,
        // просто до завершения unlock time периода нельзя создавать новые таски
        $locker->lock('write_track', $device, false);

        Falcon_Amqp::sendTo('mon.track', 'create.onpacket',
            ['device' => $device]);
    }

    /**
     * Performs new item creation
     * @param $params
     */
    protected function create($params)
    {
        $device = $params['device'];

        $startDate = Falcon_Mapper_Mon_Track::getInstance()
            ->getEdtForDevice($device);
        $launches = 0;
        while ($startDate !== false && ++$launches <= self::MAX_LAUNCHES) {
            $worker = new Falcon_Action_Calculate_Mon_Track($device, $startDate);
            $startDate = $worker->process();
        }

        Falcon_Mapper_Mon_Track::getInstance()
            ->recalculateActualOdometer($device);
    }
}