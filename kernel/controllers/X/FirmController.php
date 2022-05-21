<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 *
 * /x_firm controller
 */
class X_FirmController extends Falcon_Controller_Action_Rest
{
    /**
     * Поиск фирмы по имени и ИНН
     */
    public function searchAction()
    {
        $f = new Zend_Filter_StripTags();
        $inn = $f->filter($this->getParam('inn'));

        $m = Falcon_Mapper_X_Firm::getInstance();
        $firms = $m->getIdByInn($inn);

        $answer = new Falcon_Message($firms);
        return $answer;
    }

    /**
     * Search firm by share_key
     */
    public function searchkeyAction()
    {
        $f = new Zend_Filter_StripTags();
        $shareKey = $f->filter($this->getParam('share_key'));

        $m = Falcon_Mapper_X_Firm::getInstance();
        $firms = $m->getIdByShareKey($shareKey);

        $answer = new Falcon_Message($firms);
        return $answer;
    }

    /**
     * /x_firm/welcome
     */
    public function welcomeAction()
    {
        $firmId = $this->getParam('firm');
        $firm = new Falcon_Model_Firm($firmId);
        $welcome = $firm->getWelcome();
        die($welcome);
    }

    /**
     * /x_firm/deleteaccount
     * @return \Falcon_Message
     */
    public function deleteaccountAction()
    {
        $answer = new Falcon_Message();

        // Check if request method is put
        // TODO: use better method against CSRF?
        if (!$this->getRequest()->isPut()) {
            return $answer;
        }

        $user = Falcon_Model_User::getInstance();
        $firmId = $user->getFirmId();

        if (!$user->hasRight('delete_account')) {
            return $answer;
        }

        // Set state 3
        $firm = new Falcon_Model_Firm($firmId);
        $firmRecord = $firm->getRecord();
        $firmRecord->set('state', 3);
        $firmRecord->update();

        // Logout all firm users
        foreach ($firm->getFirmUsers() as $user) {
            // Destory user sessions
            foreach ($user->getSessionKeys() as $sessionId) {
                // Send refresh message
                // Say node.js to refresh page with given session
                Falcon_Sender_Queue::sendAmqp('nodejs.control', '',
                    [
                        'id_user' => $user->getId(),
                        'session' => trim($sessionId),
                        'action' => 'logout',
                        'params' => [
                            'code' => 4058 // Account has been deleted
                        ]
                    ]
                );
            }
        }

        return $answer;
    }
}