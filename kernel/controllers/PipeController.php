<?php

/**
 * Pipe-Controller for communication with devices.
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class PipeController extends Falcon_Controller_Action
{
    // Skip user access check for this controller
    protected $_skipAccessCheck = true;
    // Enable IP address check
    protected $_ipCheck = true;

    // Seconds before notify user about schedule
    // TODO: move to config?
    const TIMELEFT = 300; // 5 min

    /**
     * Controller initialization
     */
    public function init()
    {
        parent::init();
        Falcon_Access::disableRightCheck();
    }

    /**
     * process
     * Обработка уведомлений / действий (раз в минуту по крону)
     */
    public function processAction()
    {
        Falcon_Locker::getInstance()->lock('process_action', 0);
        $answer = new Falcon_Message();
        $this->processEvents();

        // TODO: why mon_device mapper?
        $m = Falcon_Mapper_Mon_Device::getInstance();
        $serverTime = $m->dbDate(null, true);
        $this->processNotifications($serverTime);
        $this->processActions();

        Falcon_Mapper_Mon_Waylist::getInstance()->updateStatuses();

        $this->updateLastLoader();
        $this->processSessions();
        $this->clearCountdowns();
        $this->checkTimeLeft();

        $this->sendAnswer($answer);
        Falcon_Locker::getInstance()->unlock('process_action', 0);
    }

    /**
     * Updates last_loader field of online users
     */
    protected function updateLastLoader()
    {
        $logger = Falcon_Logger::getInstance();
        try {
            // Get current online users
            $onlineUsers = Falcon_Action_X_User::getOnlineUsers();
            $table = new Falcon_Table_X_User();
            if (!empty($onlineUsers)) {
                // Update last loader field to them
                $table->updateLastLoader($onlineUsers);
            }
        } catch (Exception $e) {
            $logger->log('error', $e);
        }
    }

    /**
     * Deletes old coundown works
     */
    protected function clearCountdowns()
    {
        $mnw = Falcon_Mapper_N_Work::getInstance();
        $countdownTypeId
            = Falcon_Mapper_N_Notification_Action_Type::getInstance()
            ->getIdByType('countdown');
        $countdowns = $mnw->load([
            'id_notification_action_type = ?' => $countdownTypeId,
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ]);
        foreach ($countdowns as $countdown) {
            // check if countdown time has passed
            $params = json_decode($countdown->get('params'), true);
            $timeleft = $params['timeleft'];

            if ((strtotime($countdown->get('dt')) + $timeleft)
                <= strtotime($mnw->dbDate())
            ) {
                $countdown->set('state', Falcon_Record_Abstract::STATE_DELETED);
                $countdown->update();
            }
        }

    }

    /**
     * Check schedule time of online users
     * Notify users if time is up or close to limit
     */
    protected function checkTimeLeft()
    {
        $logger = Falcon_Logger::getInstance();
        try {
            // Get current online users
            $onlineUsers = Falcon_Action_X_User::getOnlineUsers();
            if (empty($onlineUsers)) {
                return;
            }
            foreach ($onlineUsers as $userId) {
                $user = new Falcon_Model_User($userId);
                $scheduleId = $user->get('id_schedule');
                if (!$scheduleId) {
                    continue;
                }

                $schedule = new Falcon_Record_X_Schedule($scheduleId);
                $nextTime = $schedule->nextTime();

                // Time is up
                if (!$schedule->according()) {
                    $params = [];
                    $params['nexttime'] = $nextTime;

                    // We need to remove session of that user first
                    $m = Falcon_Mapper_Session::getInstance();
                    $sessions = $m->loadBy(function ($sql) use ($userId) {
                        $sql->where('id_user = ?', $userId);
                    });

                    if (!empty($sessions)) {
                        foreach ($sessions as $session) {
                            $m->destroy($session['id']);
                        }
                    }

                    // Emit logout message
                    Falcon_Sender_Queue::sendAmqp('nodejs.control', '',
                        [
                            'id_user' => $userId,
                            'action' => 'logout',
                            'params' => [
                                'code' => Falcon_Exception::SCHEDULE_LIMIT,
                                'params' => [
                                    'sessionData' => $params
                                ]
                            ]
                        ]
                    );
                }
                if ($schedule) {
                    $mnw = Falcon_Mapper_N_Work::getInstance();
                    // check schedule time left
                    $timeleft = $schedule->timeleft();
                    if ($timeleft > 0 && $timeleft <= self::TIMELEFT) {
                        // Check active countdowns
                        $countdownTypeId
                            = Falcon_Mapper_N_Notification_Action_Type::getInstance()
                            ->getIdByType('countdown');
                        $countdowns = $mnw->load([
                            'id_notification_action_type = ?'
                            => $countdownTypeId,
                            'send_to = ?::text' => $userId,
                            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
                        ]);

                        if (!empty($countdowns)) {
                            continue;
                        }

                        // Create countdown popup
                        $mnw->add(
                            'countdown',
                            [
                                'send_to' => $userId,
                                'id_user' => $userId,
                                'id_firm' => $user->getFirmId(),
                                'params' => [
                                    'timeleft' => $timeleft,
                                    'terminate_params' => [
                                        'code' => Falcon_Exception::SCHEDULE_LIMIT,
                                        'params' => [
                                            'sessionData' => [
                                                'nexttime' => $nextTime
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        );
                    }
                }
            }

        } catch (Exception $e) {
            $logger->log('error', $e);
        }
    }

    /**
     * Process sessions
     * Mark inactive users as not logined
     */
    protected function processSessions()
    {
        $m = Falcon_Mapper_X_User::getInstance();
        $inactive = $m->loadBy(function ($sql) {
            $sql->where('logined = ?', true)
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                ->where("current_timestamp - last_loader > interval '? sec'",
                    Zend_Registry::get('config')->session->maxInactiveTime);
        });

        foreach ($inactive as $user) {
            $u = new Falcon_Model_User($user['id']);
            $u->set('logined', false);
            $u->eventCloseBrowser();
        }
    }

    /**
     * Events processing
     * @return Falcon_Message
     */
    protected function processEvents()
    {
        $action = new Falcon_Action_Events();
        return $action->process();
    }

    /**
     * Notifications processing.
     * For time-depended notifications.
     * @param string $dt Events date
     */
    protected function processNotifications($dt)
    {
        $n = new Falcon_Action_X_Notification();
        $n->processByTime($dt);
    }

    /**
     * Actions processing (sending an e-mails, sms, etc.)
     * @return Falcon_Message
     */
    protected function processActions()
    {
        $m = Falcon_Mapper_N_Work::getInstance();
        return $m->processPendingWorks();
    }

    /**
     * Processing events depending on the billing
     */
    public function billingAction()
    {
        $billing = new Falcon_Action_Billing();
        $billing->generateActs();

        // perform billing writeoff
        Falcon_Billing_Processor::getInstance()->writeoff();

        // Disable firms which balance is below the threshold
        Falcon_Mapper_X_Firm::getInstance()->setUnpaidLowBalanceFirms();

        // notify low balance
        Falcon_Mapper_Billing_Account::getInstance()->notifyLowBalance();

        $this->sendAnswer();
    }

    /**
     * Calculates billing at 00:00
     */
    public function billingcalcAction()
    {
        $answer = new Falcon_Message();
        $dt = $this->getParam('debit_dt');
        if (!$dt) {
            $answer->error(Falcon_Exception::BAD_REQUEST, [
                'Please, specify debit_dt!'
            ]);
        } else {
            // calculate billing
            $firmId = $this->getParam('id_firm');
            Falcon_Billing_Processor::getInstance()
                ->calculate($dt, $firmId);
        }
        $this->sendAnswer($answer);
    }

    /**
     * Daily action
     */
    public function dailyAction()
    {
        $m = Falcon_Mapper_Dn_Offer::getInstance();
        $m->notifyExpiredOffers();
        return $this->sendAnswer();
    }
}
