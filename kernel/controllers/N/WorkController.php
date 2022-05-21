<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Rest controller
 */
class N_WorkController extends Falcon_Controller_Action_Rest
{
    /**
     * remove
     */
    public function removeAction()
    {
        $answer = new Falcon_Message();
        $data = $this->getJsonData();
        if (!isset($data->id)) {
            return $answer->error(4042, [
                'Please, specify work id']);
        }
        $userId = Falcon_Model_User::getInstance()->getId();
        $m = Falcon_Mapper_N_Work::getInstance();
        $list = [$data->id];
        if (is_array($data->id)) {
            $list = $data->id;
        }
        if (empty($list)) {
            return $answer;
        }
        $works = $m->load([
            'id in (?)' => $list,
            'send_to = ?' => $userId . ''
        ]);
        foreach ($works as $work) {
            $work->setDone();
        }
        return $answer;
    }
}