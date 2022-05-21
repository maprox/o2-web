<?php

/**
 * Action "x_notification" abstract event
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification_Abstract
{
    /**
     * Notification params
     * @var type
     */
    public $params = [];

    /**
     * Notification types aliases
     * @var array
     */
    private static $notification_types = [
        1 => 'mon_geofence_inout',
        2 => 'mon_overspeed',
        3 => 'mon_alarm_button',
        4 => 'mon_connection_loss',
        5 => 'mon_sensor_control',
        6 => 'mon_signal_loss'
    ];

    /**
     * Notififcation types that ignores packet state
     * and executes on each state
     * @var array
     */
    public static $ignoreStateTypes = [6];

    /**
     * Returns an instance of event handler class by
     * notification type identifier
     * @param int $typeId Notification type identifier
     * @return Falcon_Action_X_Notification_Abstract
     */
    public static function getInstance($typeId)
    {
        if (isset(static::$notification_types[$typeId])) {
            $name = ucwords_custom(strtolower(
                static::$notification_types[$typeId]), '_');
            $CLASS = 'Falcon_Action_X_Notification_' . $name;
            return new $CLASS();
        }
        return null;
    }


    /**
     * Return param value by notificationId and $param name
     * @param int $notificationId notification id
     * @param string $paramName Param name
     */
    public function getParamValue($notificationId, $paramName)
    {
        $logger = Falcon_Logger::getInstance();
        if (empty($this->params)) {
            $m = Falcon_Mapper_X_Notification_Param::getInstance();
            $params = $m->loadBy(function ($sql) use ($notificationId) {
                $sql->where('id_notification = ?', $notificationId)
                    ->where('state = 1');
            });

            foreach ($params as $param) {
                $this->params[$param['name']] = $param['value'];
            }
        }

        //$logger->log('zend', $this->params);

        if (!isset($this->params[$paramName])) {
            return null;
        }
        return $this->params[$paramName];
    }

    /**
     * Returns an array of notification params
     * according to supplied input params
     * @param array $record Notification record
     * @param array $input
     * @return array
     */
    public function getNotificationParams($record, $input)
    {
        return [];
    }

    /**
     * Returns next state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStateNext($record, &$input)
    {
        return 0;
    }

    /**
     * Returns previous state of notification with supplied params
     * @param array $record Notification record
     * @param array $input
     * @return int
     */
    public function getStatePrev($record, $input)
    {
        $ns = Falcon_Mapper_X_Notification_State::getInstance();
        $result = $ns->loadBy(function ($sql) use ($record, $input) {
            $sql
                ->where('id_notification = ?', $record['id'])
                ->where('param = ?', $input['statehash'])
                ->where('dt < ?', $input['statetime'])
                ->order('dt desc')
                ->limit(1);
        }, ['fields' => ['state']]);
        return empty($result) ? 0 : $result[0]['state'];
    }

    /**
     * Returns true if states are equal
     * @param int $stateNext
     * @param int $statePrev
     * @return bool
     */
    public function statesAreEqual($stateNext, $statePrev)
    {
        $logger = Falcon_Logger::getInstance();
        /*$logger->log(
            'zend',
            ($stateNext === $statePrev) ? '>>>>eq true' : '>>>>>eq false'
        );*/
        return ($stateNext === $statePrev);
    }

    /**
     * Update notification state with supplied state
     * @param array $record Notification record
     * @param array $input
     * @param int $state
     */
    public function updateState($record, $input, $state)
    {
        $ns = new Falcon_Record_X_Notification_State([
            'id_notification' => $input['id_notification'],
            'param' => $input['statehash'],
            'dt' => $input['statetime'],
            'state' => $state
        ]);
        // spike-nail for notification insert issue
        try {
            $ns->insert();
        } catch (Exception $E) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('error', $E->getMessage());
        }

        // let's create notification works
        if ($this->allowCreateWorks($record, $input, $state)) {
            $this->createWorks($record, $input, $state);
        }
    }

    /**
     * Check if creation of notification works allowed
     * @param array $record Notification record
     * @param array $input
     * @param int $state
     * @return boolean
     */
    protected function allowCreateWorks($record, $input, $state)
    {
        return true;
    }

    /**
     * Returns notification state data
     * @param array $record Notification record
     * @param array $input
     * @param int $state
     * @return string
     */
    public function getStateData($record, $input, $state)
    {
        $fieldName = 'message_' . $state;
        $fmt = isset($record[$fieldName]) ?
            $record[$fieldName] : 'Unknown field: ' . $fieldName;
        $data = ['message' => $this->getMessage($fmt, $input)];
        if (isset($input['packet'])) {
            $data['mon_packet'] = $input['packet']->getId();
        }
        if (isset($input['mon_geofence'])) {
            $data['mon_geofence'] = $input['mon_geofence'];
        }
        if (isset($input['mon_device'])) {
            $data['mon_device'] = $input['mon_device'];
        }
        return json_encode($data);
    }

    /**
     * Create works for notification
     * @param array $record Notification record
     * @param array $input
     * @param int $state
     */
    public function createWorks($record, $input, $state)
    {
        $logger = Falcon_Logger::getInstance();
        // let's get notification author
        $n = new Falcon_Record_X_Notification($input['id_notification']);

        // get user, who has created this notification
        $opCreateId = Falcon_Record_X_History::OPERATION_CREATE;
        $input['id_user'] = $n->getHistoryInfo($opCreateId, 'id_user');
        $user = new Falcon_Model_User($input['id_user']);

        $m = Falcon_Mapper_X_Notification_Action::getInstance();
        $actions = $m->loadBy(function ($sql) use ($record, $state) {
            $sql
                ->where('id_notification = ?', $record['id'])
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                // load actions only with corresponding activate state
                ->where('activate_state = ?', (int)$state);
        });
        foreach ($actions as $action) {
            $actionManager
                = Falcon_Notification_Action_Factory::createInstance($action);
            $actionManager->createNotifWorks($record, $input, $state, $user);
        }
    }

    /**
     * Returns true if passes type of notification is alarm button
     *
     * @param int $type
     * @return bool
     */
    public static function isAlarmButtonType($type)
    {
        if (!empty(self::$notification_types[$type])) {
            return self::$notification_types[$type] === 'mon_alarm_button';
        }
        return false;
    }
}
