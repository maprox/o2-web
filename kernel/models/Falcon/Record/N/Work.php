<?php

/**
 * Class of tariff option table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_N_Work extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_notification_action_type',
        'id_object',
        'callback',
        'message',
        'params',
        'remaining',
        'waiting',
        'send_to',
        'state',
        'dt',
        'id_firm',
        'id_user',
        'amount'
    ];

    public function execute()
    {
        // Get action type
        $actionType = new Falcon_Record_N_Notification_Action_Type(
            $this->get('id_notification_action_type'));
        $actionClass = $actionType->get('identifier');

        if (strlen($actionClass) == 0) {
            return new Falcon_Message();
        }
        // Get action
        $action = Falcon_Notification_Factory::createInstance(
            $actionClass,
            $this // Work
        );
        if ($action === null) {
            return new Falcon_Message();
        }

        // execute action
        $response = $action->execute();
        if ($this->get('callback')) {
            $class = 'Falcon_Action_Callback_' . $this->get('callback');
            $exists = class_exists_warn_off($class);
            if ($exists) {
                // TODO: not very good callback initialization
                // Why do we need id_object column if we have params column?
                $callback = new $class($this->get('id_object'));
                $callback->setWork($this);
                $callback->process($response);
            }

            if (!$exists || $callback->isFinished()) {
                $this->set('callback', '');
            }
        }

        if ($response->isDelivered()) {
            return $this->setDone();
        } elseif ($response->isFailure()) {
            return $this->setError($response->getErrorMessage());
        }
        return $this;
    }

    /**
     * Migrate fn
     * @return this
     */
    public function setDone()
    {
        return $this
            ->set('state', Falcon_Record_Abstract::STATE_DELETED)
            ->update();
    }

    /**
     *
     * @param string $message
     * @return this
     */
    public function setError($message)
    {
        // temporarily set done without storing error message
        return $this->setDone();
    }

    /**
     * Returns true is work is waiting for completion
     * @return Boolean
     */
    public function isWaiting()
    {
        return ($this->get('state') == Falcon_Record_Abstract::STATE_INACTIVE);
    }

    /**
     * Set work status WAIT
     * @return Falcon_Message
     */
    public function setWaiting()
    {
        return $this
            ->set('state', Falcon_Record_Abstract::STATE_INACTIVE)
            ->update();
    }

    /**
     * Migrate fn
     * @param String $key
     * @param Mixed $value
     * @return this
     */
    public function setField($key, $value)
    {
        return $this->set(strtolower($key), $value)->update();
    }

    public function getParam($key)
    {
        $params = json_decode($this->get('params'));
        return isset($params->$key) ? $params->$key : null;
    }

    /**
     * Returns owner user object
     *
     * @return Falcon_Model_User
     */
    public function getUser()
    {
        $userId = $this->get('id_user');
        return ($userId) ? new Falcon_Model_User($userId) : null;
    }
}
