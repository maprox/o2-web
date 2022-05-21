<?php

/**
 * Table "x_group_item_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Group_Item_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_group',
        'id_item'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    public static $primaryKey = ['id_group', 'id_item'];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id_group';
}
