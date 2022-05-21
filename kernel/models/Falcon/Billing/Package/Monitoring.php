<?php

/**
 * Billing package class "Monitoring"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Billing_Package_Monitoring
    extends Falcon_Billing_Package_Abstract
{
    /**
     * Calculates billing for specified account package
     * @param int $accountId
     * @param int $packageId
     * @param string $dt
     * @return Falcon_Record_Billing_History_Detail[]
     */
    public function calculate($accountId, $packageId, $dt)
    {
        $details = [];
        $account = new Falcon_Record_Billing_Account($accountId);
        if (!$account->isLoaded()) {
            return $details;
        }
        $firmId = $account->get('id_firm');

        // let's count shared and personal devices
        $devices = $this->getDevices($firmId, $dt);
        $data = [
            'personal' => ['count' => 0, 'note' => ''],
            'shared' => ['count' => 0, 'note' => '']
        ];
        foreach ($devices as $device) {
            $type = ($device['id_firm'] != $firmId) ? 'shared' : 'personal';
            if ($data[$type]['note']) {
                $data[$type]['note'] .= ', ';
            }
            $data[$type]['note'] .= $device['name'];
            $data[$type]['count']++;
        }
        if ($firmId == 16) {
            //vd($data);
        }

        $feeMapper = Falcon_Mapper_X_Fee::getInstance();
        // add personal devices
        $details[] = new Falcon_Record_Billing_History_Detail([
            'feeid' => $feeMapper->getIdForAlias('mon_device'),
            'feecount' => $data['personal']['count'],
            'note' => $data['personal']['note']
        ]);
        // add shared devices
        $details[] = new Falcon_Record_Billing_History_Detail([
            'feeid' => $feeMapper->getIdForAlias('mon_device_shared'),
            'feecount' => $data['shared']['count'],
            'note' => $data['shared']['note']
        ]);

        // calculate users count
        $users = $this->getUsers($firmId, $dt);
        $details[] = new Falcon_Record_Billing_History_Detail([
            'feeid' => $feeMapper->getIdForAlias('user'),
            'feecount' => $users['count'],
            'note' => $users['note']
        ]);

        // calculate sent sms count
        $sms = $this->getSms($firmId, $dt);
        $details[] = new Falcon_Record_Billing_History_Detail([
            'feeid' => $feeMapper->getIdForAlias('sms'),
            'feecount' => $sms['count'],
            'note' => $sms['note']
        ]);

        // calculate received sms count
        $incomingSms = $this->getIncomingSms($firmId, $dt);
        $details[] = new Falcon_Record_Billing_History_Detail([
            'feeid' => $feeMapper->getIdForAlias('incoming_sms'),
            'feecount' => $incomingSms['count'],
            'note' => $incomingSms['note']
        ]);
        return $details;
    }

    /**
     * Counts active devices for firm on supplied date
     * @param int $firmId
     * @param string $dt
     * @return array
     */
    public function getDevices($firmId, $dt)
    {
        $db = Zend_Db_Table::getDefaultAdapter();
        $sqlFirmDevices = $db->select()
            ->from('mon_device')
            ->where('id_firm = ?', $firmId)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->where('lastconnect is not null');
        $sqlSharedDevices = $db->select()
            ->from(['a' => 'x_access'], '')
            ->where('a.id_firm = ?', $firmId)
            ->where('a.sdt <= ?', $dt)
            ->where('a.edt is null or a.edt > ?', $dt)
            ->where('a.status = ?', Falcon_Record_X_Access::STATUS_ACTIVE)
            ->join(['d' => 'mon_device'],
                'd.id = a.id_object
             and d.state != 3
             and d.lastconnect is not null',
                '')
            ->columns('d.*');
        $sqlTotalDevices = $db->select()
            ->union([$sqlFirmDevices, $sqlSharedDevices])
            ->order('name');
        $devices = [];

        if ($firmId == 16) {
            //vd($db->fetchAll($sqlTotalDevices));
        }

        foreach ($db->query($sqlTotalDevices) as $device) {
            if ($device['state'] == Falcon_Record_Abstract::STATE_ACTIVE) {
                $devices[] = $device;
                continue;
            }
            // check if there is any packets recieved at this $dt
            // only for inactive devices (state != 1)
            $packets = $db->fetchOne($db->select()
                ->from('mon_packet')
                ->where('id_device = ?', $device['id'])
                ->where('event_dt >= ?', $dt)
                ->where('event_dt < ?::date + \'1 day\'::interval', $dt)
            );
            if ($packets) {
                $devices[] = $device;
            }
        }
        return $devices;
    }

    /**
     * Counts active users for firm on supplied date
     * @param int $firmId
     * @param string $dt
     * @return array
     */
    private function getUsers($firmId, $dt)
    {
        $db = Zend_Db_Table::getDefaultAdapter();
        $users = $db->query($db->select()
            ->from('x_user')
            ->where('id_firm = ?', $firmId)
            ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
            ->order('shortname')
        );
        $data = ['count' => 0, 'note' => ''];
        foreach ($users as $user) {
            if ($data['note']) {
                $data['note'] .= ', ';
            }
            $data['note'] .= $user['shortname'];
            $data['count']++;
        }
        return $data;
    }

    /**
     * Counts sended sms for firm on supplied date
     * @param int $firmId
     * @param string $dt
     * @return array
     */
    private function getSms($firmId, $dt)
    {
        $id_action_type_sms = Falcon_Mapper_N_Notification_Action_Type
            ::getInstance()->getIdByType('sms');

        $db = Zend_Db_Table::getDefaultAdapter();
        $messages = $db->query($db->select()
            ->from('n_work', ['send_to', 'sum(coalesce(amount, 1)) as cnt'])
            ->where('id_firm = ?', $firmId)
            ->where('state = ?', Falcon_Record_Abstract::STATE_DELETED)
            ->where('id_notification_action_type = ?', $id_action_type_sms)
            ->where('dt >= ?', $dt)
            ->where('dt < ?::date + \'1 day\'::interval', $dt)
            ->group('send_to')
            ->order('send_to')
        );
        $data = ['count' => 0, 'note' => ''];
        foreach ($messages as $sms) {
            if ($data['note']) {
                $data['note'] .= ', ';
            }
            $data['note'] .= $sms['send_to'] . ' (' . $sms['cnt'] . ')';
            $data['count'] += $sms['cnt'];
        }
        return $data;
    }

    /**
     * Counts incoming sms for firm on supplied date
     * @param int $firmId
     * @param string $dt
     * @return array
     */
    private function getIncomingSms($firmId, $dt)
    {
        $commandTypeId = Falcon_Mapper_Mon_Device_Command_Type
            ::getInstance()->getSingleFieldBy('id', 'name', 'incoming_sms');

        $db = Zend_Db_Table::getDefaultAdapter();
        $messages = $db->query($db->select()
            ->from(['dc' => 'mon_device_command'], ['d.id', 'd.name'])
            ->join(['d' => 'mon_device'], 'd.id = dc.id_device', ['cnt' => 'count(*)'])
            ->where('d.id_firm = ?', $firmId)
            ->where('dc.id_command_type = ?', $commandTypeId)
            ->where('dc.dt >= ?::date', $dt)
            ->where('dc.dt < ?::date + \'1 day\'::interval', $dt)
            ->group(new Zend_Db_Expr('1, 2'))
            ->order('d.name')
        );

        $data = ['count' => 0, 'note' => ''];
        foreach ($messages as $sms) {
            if ($data['note']) {
                $data['note'] .= ', ';
            }
            $data['note'] .= $sms['name'] . ' (' . $sms['cnt'] . ')';
            $data['count'] += $sms['cnt'];
        }
        return $data;
    }
}