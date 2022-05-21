<?php

/**
 * Action "x_notification"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notification extends Falcon_Action_Rest_Common
{
    /**
     * Process notifications by packet object
     * @param Falcon_Record_Mon_Packet $packet
     */
    public function processByPacket($packet)
    {
        // We do not support archive packets
        if ($packet->isFromArchive()) {
            return;
        }

        $deviceId = $packet->get('id_device');
        $packetTime = $packet->get('time');

        $n = Falcon_Mapper_X_Notification::getInstance();
        // Notification that should not be proccessed by packet
        $excludeAliases = ['mon_connection_loss'];
        $tm = Falcon_Mapper_X_Notification_Type::getInstance();
        $excludeTypes = $tm->loadBy(function ($sql) use ($excludeAliases) {
            $sql->where('alias IN (?)', $excludeAliases);
        });

        $excludeIds = [];
        foreach ($excludeTypes as $type) {
            $excludeIds[] = $type['id'];
        }

        $ignoreStateTypes
            = Falcon_Action_X_Notification_Abstract::$ignoreStateTypes;

        foreach ($n->loadByDevice($deviceId, $packetTime) as $record) {
            $idType = $record['id_type'];
            // Skip some notification types
            if (in_array($idType, $excludeIds)) {
                continue;
            }

            if (!$packet->isActive() &&
                !in_array($idType, $ignoreStateTypes) &&
                !Falcon_Action_X_Notification_Abstract
                    ::isAlarmButtonType($idType)
            ) {
                continue;
            }

            $n->process($record, ['packet' => $packet]);
        }

        // process notification if we have a sos packet
        //$this->processSosPacket($packet);
    }

    /**
     * Process notifications by server time
     * @param {String} $dt
     */
    public function processByTime($dt)
    {
        // Process connection loss notification
        $n = Falcon_Mapper_X_Notification::getInstance();
        $nt = Falcon_Mapper_X_Notification_Type::getInstance();
        $lossType = $nt->getSingleFieldBy('id', 'alias', 'mon_connection_loss');

        $loss = $n->loadBy(function ($sql) use ($lossType) {
            $sql->where('id_type = ?', $lossType)
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
        });

        foreach ($loss as $data) {
            $n->process($data, [
                'dt' => $dt
            ]);
        }
    }

    /**
     * Process notification if it is a sos packet
     * @param {Falcon_Record_Mon_Packet} $packet
     */
    public function processSosPacket($packet)
    {
        $config = Zend_Registry::get('config')->toArray();
        $m = Falcon_Mapper_Mon_Packet::getInstance();
        if (!$m->isSosPacket($packet)) {
            return;
        }

        $t = Zend_Registry::get('translator');
        $zt = $t['zt'];

        $deviceId = $packet->get('id_device');
        $packetTime = $packet->get('time');
        $address = $packet->getAddress();

        $device = new Falcon_Record_Mon_Device($deviceId);

        // Save current locale
        $defaultLocale = $config['locales'][$t['lang']];

        // Get users' ids by object id
        $table = new Falcon_Table_X_Access();
        foreach ($table->getUsersByObject($device) as $userId) {
            $user = new Falcon_Model_User($userId);
            $settings = $user->getSettings();

            // Get user locale
            $lang = $settings['p.lng_alias'];
            if (isset($config['locales'][$lang])) {
                $locale = $config['locales'][$lang];
                $zt->setLocale($locale);
            }
            // Get packet time with user UTC offset
            $time = $user->correctDate($packetTime, false);

            $message = $time . ', &laquo;' . $device->get('name')
                . '&raquo;';
            $message .= '<br />';
            $message .= $zt->_('SOS button was pressed.');
            if (!empty($address)) {
                $message .= '<br />';
                $message .= $address;
            }

            Falcon_Mapper_N_Work::getInstance()->add('popup', [
                'send_to' => $userId,
                'message' => $message,
                'params' => [
                    'packetId' => $packet->getId()
                ]
            ]);

        }

        // Restore default locale
        $zt->setLocale($defaultLocale);
    }
}
