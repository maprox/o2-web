<?php

/**
 * Common group operations notification class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Notification_Group_Remove
    extends Falcon_Notification_Group_Common
{
    /**
     * Method applies on x_group_item_link record
     * @var type
     */
    public $method = 'delete';

    /**
     * Check x_group_item_link record to execute $method or not
     * @param $r
     */
    protected function checkLinkRecord($r)
    {
        return $r->isLoaded();
    }
}