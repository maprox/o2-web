<?php

/**
 * Logged record trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Logged extends Falcon_Record_Trigger_Abstract
{
    /**
     * If defined, overrides class name in curator name
     * @var String
     */
    protected $alias = false;

    /**
     * Users that also need to be included in updates
     * @var Integer[]
     */
    protected $additionalUsers = [];

    /**
     * If not empty any other users will be ingnored
     * @var Integer[]
     */
    protected $forceUsers = [];

    /**
     * Users ids of last added updates
     * @var Integer[]
     */
    protected $lastUsers = [];

    /**
     * If true changes for update check will be ignored
     * @var type
     */
    protected $ignoreChangesForUpdate = false;

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doAfterInsert($record)
    {
        $this->writeUpdateTable($record);
    }

    protected function doAfterUpdate($record)
    {
        $this->writeUpdateTable($record);
    }

    protected function doAfterDelete($record)
    {
        $this->writeUpdateTable($record);
    }

    protected function doAfterTrash($record)
    {
        $this->writeUpdateTable($record);
    }

    /**
     * Set additional users
     * @param Integer[] $users
     */
    public function setAdditionalUsers($users = [])
    {
        $this->additionalUsers = $users;
    }

    /**
     * Get additional users
     * @return type
     */
    public function getAdditionalUsers()
    {
        return $this->additionalUsers;
    }

    /**
     * Set force users list
     * @param Integer[] $users
     */
    public function setForceUsers($users = [])
    {
        $this->forceUsers = $users;
    }

    /**
     * Get force users list
     */
    public function getForceUsers()
    {
        return $this->forceUsers;
    }

    /**
     * Set last users
     * @param Integer[] $users
     */
    protected function setLastUsers($users = [])
    {
        $this->lastUsers = $users;
    }

    /**
     * Get last users
     */
    public function getLastUsers()
    {
        return $this->lastUsers;
    }

    /**
     * Ignore changes for update setter
     * @param type $ignore
     */
    public function setIgnoreChangesForUpdate($ignore)
    {
        $this->ignoreChangesForUpdate = $ignore;
    }

    /**
     * Insert data into [updates] table
     */
    public function writeUpdateTable($record)
    {
        $logger = Falcon_Logger::getInstance();
        $alias = empty($this->params['alias']) ?
            $record->getTableName() :
            strtolower($this->params['alias']);

        //$logger->log('zend', 'wirteUpdateTable: ' . $alias);
        try {
            $changesForUpdate = $record->getChangesForUpdate();

            if (empty($changesForUpdate) && !$this->ignoreChangesForUpdate) {
                return true;
            }

            // Get entity id for updates entry
            if (!$record->isSimpleId()) {
                $logger->log('warn',
                    'Trying to write updates for record with ' .
                    'no simple id: ' . $alias
                );

                return true;
            }

            // Define users for updates
            $forceUsers = $this->getForceUsers();
            if (!empty($forceUsers)) {
                $users = $forceUsers;
            } else {
                $users = array_values(
                    array_unique(
                        array_merge(
                            $record->getMapper()->getUsersByObject($record),
                            $this->getAdditionalUsers()
                        )
                    )
                );
            }

            Falcon_Action_Update::add([
                'alias' => $alias,
                'id_operation' => $record->getLastOperation(),
                'id_entity' => $record->getId(),
                'id_user' => $users,
            ]);

            // Save last used users
            $this->setLastUsers($users);
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