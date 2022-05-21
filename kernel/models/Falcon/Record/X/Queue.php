<?php

/**
 * Table "x_queue" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Queue extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'dt',
        'start_dt',
        'channel',
        'message',
        'state'
    ];
}
