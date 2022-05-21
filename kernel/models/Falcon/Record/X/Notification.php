<?php

/**
 * Table "x_notification" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Notification extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'name',
        'id_type',
        'id_importance',
        'id_schedule',
        'message_0',
        'message_1',
        'note',
        'state'
    ];

    /**
     * Required fields
     * @var String[]
     */
    public static $requiredFields = [
        'name'
    ];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_type' => [
            // access mapper config
            'x_notification_type' => 'id',
            'fields' => [
                'name',
                'id_package'
            ]
        ],
        'id_importance' => [
            // access mapper config
            'x_notification_importance' => 'id',
            'fields' => [
                'name'
            ]
        ]
    ];


    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_schedule',
            'alias' => 'schedule',
            'key' => 'id_schedule',
            'fields' => ['*']
        ],
        [
            'table' => 'x_notification_param',
            'alias' => 'params',
            'fields' => ['name', 'value']
        ],
        [
            'table' => 'x_notification_action',
            'alias' => 'actions',
            'fields' => ['id', 'id_action_type', 'activate_state', 'state']
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Notification default messages
     * @var array
     */
    /*public $messages = array(
        // mon_geofence_inout
        '1' => array(
            'message_0' =>
"%DEVICE% left the geofence %ZONE% at %TIME% near %ADDRESS%.
Its speed was %SPEED% kph.",
            'message_1' =>
"%DEVICE% entered the geofence %ZONE% at %TIME% near %ADDRESS%.
Its speed was %SPEED% kph."
        ),
        // mon_overspeed
        '2' => array(
            'message_0' => '',
            'message_1' => ''
        ),
        // mon_alarm_button
        '3' => array(
            'message_0' => '',
            'message_1' => ''
        ),
        // mon_connection_loss
        '4' => array(
            'message_0' => "%DEVICE% losed connection at %TIME%
near %ADDRESS%. Its speed was %SPEED% kph.",
            'message_1' => "%DEVICE% restored connection at %TIME%
near %ADDRESS%. Its speed was %SPEED% kph.",
        )
    );*/

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('id_schedule')) {
            $schedule = new Falcon_Record_X_Schedule();
            $schedule->insert();
            $this->set('id_schedule', $schedule->getId());
        }

        // notification default messages
        $t = Zend_Registry::get('translator');
        $type = $this->get('id_type');
        if (!$type) {
            $type = 1;
            $this->set('id_type', $type);
        }

        // Get alias by type id
        $record = new Falcon_Record_X_Notification_Type($type);
        $typeAlias = $record->get('alias');

        // Load messages
        $m = Falcon_Mapper_X_Notification_Message::getInstance();
        $messages = $m->loadBy(function ($sql) use ($typeAlias) {
            $sql->where('alias = ?', $typeAlias);
        });

        // Translate and sort messages
        $msgMap = [];
        foreach ($messages as $message) {
            $msgMap['message_' . $message['num']] = [];
            $msgMap['message_' . $message['num']]['text'] =
                $t['zt']->_($message['text']);
        }

        for ($i = 0; $i < 2; $i++) {
            $field = 'message_' . $i;
            $value = $this->get($field);
            if (empty($value) && isset($msgMap[$field])) {
                $this->set($field, $msgMap[$field]['text']);
            }
        }

        return parent::insert();
    }

}
