<?php

/**
 * Utility class for future use
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
abstract class Falcon_Action_Abstract
{
    /**
     * Adapter, stored for transactions
     * @cfg {Zend_Db_Adapter}
     */
    protected static $db;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Empty, needed for future use
    }

    /**
     * Returns short name of Action object, used for cache
     * @return {String}
     */
    protected function getActionName()
    {
        $model = get_called_class();
        $model = preg_replace('/^falcon_action_+/ui', '', $model);

        return strtolower($model);
    }

    /**
     * Gets cached data
     * @param {String} idString cache item id
     * @return Mixed
     */
    protected function getCached($idString)
    {
        return Falcon_Cacher::getInstance()
            ->get($this->getActionName(), $idString);
    }

    /**
     * Sets cached data
     * @param {Mixed} data
     * @param {String} idString cache item id
     */
    protected function setCached($data, $idString)
    {
        Falcon_Cacher::getInstance()->set($data, $this->getActionName(),
            $idString);
    }

    /**
     * Drops cached data
     * @param {String} idString cache item id
     * @return Mixed
     */
    protected function dropCached($idString)
    {
        Falcon_Cacher::getInstance()->drop($this->getActionName(), $idString);
    }

    /**
     * Starts DB transaction
     */
    public static function startTransaction()
    {
        self::$db = Zend_Db_Table::getDefaultAdapter();
        self::$db->beginTransaction();
        Falcon_Sender_Queue::setTransaction(true);
    }

    /**
     * Rollback DB transaction
     */
    public static function rollbackTransaction()
    {
        self::$db->rollBack();
        Falcon_Sender_Queue::setTransaction(false);
        Falcon_Sender_Queue::clearPendingMessages();
    }

    /**
     * Commit DB transaction
     */
    public static function commitTransaction()
    {
        self::$db->commit();
        Falcon_Sender_Queue::setTransaction(false);
        Falcon_Sender_Queue::processPendingMessages();
    }
}
