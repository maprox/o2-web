<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 *
 * Rest controller
 */
class Mon_DeviceController extends Falcon_Controller_Action_Rest
{
    /**
     * url: /mon_device/configure
     * Creates task of device configuration
     */
    public function configureAction()
    {
        $data = $this->getJsonData();

        if (!isset($data->id)) {
            $answer = new Falcon_Message();
            return $answer->error(400, "Please, specify data.id");
        }

        // Rights check
        Falcon_Access::checkWrite('mon_device', $data->id);

        // ID check
        if (!isset($data->id)) {
            $answer = new Falcon_Message();
            return $answer->error(4042);
        }

        // Get device record
        $device = new Falcon_Record_Mon_Device($data->id);
        return Falcon_Action_Device_Configure::start($device);
    }

    /**
     * Returns settings by settins key
     */
    public function settingsbykeyAction()
    {
        $answer = new Falcon_Message();

        $key = $this->getParam('key');

        $m = Falcon_Mapper_Mon_Sim_Card::getInstance();

        $cards = $m->load([
            'settings_key = ?' => $key
        ]);

        if (!count($cards)) {
            return $answer;
        }

        $card = $cards[0];

        // Data for frontend
        $data = [
            'identifier' => $card->get('imei_tracker'),
            'phone' => $card->get('phone_number'),
            'protocol' => $card->get('id_device_protocol'),
            'provider' => $card->get('provider')
        ];

        $answer->addParam('data', $data);

        return $answer;
    }

    /**
     * url: /mon_device/checkuid
     * Checks if supplied uid is unique
     */
    public function checkuidAction()
    {
        // falcon answer
        $answer = new Falcon_Message();
        $answer->addParam('request', $this->getParam('request'));
        // input data
        $uid = $this->getParam('uid');
        // let's check uid
        if ($uid) {
            $m = Falcon_Mapper_Mon_Device::getInstance();
            $answer->addParam('exists', ($m->loadByUid($uid) !== null));
        }
        // send answer to the client
        return $answer;
    }

    /**
     * url: /mon_device/ownerinfo
     * Returns owner information
     */
    public function ownerinfoAction()
    {
        $answer = new Falcon_Message();
        $id = $this->getParam('id_device');
        if (!$id) {
            return $answer;
        }

        // Get current user
        $user = Falcon_Model_User::getInstance();
        $userId = $user->get('id');
        $firmId = $user->get('id_firm');

        if ($userId == -1) {
            return $answer->error(Falcon_Exception::ACCESS_VIOLATION);
        }

        $data = [
            'id_entity' => $id,
            'entity_table' => 'mon_device'
        ];

        $m = Falcon_Mapper_X_History::getInstance();
        $mxa = Falcon_Mapper_X_Access::getInstance();

        // Direct share
        $db = Zend_Db_Table::getDefaultAdapter();
        $records = $m->loadBy(function ($sql) use (
            $data, $db,
            $firmId, $userId
        ) {
            $sql->distinct()
                ->join(
                    ['u' => 'x_user'],
                    'u.id = t.id_user',
                    []
                )
                ->join(
                    ['p' => 'x_person'],
                    'p.id = u.id_person',
                    ['firstname', 'lastname']
                )
                ->join(
                    ['e' => $data['entity_table']],
                    $db->quoteInto('e.id = ?', $data['id_entity']),
                    []
                )
                ->join(
                    ['f' => 'x_firm'],
                    'f.id = e.id_firm',
                    []
                )
                ->join(
                    ['c' => 'x_company'],
                    'c.id = f.id_company',
                    ['name as firm_name']
                )
                ->join(
                    ['xa' => 'x_access'],
                    'xa.id::text = t.data',
                    ['sdt', 'edt']
                )
                ->where('t.entity_table = ?', $data['entity_table'])
                ->where('t.id_entity = ?', $data['id_entity'])
                ->where('xa.id_firm = ' . $firmId . ' OR xa.id_user = ' . $userId)
                ->where('xa.sdt <= current_timestamp')
                ->where('xa.edt > current_timestamp OR xa.edt is NULL')
                ->where('xa.status = ?', Falcon_Record_X_Access::STATUS_ACTIVE)
                ->where('xa.auto = ?', 0)
                ->where('t.id_operation IN (?)',
                    [
                        Falcon_Record_X_History::OPERATION_GRANTACCESS,
                        Falcon_Record_X_History::OPERATION_EDITACCESS
                    ]
                )
                ->order('dt desc')
                ->limit(1);
        });

        // If no entries found, check group then
        if (empty($records)) {
            $records = $m->loadBy(function ($sql) use (
                $data, $db,
                $firmId, $userId
            ) {
                $sql->distinct()
                    ->join(
                        ['xgil' => 'x_group_item_link'],
                        'xgil.id_group = t.id_entity',
                        []
                    )
                    ->join(
                        ['xa' => 'x_access'],
                        'xa.id::text = t.data',
                        ['sdt', 'edt']
                    )
                    ->join(
                        ['u' => 'x_user'],
                        'u.id = t.id_user',
                        []
                    )
                    ->join(
                        ['p' => 'x_person'],
                        'p.id = u.id_person',
                        ['firstname', 'lastname']
                    )
                    ->join(
                        ['e' => $data['entity_table']],
                        $db->quoteInto('e.id = ?', $data['id_entity']),
                        []
                    )
                    ->join(
                        ['f' => 'x_firm'],
                        'f.id = e.id_firm',
                        []
                    )
                    ->join(
                        ['c' => 'x_company'],
                        'c.id = f.id_company',
                        ['name as firm_name']
                    )
                    ->where('t.entity_table = ?',
                        'x_group_' . $data['entity_table'])
                    ->where('xgil.id_item = ?', $data['id_entity'])
                    ->where('xa.id_firm = ' . $firmId
                        . ' OR xa.id_user = ' . $userId)
                    // Do not return data if user that granted access
                    // is from current firm
                    ->where('u.id_firm != ?', $firmId)
                    ->where('xa.sdt <= current_timestamp')
                    ->where('xa.edt > current_timestamp OR xa.edt is NULL')
                    ->where('t.id_operation IN (?)',
                        [
                            Falcon_Record_X_History::OPERATION_GRANTACCESS,
                            Falcon_Record_X_History::OPERATION_EDITACCESS
                        ]
                    )
                    ->order('dt desc')
                    ->limit(1);
            });
        }

        // If entry in x_history was not found, get available information
        if (empty($records)) {
            $records = $mxa->loadBy(
                function ($sql) use ($data, $db, $firmId, $userId) {
                    $sql
                        ->join(
                            ['e' => $data['entity_table']],
                            $db->quoteInto('e.id = ?', $data['id_entity']),
                            []
                        )
                        ->join(
                            ['f' => 'x_firm'],
                            'f.id = e.id_firm',
                            []
                        )
                        ->join(
                            ['c' => 'x_company'],
                            'c.id = f.id_company',
                            ['name as firm_name']
                        )
                        ->where('id_object = ?', $data['id_entity'])
                        ->where('"right" = ?', $data['entity_table'])
                        ->where('sdt <= current_timestamp')
                        ->where('edt > current_timestamp OR edt IS NULL')
                        ->order('sdt desc')
                        ->limit(1);
                }
            );
        }

        // Groups
        if (empty($records)) {
            $records = $mxa->loadBy(
                function ($sql) use ($data, $db, $firmId, $userId) {
                    $sql
                        ->join(
                            ['e' => $data['entity_table']],
                            $db->quoteInto('e.id = ?', $data['id_entity']),
                            []
                        )
                        ->join(
                            ['f' => 'x_firm'],
                            'f.id = e.id_firm',
                            []
                        )
                        ->join(
                            ['c' => 'x_company'],
                            'c.id = f.id_company',
                            ['name as firm_name']
                        )
                        ->join(
                            ['xgil' => 'x_group_item_link'],
                            $db->quoteInto(
                                'xgil.id_item = ?',
                                $data['id_entity']
                            ),
                            []
                        )
                        ->where('t.id_object = xgil.id_group')
                        ->where('"right" = ?',
                            'x_group_' . $data['entity_table'])
                        ->where('t.id_firm = ' . $firmId
                            . ' OR t.id_user = ' . $userId)
                        ->where('sdt <= current_timestamp')
                        ->where('edt > current_timestamp OR edt IS NULL')
                        ->order('edt desc')
                        ->limit(1);
                }
            );
        }
        return new Falcon_Message($records);
    }

    /**
     * Device creation REST method
     * /mon_device/create
     * <pre>
     * Params:
     *  [required]
     *   share_key - Share key of x_firm
     *   uid - Identifier of device
     *  [optional]
     *   name - Name of device
     *   email - E-mail of owner
     *   phone - Phone of device
     *   model - Model of device
     *   note - Additional information
     *
     * Returns:
     *   {Falcon_Message}, contains "device_key" if successful, wich
     *   must be specified for each request to /mon_packet/create
     * </pre>
     */
    public function createAction()
    {
        $answer = new Falcon_Message();
        $shareKey = $this->getParam('share_key');
        $deviceUid = $this->getParam('uid');
        $deviceName = $this->getParam('name');
        $deviceNote = $this->getParam('note');
        $devicePhone = $this->getParam('phone');
        if (!$shareKey || !$deviceUid) {
            return $answer->error(Falcon_Exception::BAD_REQUEST,
                ["Invalid input data, specify share_key and uid"]);
        }

        $firms = Falcon_Mapper_X_Firm::getInstance()->load([
            'share_key = ?' => $shareKey,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ], true);

        if (empty($firms)) {
            return $answer->error(Falcon_Exception::OBJECT_NOT_FOUND,
                ["Account not found, check share_key"]);
        }
        $firmId = $firms[0]['id'];

        // search device by its uid
        $device = Falcon_Mapper_Mon_Device::getInstance()
            ->loadByUid($deviceUid, true);

        if ($device) {
            if ($device->get('id_firm') != $firmId) {
                // not your device - get out!
                return $answer;
            }
        } else {
            $m = Falcon_Mapper_Mon_Device_Protocol::getInstance();
            $protocolId = $m->getIdForAlias('maprox-rc');
            $deviceName = $deviceName ? $deviceName : 'UID/' . $deviceUid;
            $device = new Falcon_Record_Mon_Device([
                'id_firm' => $firmId,
                'protocol' => $protocolId,
                'imagealias' => 'latitude1',
                'identifier' => $deviceUid,
                'name' => $deviceName,
                'note' => $deviceNote
            ]);
            $device->insert();
            $deviceId = $device->getId();

            // insert identifier of the device
            $dsUid = new Falcon_Record_Mon_Device_Setting([
                'id_device' => $deviceId,
                'option' => Falcon_Record_Mon_Device_Setting::IDENTIFIER,
                'value' => $deviceUid,
                'id_protocol' => $protocolId
            ]);
            $dsUid->insert();

            // insert phone of the device
            if ($devicePhone) {
                $dsPhone = new Falcon_Record_Mon_Device_Setting([
                    'id_device' => $deviceId,
                    'option' => 'phone',
                    'value' => $devicePhone,
                    'id_protocol' => $protocolId
                ]);
                $dsPhone->insert();
            }
        }

        return $answer->reset()->addParam('device_key',
            Falcon_Mapper_Mon_Device::getDeviceKey($firmId, $deviceUid));
    }
}
