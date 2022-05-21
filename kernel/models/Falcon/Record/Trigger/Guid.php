<?php

/**
 * Guid trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Guid extends Falcon_Record_Trigger_Abstract
{
    /**
     * If defined, overrides class name in curator name
     * @var String
     */
    protected $alias = false;

    /**
     * Stores last inserted guid record
     * @var type
     */
    public $lastGuidRecord = null;

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doAfterInsert($record)
    {
        $this->createGuid($record);
    }

    /**
     * Insert data into [updates] table
     */
    public function createGuid($record)
    {
        $logger = Falcon_Logger::getInstance();
        $alias = empty($this->params['alias']) ?
            $record->getTableName() :
            strtolower($this->params['alias']);

        $this->lastGuidRecord = null;

        try {
            $guid = Falcon_Util::genGuid();
            $guidRecord = new Falcon_Record_X_Guid([
                'entity_table' => $alias,
                'entity_id' => $record->getId(),
                'guid' => $guid
            ]);

            $guidRecord->insert();

            // Set last guid record;
            $this->lastGuidRecord = $guidRecord;
        }
            // If there was an error during insert into "updates" table
            // we should not throw any exception here
        catch (PHPUnit_Framework_Exception $e) {
            throw $e;
        } catch (Exception $e) {
            $logger->log('error', $e);
        }
    }
}