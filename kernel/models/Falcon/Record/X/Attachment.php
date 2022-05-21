<?php

/**
 * Table "x_attachment" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Attachment extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'file',
        'size',
        'hash',
        'mime',
        'dt',
        'state'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = [
        'id'
    ];

    /**
     * Parent table link field name
     * @var string
     */
    public static $parentFieldLink = 'id';
}
