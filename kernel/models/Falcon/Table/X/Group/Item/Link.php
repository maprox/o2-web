<?php

/**
 * Table "x_group_item_link"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_X_Group_Item_Link extends Falcon_Table_Common
{
    /**
     * Removes item from all groups
     * @param $itemId
     * @param $alias Alias of group table (e.g. x_group_mon_device)
     */
    /*public function removeItemFromAllGroups($itemId, $alias)
    {
        return $this->query(
            'delete from x_group_item_link where id_item = ? and id_group IN('
            . 'select id from ' . $alias . ')',
            $itemId
        );
    }*/

    /**
     * Removes item from all groups
     * @param Integer $itemId Item id
     * @param Integer[] $groups Groups ids
     */
    public function removeItemFromGroups($itemId, $groups)
    {
        return $this->query(
            'delete from x_group_item_link where id_item = ? and id_group IN('
            . implode(', ', $groups) . ')',
            $itemId
        );
    }
}