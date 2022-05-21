<?php

/**
 * Class of package table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_N_Work extends Falcon_Table_Common
{
    public function loadByUser($userId)
    {
        return $this->loadBy(function ($sql) use ($userId) {
            $sql
                ->where("send_to = ?::text", $userId)
                ->where("id_notification_action_type = ?", 1)// popup
                ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED);
        }, ['fields' => ['id', 'dt', 'params', 'message']]);
    }
}