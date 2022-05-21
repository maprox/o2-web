<?php

/**
 * Class of "sdesk_issue" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Sdesk_Issue extends Falcon_Mapper_Common
{
    private $sqlNextNum = 'select nextval(?) as num';

    /**
     * Returns next available number for issue
     * @param type $firmId
     * @return int
     */
    public function getNextNum($firmId)
    {
        $sequenceName = 'sdesk_issue_num_seq_' . $firmId;
        $result = $this->getTable()->query($this->sqlNextNum, $sequenceName);
        return $result[0]['num'];
    }

}