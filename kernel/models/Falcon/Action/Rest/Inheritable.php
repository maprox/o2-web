<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 */
class Falcon_Action_Rest_Inheritable extends Falcon_Action_Rest_Common
{
    /**
     * If given, inherits from that action
     * @var String
     */
    protected $inherited = false;

    /**
     * Returns entity name
     * @param {boolean} $actual redundant, used in children
     * @return string
     */
    public function getEntityName()
    {
        return $this->inherited ? $this->inherited : parent::getEntityName();
    }

    /**
     * Returns entity name
     * @return string
     */
    public function getActualEntityName()
    {
        return parent::getEntityName();
    }

    /**
     * Returns entity join key
     * @return string
     */
    protected function getInheritedJoinKey()
    {
        $rClass = 'Falcon_Record_' . $this->getActualEntityName();
        return $rClass::$inheritJoinKey;
    }

    /**
     * Returns additional fields
     * @return string
     */
    protected function getExtendedFields()
    {
        $rClass = 'Falcon_Record_' . $this->getActualEntityName();
        return $rClass::$extendedFields;
    }

    /**
     * Returns record instance of current entity
     * @return Falcon_Record_Abstract
     */
    public function getActualEntityRecord($primaryKey = null)
    {
        $rClass = 'Falcon_Record_' . $this->getActualEntityName();
        return new $rClass($primaryKey);
    }

    /**
     * Creates helper for access checking
     * @return {Falcon_Action_Rest_Helper_Access}
     */
    protected function createAccessHelper()
    {
        $id = $this->getParam('id', false);
        $access = new Falcon_Action_Rest_Helper_Access(
            $this->getActualEntityName(), $id);
        if ($id) {
            $access->setRecord($this->getActualEntityRecord($id));
        }
        return $access;
    }

    /**
     * Creates helper for history writing
     * @return {Falcon_Action_Rest_Helper_History}
     */
    protected function createHistoryHelper()
    {
        return new Falcon_Action_Rest_Helper_History(
            $this->getActualEntityName(),
            $this->getParam('id', false)
        );
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryListSql($sql, $data)
    {
        if ($this->inherited) {
            $sql->join(
                ['inh' => strtolower($this->getActualEntityName())],
                't.id = inh.' . $this->getInheritedJoinKey(),
                $this->getExtendedFields()
            );
        }
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryItemSql($sql, $data)
    {
        if ($this->inherited) {
            $sql->join(
                ['inh' => strtolower($this->getActualEntityName())],
                't.id = inh.' . $this->getInheritedJoinKey(),
                $this->getExtendedFields()
            );
        }
    }

    /**
     * Create instance
     * @param type $c
     */
    public function onAfterCreate($c)
    {
        if ($this->inherited) {
            // let's add actual record
            $r = $this->getActualEntityRecord();
            $this->instanceCreateJoinedItems($r);
            foreach ($r->getFields(false) as $field) {
                $r->set($field, $this->getParam($field));
            }
            $r->set($this->getInheritedJoinKey(), $c->getId());

            if ($c->getTrigger('logged') && $r->getTrigger('logged')) {
                // The same updates as for parent
                $r->getTrigger('logged')->setForceUsers(
                    $c->getTrigger('logged')->getLastUsers()
                );
            }
            $r->insert();
        }

        return $r->toArray();
    }

    /**
     * Create instance
     * @param type $c
     */
    public function onAfterUpdate($c)
    {
        if ($this->inherited) {
            // let's update actual record
            $r = $this->getActualEntityRecord($c->getId());
            $this->instanceCreateJoinedItems($r);
            foreach ($r->getFields(false) as $field) {
                $value = $this->getParam($field, $r->get($field));
                $r->set($field, $value);
            }
            if ($c->getTrigger('logged') && $r->getTrigger('logged')) {
                // The same updates as for parent
                $r->getTrigger('logged')->setForceUsers(
                    $c->getTrigger('logged')->getLastUsers()
                );
            }
            $r->update();
        }

        return $r->toArray();
    }

    /**
     * Actions to perform after deleting instance
     * @param type $c
     */
    protected function onAfterDelete($c)
    {
        // Trash actual entity record. It should not have state
        // so just triggers will be executed.
        // Because we need an appropriate entry in updates table
        $r = $this->getActualEntityRecord($c->getId());
        if ($c->getTrigger('logged') && $r->getTrigger('logged')) {
            // The same updates as for parent
            // The users for updates can not be requested
            // because column id_firm does not exists. Set them manually
            $r->getTrigger('logged')->setForceUsers(
                $c->getTrigger('logged')->getLastUsers()
            );
        }

        $r->trash();

        return true;
    }
}