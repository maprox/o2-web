<?php

/**
 * Class of "x_guid" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Guid extends Falcon_Mapper_Common
{
    /**
     * Returns object by it's guid
     * @param guid
     * @return Record
     */
    public function getByGuid($guid)
    {
        $logger = Falcon_Logger::getInstance();
        $records = $this->load(['guid = ?' => $guid]);

        if (empty($records)) {
            return null;
        }

        $entityData = $records[0];

        $recordName = 'Falcon_Record_'
            . ucwords_custom($entityData->get('entity_table'));

        $record = new $recordName($entityData->get('entity_id'));

        return $record;
    }
}