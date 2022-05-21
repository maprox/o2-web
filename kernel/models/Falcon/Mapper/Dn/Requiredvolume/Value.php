<?php

/**
 * Requiredvolume value mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012 Maprox LLC
 */
class Falcon_Mapper_Dn_Requiredvolume_Value extends Falcon_Mapper_Common
{
    /**
     * Load requiredvolume items by requiredvolume identifier
     * @param Integer $requiredvolumeId Requiredvolume identifier
     * @param Boolean $toArray Export data to an array
     * @return Falcon_Record_Dn_Requiredvolume_Value[]/Array[]
     */
    public function loadByRequiredvolume($requiredvolumeId, $toArray = false)
    {
        $records = $this->getTable()->queryLoad($requiredvolumeId);
        $i = 0;
        foreach ($records as &$record) {
            if ($toArray) {
                $record['id'] = ++$i;
            } else {
                $record = new Falcon_Record_Dn_Requiredvolume_Value($record);
            }
        }
        return $records;
    }
}