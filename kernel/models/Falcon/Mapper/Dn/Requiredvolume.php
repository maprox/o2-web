<?php

/**
 * Class of requiredvolume mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Requiredvolume extends Falcon_Mapper_Common
{
    /**
     * Insert new record to the table
     * @param instanceof Falcon_Record_Abstract $record New record
     * @return Integer Identifier of new record
     */
    public function insertRecord(Falcon_Record_Abstract $record)
    {
        $lastNum = $this->getLastNum($record->get('id_firm'));
        $record->set('num', $lastNum + 1);
        return parent::insertRecord($record);
    }

    /**
     * Get last num for firm by identifier
     * @param Integer $firmId Firm identifier
     * @return Integer Last code for firm
     */
    public function getLastNum($firmId)
    {
        return $this->getTable()->queryLastNum($firmId);
    }
}