<?php

/**
 * Action "mon_sim_card"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Sim_Card extends Falcon_Action_Rest_Common
{
    /**
     * Actions to perform before getting list of instance
     * @return bool
     */
    protected function onBeforeGetList()
    {
        parent::onBeforeGetList();

        if ($this->hasParam('$search')) {
            $t = new Falcon_Table_Mon_Sim_Card();
            $result = $t->search($this->getParam('$search'));

            if (!empty($result)) {
                $this->setParam('$filter', 'id IN ' . implode(', ', $result));
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeCreate($c)
    {
        parent::onBeforeCreate($c);

        // Generate setting key
        $settingsKey = Falcon_Util::randomString();
        $c->set('settings_key', $settingsKey);

        return true;
    }

    /**
     * Update mon_sim_card entry if needed
     * @param Falcon_Record_Mon_Packet $packet
     * @param Falcon_Record_Mon_Device $device
     */
    public function maybeUpdateSimCard($packet, $device)
    {
        $identifier = $device->get('identifier');
        if (!$identifier) {
            return;
        }

        // Update sim cards
        $ms = Falcon_Mapper_Mon_Sim_Card::getInstance();
        $cards = $ms->loadBy(function ($sql) use ($device, $identifier) {
            $sql->where('imei_tracker = ?::text', $identifier)
                ->where('id_client_firm != ?', $device->get('id_firm'))
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                ->limit(1);
        });

        // If sim card entry found
        if (count($cards)) {
            $card = $cards[0];
            $cardRecord = new Falcon_Record_Mon_Sim_Card($card['id']);
            $updateRecord = false;
            // Fill connection date
            if (empty($card['connection_date'])) {
                $cardRecord->set('connection_date', $packet->get('event_dt'));
                $updateRecord = true;
            }
            // Fill id_client_firm
            if (empty($card['id_client_firm']) ||
                $card['id_client_firm'] != $device->get('id_firm')
            ) {
                $cardRecord->set('id_client_firm', $device->get('id_firm'));
                $updateRecord = true;
            }
            if ($updateRecord) {
                $cardRecord->update();
            }
        }
    }
}
