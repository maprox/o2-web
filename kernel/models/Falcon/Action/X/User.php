<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_User extends Falcon_Action_Rest_Common
{
    /**
     * List of fields not in record, which can also be edited
     * @var {String[]}
     */
    protected $additionalFields = [
        'schedule'
    ];

    /**
     * If password is going to be updated, we need to hash it,
     * and also set need_password_change to false
     * @param $c {Falcon_Record_Abstract}
     * @param $param {String} new password
     */
    function onUpdatePassword($c, $param)
    {
        $user = new Falcon_Model_User($c->getId());
        $user->changePassword($param);
        $c->set('password', $user->get('password'));
        $c->set('need_password_change', $user->get('need_password_change'));

        return false;
    }

    /**
     * Actions to perform after updating instance
     * @param type $c
     */
    protected function notifyUser($c)
    {
        // Notify user
        $params = $this->getParams();

        if (!isset($params['need_notify_user'])) {
            return true;
        } else {
            $notify = $params['need_notify_user'];
        }

        if (!isset($params['id'])) {
            return true;
        }

        // User
        $user = new Falcon_Model_User($params['id']);

        if (!$user->getEmail()) {
            return true;
        }

        if (!isset($params['password'])) {
            return true;
        } else {
            $password = $params['password'];
        }

        if ($notify && $password) {

            // Config
            $config = Zend_Registry::get('config');

            // Current user
            $currentUser = Falcon_Model_User::getInstance();

            // Send Email
            Falcon_Sender_Email::sendSimple(
                'views/scripts/actions/acc_create',
                [
                    'user' => $user,
                    'current_user' => $currentUser,
                    'login' => $user->get('login'),
                    'pass' => $password
                ],
                $config->variables->notifyEmail,
                $user->getEmail()
            );
        }

        return true;
    }

    /**
     * Update instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        $data = parent::instanceUpdate($c);
        $this->notifyUser($c);

        return $data;
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

        $this->checkEmailCreated($c);
        return true;
    }

    /**
     * Check if email created first time
     * Adds notification method
     * @param type $c
     */
    protected function checkEmailCreated($c)
    {
        $params = $this->getParams();
        // Check if user has no email and new email is given
        $user = new Falcon_Model_User($c->get('id'));
        if ($user->getEmail()) {
            return true;
        }

        if (!isset($params['person'])) {
            return true;
        }

        if (!isset($params['person']->email)) {
            return true;
        }

        if (!count($params['person']->email)) {
            return true;
        }

        $primaryEmail = null;
        foreach ($params['person']->email as $email) {
            if ($email->isprimary) {
                $primaryEmail = $email->address;
                break;
            }
        }
        if (!$primaryEmail) {
            $primaryEmail = $params['person']->email[0]->address;
        }

        $m = Falcon_Mapper_X_Notification_Setting_Type::getInstance();

        // Create notification method
        $setting = new Falcon_Record_X_Notification_Setting([
            'id_user' => $c->get('id'),
            'address' => $primaryEmail,
            'active' => 1,
            'id_type' => $m->getIdForAlias('email')
        ]);
        $setting->insert();

        // Set importance
        $importance = new Falcon_Record_X_Notification_Setting_Importance([
            'id_setting' => $setting->getId(),
            'id_importance' => 3 // High
        ]);

        $importance->insert();
    }

    /**
     * If no id_schedule is present, create it.
     * @param $c {Falcon_Record_Abstract}
     */
    function onUpdateSchedule($c, $param)
    {
        if (!$c->get('id_schedule')) {
            $schedule = new Falcon_Record_X_Schedule();
            $schedule->insert();
            $c->set('id_schedule', $schedule->getId())->update();
        }

        return false;
    }

    /**
     * If no id_person is present, create it.
     * @param $c {Falcon_Record_Abstract}
     */
    function onUpdatePerson($c, $param)
    {
        if (!$c->get('id_person')) {
            $person = new Falcon_Record_X_Person([
                'id_firm' => $c->get('id_firm'),
                'lastname' => '',
                'firstname' => '',
                'secondname' => '',
            ]);
            $person->insert();
            $c->set('id_person', $person->getId())->update();
        }

        return false;
    }

    /**
     * Filters given params
     * @param array $params Array of params
     * @param integer $type Action type
     */
    public function filterParams($params, $type)
    {
        // Skip filter for superadmin
        $user = Falcon_Model_User::getInstance();
        if (Falcon_Access::haveAdminRight($user->getId(), $type)) {
            return $params;
        }

        if (isset($params['right_level'])) {
            $params['right_level'] = array_unique($params['right_level']);

            $assignRights = [];
            $rights = $user->getRights();

            foreach ($rights as $right) {
                if (preg_match('/Can assign right/i', $right['name'])) {
                    $assignRights[] = $right['id'];
                }
            }

            if (!empty($assignRights)) {
                $m = Falcon_Mapper_X_Right_Level::getInstance();
                $records = $m->loadBy(function ($sql) use ($assignRights) {
                    $sql->where('id_right IN (?)', $assignRights)
                        ->where('state = ?',
                            Falcon_Record_Abstract::STATE_ACTIVE);
                });

                $canAssign = [];
                foreach ($records as $record) {
                    $canAssign[] = $record['id'];
                }

                $params['right_level']
                    = array_intersect($params['right_level'], $canAssign);
            } else {
                $params['right_level'] = [];
            }
        }

        $this->setParams($params);
    }

    /**
     * Returns identifiers of online users
     * @return array
     */
    public static function getOnlineUsers()
    {
        // Get current online users
        $config = Zend_Registry::get('config')->toArray();
        $redis = new Predis\Client($config['queue']);
        return $redis->smembers(getEnvironmentPrefix() . 'nodejs:users:online');
    }

    /**
     * @TODO: Этому место в рест-контроллере фирм, когда он будет.
     * После переноса отредактировать вкладку доступа в редакторе
     * пользователей
     * Actions to perform after getting list
     * @return bool
     */
    /*protected function onAfterGetList()
    {
        $answer = $this->getAnswer();
        $ids = array();
        foreach ($answer as $item)
        {
            $ids[] = $item['id_firm'];
        }
        $ids = array_unique($ids);

        $mapper = Falcon_Mapper_Billing_Account::getInstance();
        $time = time();
        $firms = array();
        $tariffIds = array();
        $tariffLinks = array();
        foreach ($ids as $firmId)
        {
            $firms[$firmId] = array();
            $accounts = $mapper->loadWithTariff($firmId);
            foreach ($accounts as $account)
            {
                if ((
                        (float)$account['balance'] >=
                        (float)$account['limitvalue'])
                    &&
                    (
                        strtotime($account['tariff_sdt']) < $time)
                    &&
                    (
                        empty($account['tariff_edt'])
                        ||
                        (
                            strtotime($account['tariff_edt']) > $time)))
                {
                    $tariffLinks[$account['id_tariff']][] = $firmId;
                    $tariffIds[] = $account['id_tariff'];
                }
            }
        }

        if (!empty($tariffIds))
        {
            $tariffs = Falcon_Mapper_X_Tariff::getInstance()
                ->load(array('id in (?)' => $tariffIds));
        }
        else
        {
            $tariffs = array();
        }

        foreach ($tariffs as $tariff)
        {
            foreach ($tariffLinks[$tariff->getId()] as $firm)
            {
                $firms[$firm][] = $tariff->get('id_package');
            }
        }

        foreach ($answer as $key => $item)
        {
            $item['package'] = $firms[$item['id_firm']];
            $answer[$key] = $item;
        }

        return true;
    }*/
}
