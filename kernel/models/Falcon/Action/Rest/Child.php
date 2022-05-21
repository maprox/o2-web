<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 */
class Falcon_Action_Rest_Child extends Falcon_Action_Rest_Common
{
    /**
     * Parent table config
     * @var type
     */
    public static $parentConfig = [];

    /**
     * Creates helper for access checking
     * @return {Falcon_Action_Rest_Helper_Access}
     */
    protected function createAccessHelper()
    {
        $cfg = static::$parentConfig;
        if (empty($cfg)) {
            return parent::createAccessHelper();
        }

        $access = new Falcon_Action_Rest_Helper_Access(current($cfg));
        $id = $this->getParam('id', false);

        if ($id) {
            $record = $this->getEntityRecord($id);
            if (!empty($record) && $record->get(key($cfg))) {
                $parentClass = 'Falcon_Record_' . ucwords_custom(current($cfg));
                $parent = new $parentClass($record->get(key($cfg)));

                $access->setRecord($parent);
                $access->setId($parent->getId());
            }
        }
        return $access;
    }
}
