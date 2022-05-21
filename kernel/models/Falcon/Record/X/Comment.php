<?php

/**
 * Table "x_comment" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Comment extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        id,
        id_parent,
        id_user,
        dt,
        message,
        id_source,
        source_raw_data,
        state
    ];
}
