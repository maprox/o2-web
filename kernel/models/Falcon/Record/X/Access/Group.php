<?php

/**
 * Table "x_access_group" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Access_Group extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_user',
        'id_object',
        'writeable',
        'shared',
        'id_firm',
        'sdt',
        'edt'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_user', 'id_firm',
        'id_object', 'sdt'];
}
