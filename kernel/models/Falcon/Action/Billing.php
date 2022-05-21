<?php

/**
 * Class for working with billing
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class Falcon_Action_Billing extends Falcon_Action_Abstract
{
    // Api key of this user id will be used to request reports
    // superadmin right level is needed
    const apiKeyUserId = 9;

    /**
     * Generate acts if this is a first day of the month
     * @param {String} $forceDate Date string in Y-m-d format (current date)
     */
    public function generateActs($forceDate = null)
    {
        $logger = Falcon_Logger::getInstance();
        // we will generate acts only on the first day of the month
        // tmp code during move to y.m.2 to y.m+1.2 acts
        $isTransition = (date('Y-m') == '2014-03');
        if (date('d') != 2 && !$forceDate) {
            return;
        }
        if (!$forceDate) {
            $dateString = date('Y-m-d'); // Y-m-2
        } else {
            $dateString = $forceDate;
        }
        // $period means previous month
        $period = new DateTime($dateString);
        $period->sub(new DateInterval('P2D'));

        // Get api key
        $admin = new Falcon_Record_X_User(self::apiKeyUserId);
        $apiKey = $admin->get('api_key');

        // Sdt and edt for detailed report
        $edt = new DateTime($dateString);
        $edt->sub(new DateInterval('PT1S'));
        $sdt = new DateTime($dateString);
        $sdt->sub(new DateInterval('P1M'));

        if ($isTransition) {
            $sdt->sub(new DateInterval('P1D'));
        }

        // Translator
        $zt = Zend_Registry::get('translator');
        $t = $zt['zt'];

        // At this time we support only russian contracts
        $t->setLocale('ru_RU');
        //$t->setLocale('en_GB');

        // Get default managers
        $mxu = Falcon_Mapper_X_User::getInstance();
        $managers = $mxu->getUsersByRightAlias('act_manager');

        // Get firms for acts generation
        $firms = Falcon_Mapper_X_Firm::getInstance()->loadBy(function ($sql) {
            $sql
                ->where('state = ?', Falcon_Record_Abstract::STATE_ACTIVE)
                ->where('id_contract is not null');
        });
        $mapperAct = Falcon_Mapper_Dn_Act::getInstance();
        foreach ($firms as $firm) {
            $contract = $firm['contract'];
            if (!isset($contract['num'])
                || !isset($contract['dt'])
            ) {
                // skip firms with empty contracts
                continue;
            }

            // Generate act
            $newAct = $mapperAct->generate([
                'period' => $period,
                'firm' => $firm
            ]);
            continue;

            // Get attachment links
            $reportsUrl = getProtocol() . '://' . getHttpHostName()
                . '/reports/export';

            // Act link
            $actLinkParams = [
                'data' => [
                    'report' => '/reports/observer/docsnet/act',
                    'format' => 'PDF',
                    'params' => [
                        'actid' => $newAct
                    ]
                ],
                'key' => $apiKey
            ];

            // Detalization link
            $detailLinkParams = [
                'data' => [
                    'report' => '/reports/observer/docsnet/billing_detailing',
                    'format' => 'PDF',
                    'params' => [
                        'firmid' => $firm['id'],
                        'period_sdt' => $sdt->format(DB_DATE_FORMAT),
                        'period_edt' => $edt->format(DB_DATE_FORMAT)
                    ]
                ],
                'key' => $apiKey
            ];

            // Attachments
            $attachments = [
                [
                    'url' => $reportsUrl,
                    'params' => $actLinkParams,
                    'filename' => 'act-' . $sdt->format('m-Y') . '.pdf'
                ],
                [
                    'url' => $reportsUrl,
                    'params' => $detailLinkParams,
                    'filename' => 'details-' . $sdt->format('m-Y') . '.pdf'
                ]
            ];

            // Get firm users
            $firmModel = new Falcon_Model_Firm($firm['id']);
            $users = $firmModel->getFirmUsers();

            // Trying to get firm manager
            $actManagers = [];
            if (!empty($firm['id_manager'])) {
                //$logger->log('zend', 'Firm has manager '
                //. $firm['id_manager']);
                $actManagers[] = new Falcon_Model_User($firm['id_manager']);
            } else {
                //$logger->log('zend', 'Use default managers');
                // Use default managers
                foreach ($managers as $manager) {
                    $actManagers[] = new Falcon_Model_User($manager['id']);
                }
            }

            //$logger->log('zend', $actManagers);
            //$logger->log('zend', 'notify firm ' . $firm['id']);
            // Notify users
            foreach ($users as $user) {
                if (!$user->hasRight('billing_manager')) {
                    continue;
                }

                //$logger->log('zend', 'Notify user ' . $user->get('login')
                //. ' ' . $user->get('id'));

                $params = [
                    'user' => $user,
                    'firm' => $firm,
                    'attachments' => $attachments,
                ];
                $user->notify('monthly_act', $params);
            }

            // Notify managers
            foreach ($actManagers as $actManager) {
                //$logger->log('zend', 'Notify Manager '
                //. $actManager->get('login') . ' ' . $actManager->get('id'));
                $params = [
                    'user' => $actManager,
                    'firm' => $firm,
                    'isManager' => true,
                    'attachments' => $attachments,
                ];
                if (!$actManager->getEmail()) {
                    // If no email try to notify by notification settings
                    $actManager->notify('monthly_act', $params);
                } else {
                    // Ignore notification settings and notify by email
                    $actManager->notifyBy('monthly_act', $params, [
                        [
                            'address' => $actManager->getEmail(),
                            'type_name' => 'email'
                        ]
                    ]);
                }
            }
        }
    }
}