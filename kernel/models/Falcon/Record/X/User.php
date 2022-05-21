<?php

/**
 * Table "x_user" record class
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_User extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_person',
        'login',
        'shortname',
        'api_key',
        'device_label_row_1',
        'device_label_row_2',
        'device_label_row_3',
        'device_label_position',
        'id_lang',
        'theme',
        'password',
        'point_count',
        'sync_time',
        'event_period_length',
        'need_password_change',
        'id_schedule',
        'mailhash',
        'role',
        'id_utc',
        'id_map_engine',
        'last_loader',
        'logined',
        'state'
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged'];


    /**
     * Table fields that should not leave Back-end.
     * When toArray is called, they are removed
     * @var String[]
     */
    public static $privateFields = ['password'];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_person',
            'alias' => 'person',
            'key' => 'id_person',
            'fields' => ['*']
        ],
        [
            'table' => 'x_utc',
            'alias' => 'utc',
            'key' => 'id_utc',
            'fields' => ['*']
        ],
        [
            'table' => 'x_schedule',
            'alias' => 'schedule',
            'key' => 'id_schedule',
            'fields' => ['*']
        ],
        [
            'table' => 'x_right_level_link_user',
            'alias' => 'right_level',
            'fields' => ['id_right_level'],
            'simple' => true
        ]
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        if (!$this->get('id_person')) {
            $person = new Falcon_Record_X_Person([
                'id_firm' => $this->get('id_firm'),
                'lastname' => '',
                'secondname' => '',
                'firstname' => '',
            ]);
            $person->insert();
            $this->set('id_person', $person->getId());
        }

        if (!$this->get('id_schedule')) {
            $schedule = new Falcon_Record_X_Schedule();
            $schedule->insert();
            $this->set('id_schedule', $schedule->getId());
        }

        parent::insert();

        // Set default notice setting values
        $m = Falcon_Mapper_X_Notice::getInstance();
        $m->setUserSetting('balance_limit', 'High', $this->get('id'));
        $m->setUserSetting('monthly_act', 'High', $this->get('id'));
        $m->setUserSetting('balance_change', 'High', $this->get('id'));
        return $this;
    }
}
