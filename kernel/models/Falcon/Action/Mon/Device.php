<?php

/**
 * Action "/mon_device"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Device extends Falcon_Action_Rest_Common
{
    /**
     * Processes read records before giving them away
     * @param {Mixed[]} $records
     */
    protected function processRecords($records)
    {
        $records = parent::processRecords($records);
        if (empty($records)) {
            return $records;
        }

        $user = Falcon_Model_User::getInstance();
        $userId = $user->getId();

        $protocolMapper = Falcon_Mapper_Mon_Device_Protocol::getInstance();
        foreach ($records as &$record) {

            // TEMP BEGIN
            if ($userId == 1013019706) {
                $record['name'] = preg_replace('/\d/', '0', $record['name']);
            }
            // TEMP END

            $settings = [];
            foreach ($record['setting'] as $option) {
                if ($option['option'] ==
                    Falcon_Record_Mon_Device_Setting::RAW
                ) {
                    continue;
                }
                $alias = $protocolMapper->getAliasForId($option['id_protocol']);
                if (!isset($settings[$alias])) {
                    $settings[$alias] = [];
                }
                $settings[$alias][$option['option']] = $option['value'];
            }
            unset($record['setting']);
            $record['settings'] = json_encode($settings);
        }
        return $records;
    }

    /**
     * When updating odometer we need to update
     * last mon_packet record for this device
     * @param type $c
     * @param type $value
     */
    public function onUpdateOdometer($c, $value)
    {
        $packet = Falcon_Mapper_Mon_Packet::getInstance()
            ->getPacketAtIndexFromDt($c->getId(), 0, null, true, true);
        if ($packet) {
            $packet->set('odometer_ext', $value * 1000);
            $packet->set('odometer_forced', 1);
            $packet->set('from_archive', 1);
            $packet->update();
        }
    }

    /**
     * When updating odometer we need to update
     * last mon_packet record for this device
     * @param type $c
     * @param type $value
     */
    public function onUpdateSettings($c, $value)
    {
        $prevSettings = json_decode($c->get('settings'), true);
        $newSettings = json_decode($value, true);
        if (isset($prevSettings['common'])) {
            unset($prevSettings['common']);
        }
        if (isset($newSettings['common'])) {
            unset($newSettings['common']);
        }

        $value = json_decode($value, true);

        $protocolMapper = Falcon_Mapper_Mon_Device_Protocol::getInstance();
        foreach ($value as $alias => $options) {
            if ($alias == $protocolMapper::GLOBAL_SETTINGS_ALIAS) {
                $protocolId = 0;
            } else {
                // Check if settings for this alias are changed
                if (isset($prevSettings[$alias])) {
                    if (!array_diff($options, $prevSettings[$alias])) {
                        continue;
                    }
                }

                $protocolId = $protocolMapper->getIdForAlias($alias);
                if (!$protocolId) {
                    continue;
                }
            }
            foreach ($options as $option => $value) {
                $c->setOption($option, $value, $protocolId);
            }

            if (!$protocolId) {
                continue;
            }
            $identifier = $c->get('identifier');
            if ($identifier) {
                Falcon_Amqp::sendTo('mon.device', 'command.create', [
                    'uid' => $identifier,
                    'command' => 'change_settings',
                    'transport' => 'tcp',
                    'params' => [
                        'data' => $options
                    ]
                ]);
            } else {
                $logger = Falcon_Logger::getInstance();
                $logger->log('mon_device', 'No identifier!', $c->getId());
            }
        }
    }

    /**
     * Filters given params
     * @param array $params Array of params
     * @param integer $type Action type
     */
    protected function filterParams($params, $type)
    {
        if (isset($params['identifier'])) {
            if (!$params['identifier']) {
                $params['identifier'] = null;
            }
        }

        $this->setParams($params);
    }

    /**
     * Actions to perform before updating instance
     * @param type $c
     */
    protected function onBeforeUpdate($c)
    {
        if (!parent::onBeforeUpdate($c)) {
            return false;
        }

        $params = $this->getParams();

        // Check if some sensors has been deleted and remove possible links
        if (!empty($params['sensor'])) {

            // Get ignition from mon_device_setting
            $m = Falcon_Mapper_Mon_Device_Setting::getInstance();
            $rows = $m->loadBy(function ($sql) use ($c) {
                $sql
                    ->where('id_device = ?', $c->getId())
                    ->where('id_protocol = ?', 0)
                    ->where('option = ?', 'ignition')
                    ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE);
            });
            if (!count($rows)) {
                return true;
            }
            $ignitionSetting = $rows[0];

            foreach ($params['sensor'] as $sensor) {
                if (!isset($sensor->state) || !isset($sensor->id)) {
                    break;
                }
                if (($sensor->state == Falcon_Record_Abstract::STATE_DELETED)
                    && ($sensor->id == $ignitionSetting['value'])
                ) {
                    $setting = new Falcon_Record_Mon_Device_Setting(
                        $ignitionSetting['id']);
                    $setting->set('value', 0);
                    $setting->update();
                }
            }
        }

        return true;
    }

    /**
     * Actions to perform after updating instance
     * @param type $c
     */
    protected function onAfterUpdate($c)
    {
        parent::onAfterUpdate($c);

        $params = $this->getParams();

        if (!empty($params['sensor'])) {
            // write updates for mon_device_sensor
            $logged = $c->getTrigger('logged');
            if ($logged) {
                $users = $logged->getLastUsers();

                foreach ($params['sensor'] as $sensor) {
                    if (isset($sensor->id)) {
                        Falcon_Action_Update::add(
                            [
                                'alias' => 'mon_device_sensor',
                                'id_entity' => $sensor->id,
                                'id_operation'
                                => Falcon_Record_X_History::OPERATION_EDIT,
                                'id_user' => $users
                            ]
                        );
                    }
                }
            }
        }

        // clear cache
        try {
            $mapper = $this->getEntityMapper();
            $mapper->clearCache($c);
        } catch (Exception $E) {
            $logger = Falcon_Logger::getInstance();
            $logger->log('on_after_update', $E->getMessage(), 'ERROR');
        }

        return true;
    }
}
