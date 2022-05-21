<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2014, Maprox LLC
 *
 * Supportbox controller
 */
class SupportboxController extends Zend_Controller_Action
{
    /**
     * Send received issue to configured email
     */
    public function submitAction()
    {
        $logger = Falcon_Logger::getInstance();
        if (!$this->_request->isPost()) {
            $this->_redirect('/');
        }
        $answer = new Falcon_Message();
        $config = Zend_Registry::get('config');

        $data = $this->getRequest()->getPost();

        // get user info
        $user = Falcon_Model_User::getInstance();
        $userData = $user->getRecord()->toArray();

        $phones = [];
        $emails = [];
        $company = [];

        $login = $user->get('login');
        if (!empty($login)) {
            $personId = $user->get('id_person');

            // phones
            $pm = Falcon_Mapper_X_Person_Phone::getInstance();
            $phones = $pm->load(['id_person = ?' => $personId]);

            // emails
            $em = Falcon_Mapper_X_Person_Email::getInstance();
            $emails = $em->load(['id_person = ?' => $personId]);

            // company information
            $firm = new Falcon_Record_X_Firm($user->get('id_firm'));
            $company = new Falcon_Record_X_Company($firm->get('id_company'));
            $company = $company->toArray();
        }

        // Reply-To
        $from = $config->variables->notifyEmail;
        $replyTo = null;

        if ($user->getEmail()) {
            $replyTo = $user->getEmail();
        }

        if (isset($data['email'])) {
            if (!empty($data['email'])) {
                $replyTo = $data['email'];
            }
        }

        // sending an email
        $response = Falcon_Sender_Email::sendSimple(
            'views/scripts/actions/supportbox_submit',
            [
                'message' => $data['message'],
                'user' => $user,
                'company' => $company,
                'phones' => $phones,
                'emails' => $emails,
                'guestemail' => isset($data['email']) ? $data['email'] : '',
                'browser_data' => json_decode($data['data'], true),
            ],
            $from,
            $config->variables->supportEmail,
            $replyTo
        );

        if ($response->isFailure()) {
            $answer->error($response->getErrorCode(), [
                $response->getErrorMessage()
            ]);
        }

        $this->_helper->json($answer->toArray());
    }
}
