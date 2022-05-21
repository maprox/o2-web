<?php

/**
 * Abstract groups controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
abstract class Falcon_Controller_Groups extends Falcon_Controller_Action
{
    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     *
     * Temporarily skip access check
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

    /**
     * Алиас экземпляра группируемых объектов
     * @var {String}
     */
    protected $_objectAlias;

    /*
     * Получение алиаса экземпляра группируемых объектов
     * @param {Boolean} $lowercase Алиас со строчной буквы
     * @return {String} Алиас
     */
    public function getObjectAlias($lowercase = false, $plural = false)
    {
        if ($this->_objectAlias === null)
            // Предполагается, что множественное число - это единственное + 's'
            // Если где-то будет не так, здесь это надо учитывать
            // 'Groupobjects' >>> 'Object'
            $this->_objectAlias = ucfirst(substr($this->getClassAlias(), 5, -1));
        $alias = $this->_objectAlias;
        if ($lowercase) {
            $alias = strtolower($alias);
        }
        if ($plural) {
            $alias .= 's';
        }
        return $alias;
    }

    /**
     * load
     */
    public function loadAction()
    {
        $this->sendAnswer($this->get());
    }

    /**
     * Loads an array of objects
     * @return Falcon_Message
     */
    public function get()
    {
        $m = new Falcon_Model_Manager();
        $method = 'loadGroup' . $this->getObjectAlias(true, true);
        return $m->$method();
    }

    /**
     * set
     */
    public function setAction()
    {
        $data = json_decode($this->_getParam('data'));
        $answer = new Falcon_Message();
        if (!isset($data->id)) {
            return $this->sendAnswer($answer->error(4042));
        }
        $className = 'Falcon_Model_Group_' . $this->getObjectAlias();
        $group = new $className($data->id);
        if (!empty($data->name)) {
            $answer->append($group->rename($data->name));
        }
        if (isset($data->objects) && is_array($data->objects)) {
            $answer->append($group->setObjects($data->objects));
        }
        if (isset($data->shared) && is_array($data->shared)) {
            $answer->append($group->setSharedObjects($data->shared));
        }
        if (isset($data->shared) && is_array($data->shared) &&
            isset($data->objects) && is_array($data->objects)
        ) {
            $group->setNewAccess($data->objects, $data->shared);
        }
        $this->sendAnswer($answer);
    }

    /**
     * add
     */
    public function addAction()
    {
        $data = json_decode($this->_getParam('data'));
        $answer = new Falcon_Message();
        if (!empty($data->name)) {
            $className = 'Falcon_Model_Group_' . $this->getObjectAlias();
            $group = new $className();
            $answer->append($group->create($data->name));
            $group->setField('owner', Falcon_Model_User::getInstance()->getId());
            if (isset($data->objects) && is_array($data->objects))
                $answer->append($group->setObjects($data->objects));
            if (isset($data->shared) && is_array($data->shared))
                $answer->append($group->setSharedObjects($data->shared));
        }
        $this->sendAnswer($answer);
    }

    /**
     * remove
     */
    public function removeAction()
    {
        $data = json_decode($this->_getParam('data'));
        $answer = new Falcon_Message();
        if (!isset($data->id))
            return $this->sendAnswer($answer->error(4042));
        $className = 'Falcon_Model_Group_' . $this->getObjectAlias();
        $group = new $className($data->id);
        $answer->append($group->deleteObject());
        $this->sendAnswer($answer);
    }
}
