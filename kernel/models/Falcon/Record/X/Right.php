<?php

/**
 * Class of right table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Record_X_Right extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'description',
        'alias',
        'state',
        'type',
        'service'
    ];
}
