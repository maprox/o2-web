<?php

/**
 * Class of "x_firm" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Mapper_X_Firm extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    //protected $firmRestriction = false;

    /**
     * Load firm by inn
     * @param String $inn
     * @return Array
     */
    public function getIdByInn($inn)
    {
        return $this->getTable()->loadBy(function ($sql) use ($inn) {
            $sql->join('x_company',
                'id_company = x_company.id',
                []
            )
                ->where('inn = ?', $inn);
        }, ['fields' => ['id', 'x_company.name']]);
    }

    /**
     * Load firm by share_key
     * @param String $inn
     * @return Array
     */
    public function getIdByShareKey($shareKey)
    {
        return $this->getTable()->loadBy(function ($sql) use ($shareKey) {
            $sql->join('x_company',
                'id_company = x_company.id',
                []
            )
                ->where('share_key = ?', $shareKey);
        }, ['fields' => ['id', 'x_company.name']]);
    }

    /**
     * Disables firms which balance is below the limit
     * Set have_unpaid_account to 1
     */
    public function setUnpaidLowBalanceFirms()
    {
        $logger = Falcon_Logger::getInstance();
        // Accounts which firms need to be disabled
        $accounts
            = Falcon_Mapper_Billing_Account::getInstance()
            ->getNonpaymentEnabledAccounts();

        // n_work mapper
        $mnw = Falcon_Mapper_N_Work::getInstance();
        foreach ($accounts as $account) {

            // Firm admin contacts
            $contactStr = '';

            $firm = new Falcon_Model_Firm($account['id_firm']);
            $company = $firm->get('company');
            $firmRecord = $firm->getRecord(false);
            if ($firmRecord) {

                // Set have_unpaid_account to 1
                $firmRecord->set('have_unpaid_account', 1);
                $firmRecord->update();

                // Notify all firm users by email
                $users = $firm->getFirmUsers();
                $usersIds = [];
                $usersMap = [];

                // Users iteration
                foreach ($users as $user) {
                    $person = $user->get('person');

                    // Translator
                    $t = Zend_Registry::get('translator');
                    $zt = $t['zt'];
                    $locale = $user->getLocale();

                    $usersIds[] = $user->get('id');
                    $usersMap[$user->get('id')] = $user;

                    if ($user->getEmail()) {
                        $message = [
                            'type' => 'email',
                            'send_to' => $user->getEmail(),
                            'id_firm' => $account['id_firm'],
                            'id_user' => $user->get('id'),
                            'params' => [
                                'template' => 'unpaid_account_disabled',
                                'locale' => $locale,
                                'data' => [
                                    'company' => [
                                        'name' => $company['name']
                                    ],
                                    'user' => [
                                        'firstname' => $person['firstname']
                                    ]
                                ]
                            ]
                        ];

                        Falcon_Amqp::sendTo('n.work', 'work.process', $message);
                    }

                    // Create n_work with unpaid message
                    $mnw->add(
                        'unpaid', // singleton
                        [
                            'send_to' => $user->get('id'),
                            'id_user' => $user->get('id'),
                            'id_firm' => $user->getFirmId(),
                            'message' =>
                                $zt->_(
                                    'Your account is temporarily ' .
                                    'disabled due to non-payment',
                                    $locale
                                ),
                            'params' => [
                                'unpaid' => true
                            ]
                        ]
                    );

                    // Contact str for logout error
                    if (empty($contactStr)
                        && $user->hasRight('module_billing')
                    ) {
                        $contactStr = $user->getContactStr();
                    }
                }

                //
                // Logout users
                //
                $m = Falcon_Mapper_Session::getInstance();
                $needToTerminate = $m->load([
                    'id_user IN (?)' => $usersIds,
                    'is_master = ?' => 0
                ]);
                foreach ($needToTerminate as $session) {
                    $sessionId = $session->get('id');
                    $sessionUser = $usersMap[$session->get('id_user')];

                    // node.js mesage params
                    $params = [];
                    // If user has module billing just refresh page
                    if ($sessionUser->hasRight('module_billing')) {
                        $params = [
                            'refresh' => true
                        ];
                    } else {
                        $params = [
                            'code' => 4052,
                            'params' => [
                                'contactStr' => $contactStr
                            ]
                        ];
                    }

                    // Say node.js to refresh page with given session
                    Falcon_Sender_Queue::sendAmqp('nodejs.control', '',
                        [
                            'id_user' => $session->get('id_user'),
                            'session' => trim($sessionId),
                            'action' => 'logout',
                            'params' => $params
                        ]
                    );
                }

                $logger->log('unpaid',
                    'Firm has been disabled due to non-payment '
                    . $account['id_firm']);

            } else {
                $logger->log('unpaid',
                    'No x_firm record for ' . $account['id_firm']);
            }
        }
    }
}
