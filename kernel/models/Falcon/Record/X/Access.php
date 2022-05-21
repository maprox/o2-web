<?php

/**
 * Table "x_access" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Access extends Falcon_Record_Abstract
{
    // State values
    const
        STATUS_ACTIVE = 1,
        STATUS_PENDING = 2,
        STATUS_REJECTED = 3;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_user',
        'id_firm',
        'id_object',
        'right',
        'writeable',
        'shared',
        'auto',
        'sdt',
        'edt',
        'status'
    ];

    /**
     * Table fields which are a part of primary key
     * @var String[]
     */
    //public static $primaryKey = array('id_user', 'id_firm',
    //	'id_object', 'right', 'sdt');

    public static $primaryKey = ['id'];

    /**
     * Send share confirmation request
     * @param $object Object that
     */
    public function confirmationRequest($object)
    {
        $owner = Falcon_Model_User::getInstance();
        $logger = Falcon_Logger::getInstance();

        $m = Falcon_Mapper_X_User::getInstance();

        $notifyUsers = [];
        if ($this->get('id_user')) {
            $notifyUsers[] = $this->get('id_user');
        }

        if ($this->get('id_firm')) {
            $firmUsers = $m->getFirmUsersByRight(
                $this->get('id_firm'),
                $this->get('right'),
                Falcon_Access_Abstract::ACCESS_WRITE
            );

            foreach ($firmUsers as $user) {
                $notifyUsers[] = $user['id'];
            }
        }

        // Trying to get object name
        $objectName = $object->get('name');

        // Create confirmation popups for this users
        $mnw = Falcon_Mapper_N_Work::getInstance();
        foreach ($notifyUsers as $userId) {
            $mnw->add('share', [
                'send_to' => $userId,
                'message' => $this->get('id'),
                'params' => [
                    'type' => 'share_confirm',

                    'alias' => $this->get('right'),
                    'access_id' => $this->get('id'),
                    'name' => $objectName
                ],
                'id_user' => $owner->get('id') // Store owner in id_user column
            ]);
        }
    }

    /**
     * Notifies firm users about access operation
     * @param string $action
     * @param int $userId Specify owner
     */
    public function notify($action = null, $userId = null)
    {
        $logger = Falcon_Logger::getInstance();
        if ($action == null) {
            return;
        }

        if ($this->get('id_firm')) {
            $owner = Falcon_Model_User::getInstance();
            if ($userId) {
                $owner = new Falcon_Model_User($userId);
            }

            $firmId = $this->get('id_firm');
            $firm = new Falcon_Model_Firm($firmId);
            $users = $firm->getFirmUsers();

            foreach ($users as $user) {
                // View shared device right check
                if (!$user->hasRight('view_shared_for_firm')) {
                    continue;
                }

                // Email existance check
                if (!$user->getEmail()) {
                    continue;
                }

                // Data for template
                $data = $this->toArray();

                //Correct sdt and edt depending on user time zone
                $data['sdt'] = $user->correctDate($data['sdt'], false);
                if ($data['edt']) {
                    $data['edt'] = $user->correctDate($data['edt'], false);
                }
                // Owner data
                $data['owner_data'] = [];
                $data['owner_data']['shortname'] = $owner->get('shortname');

                // User data
                $data['user_data'] = [];
                $data['user_data']['firstname'] = $user->get('firstname');

                // Object data
                $data['object_data'] = [];
                // Get object data
                $recordClass = 'Falcon_Record_' . ucwords_custom($data['right']);
                $rec = new $recordClass($data['id_object']);
                if ($rec->get('name')) {
                    $data['object_data']['name'] = $rec->get('name');
                }

                $message = [
                    'type' => 'email',
                    'send_to' => $user->getEmail(),
                    'id_firm' => $owner->get('id_firm'),
                    'id_user' => $owner->getId(),
                    'params' => [
                        'template' => $action,
                        'data' => $data
                    ]
                ];
                Falcon_Amqp::sendTo('n.work', 'work.process', $message);
            }
        }
    }
}
