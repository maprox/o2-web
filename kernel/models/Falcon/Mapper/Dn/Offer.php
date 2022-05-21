<?php

/**
 * Class of offer mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Offer extends Falcon_Mapper_Common
{
    const EXPIRE_AFTER = '30 days';

    /**
     * Notify firms about expired offers
     */
    public function notifyExpiredOffers()
    {
        $config = Zend_Registry::get('config');
        $t = $this->getTable();
        $offers = $t->getExpiredOffers(self::EXPIRE_AFTER);
        if (count($offers) == 0) {
            return;
        }

        $am = Falcon_Mapper_Dn_Account::getInstance();
        foreach ($offers as $offer) {
            $supplier = $am->getAccountByIdFirmClient($offer['id_firm']);
            if ($supplier) {
                $firm = new Falcon_Model_Firm($offer['id_firm']);

                // Get firm users and send them
                $users = $firm->getFirmUsers();
                foreach ($users as $user) {
                    if ($user->getEmail()) {
                        // Sending an email with notification
                        Falcon_Sender_Email::sendSimple(
                            'views/scripts/actions/offer_expired',
                            [
                                'user' => $user
                            ],
                            $config->variables->notifyEmail,
                            $user->getEmail()
                        );
                    }
                }

                // Make x_history entry
                $history = new Falcon_Record_X_History();
                $history->set('id_entity', $offer['id']);
                $history->set('id_operation',
                    Falcon_Record_X_History::OPERATION_PROCESS);
                $history->set('entity_table', 'dn_offer');

                $history->insert();
            }
        }
    }

    /**
     * Insert new record to the table
     * @param instanceof Falcon_Record_Abstract $record New record
     * @return Integer Identifier of new record
     */
    public function insertRecord(Falcon_Record_Abstract $record)
    {
        $lastNum = $this->getLastNum($record->get('id_firm'));
        $record->set('num', $lastNum + 1);
        return parent::insertRecord($record);
    }

    /**
     * Get last num for firm by identifier
     * @param Integer $firmId Firm identifier
     * @return Integer Last code for firm
     */
    public function getLastNum($firmId)
    {
        return $this->getTable()->queryLastNum($firmId);
    }
}