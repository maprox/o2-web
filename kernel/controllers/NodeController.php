<?php

/**
 * Contoller for communicating with node.js
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2012, Maprox LLC
 */
class NodeController extends Falcon_Controller_Action
{
    // Skip user access check for this controller
    protected $_skipAccessCheck = true;
    // Enable IP address check
    protected $_ipCheck = true;

    /**
     * Controller initialization
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Mass load data for node js purposes
     */
    public function dataAction()
    {
        $logger = Falcon_Logger::getInstance();
        $message = $this->_getParam('message');
        //$logger->log('zend', 'NODE MESSAGE: ');
        //$logger->log('zend', $message);
        $message = json_decode($message, true);

        // Data
        $data = [];

        $m = new Falcon_Model_Manager();

        foreach ($message['users'] as $userId => $proxies) {
            //$logger->log('zend', 'UserId: ' . $userId);
            foreach ($proxies as $proxyUid => $proxy) {
                //$logger->log('zend', 'ProxyUid: ' . $proxyUid);
                //$logger->log('zend', $proxy);

                // Optional message params
                if (empty($message['id_entity'])) {
                    $message['id_entity'] = null;
                }
                if (empty($message['id_operation'])) {
                    $message['id_operation'] = null;
                }

                // Get item
                $items = $m->getForUser(
                    $userId,
                    $proxy,
                    $message['alias'],
                    $message['id_entity'],
                    $message['id_operation']
                );

                // Complite data for sending to user
                $itemsData = [];

                if ($items->isSuccess()) {
                    //$logger->log('zend', 'Success loading');
                    $itemsData = $items->getData();
                } else {
                    //$logger->log('zend', 'Unsuccessfull loading');
                    // If id entity was not specified
                    if (!$message['id_entity']) {
                        //$logger->log('zend', 'No id entity');
                        // Something goes wrong
                        $logger->log('warn',
                            'Unsuccessfull data load for ' . $message['alias']);

                        continue;
                    }
                }
                // if no data for item id loaded, item is removed
                if (empty($itemsData)) {
                    //$logger->log('zend', 'Empty itemsData, set as deleted');
                    // item removed
                    $itemsData = [
                        [
                            'id' => $message['id_entity'],
                            'state' => 3,
                        ]
                    ];
                }

                if (count($itemsData)) {
                    $data[$userId][$proxyUid] = [
                        $message['alias'] => $itemsData
                    ];
                }
            }
        }

        //$logger->log('zend', 'RESULT DATA: ');
        //$logger->log('zend', $data);

        $answer = new Falcon_Message();
        $answer->addParam('data', $data);

        $this->sendAnswer($answer);
    }

    /**
     * Authorization check and data return for node.js request
     * Should return user id
     */
    public function authAction()
    {
        $logger = Falcon_Logger::getInstance();
        $answer = new Falcon_Message();
        $manager = new Falcon_Model_Manager();
        $sessionId = $this->_getParam('session');
        $proxies = $this->_getParam('proxies');
        $proxies = json_decode($proxies, true);
        $logger->log('node', 'authAction', [
            'session' => $sessionId
        ]);

        // Check if session with given id and id_user exists
        $m = Falcon_Mapper_Session::getInstance();
        $result = $m->loadBy(function ($sql) use ($sessionId) {
            $sql->where('id = ?', $sessionId);
        });

        // data
        $data = [];

        // if sesison found
        if (count($result)) {
            // Return id user
            $userId = $result[0]['id_user'];
            $data['id_user'] = $userId;

            // Deprecated
            // Load packets if there is mon_device proxy
            /*foreach ($proxies as $proxy) {
                if ($proxy['id'] == 'mon_packet') {
                    // Set current user
                    $user = new Falcon_Model_User($userId);
                    Falcon_Model_User::setInstance($user);

                    $packets = $manager->loadPackets(null, null);
                    if ($packets->isSuccess()) {
                        $data['updates']['mon_packet'] = $packets->getData();
                    }
                }

                if ($proxy['id'] == 'n_work') {
                    $user = new Falcon_Model_User($userId);
                    Falcon_Model_User::setInstance($user);
                    $order = array(
                        'property' => 'dt',
                        'direction' => 'asc'
                    );
                    $action = new Falcon_Action_N_Work(array(
                        'pageAndOrderParams' => array(
                            'order' => array(
                                (object) $order
                            )
                        )
                    ));
                    $data['updates']['n_work']
                        = $action->doGetList()->getData();
                }
            }*/
        } else {
            $answer->setSuccess(false);
        }

        $answer->addParam('data', $data);
        $this->sendAnswer($answer);
    }

    //initialDataAction()

}