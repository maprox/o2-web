<?php

/**
 * Description of AccessController
 */
class X_AccessController extends Falcon_Controller_Action
{
    /**
     * Confirms or reject the share
     */
    public function shareconfirmAction()
    {
        $logger = Falcon_Logger::getInstance();

        $answer = new Falcon_Message();
        $user = Falcon_Model_User::getInstance();

        // Accept the share
        $accept = $this->getParam('accept');

        if (!$this->getParam('access_id')) {
            throw new Falcon_Exception('Wrong parameters',
                Falcon_Exception::BAD_REQUEST);
        }

        // Get x_access record
        $record = new Falcon_Record_X_Access($this->getParam('access_id'));

        // Check that user could make decision
        // Check write right
        Falcon_Access::checkGlobalWrite($record->get('right'));

        if ($record->get('id_firm')
            && ($user->get('id_firm') !== $record->get('id_firm'))
        ) {
            throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        } else if ($record->get('id_user')
            && $record->get('id_user') !== $user->get('id')
        ) {
            throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        // Get popup work
        $work = new Falcon_Record_N_Work($this->getParam('work_id'));

        // Check if work is really addressed to current user
        if (((int)$work->get('send_to') !== (int)$user->get('id'))) {
            throw new Falcon_Exception('Access violation',
                Falcon_Exception::ACCESS_VIOLATION);
        }

        // Let's change access entry status
        $status = Falcon_Record_X_Access::STATUS_ACTIVE;
        if (!$accept) {
            $status = Falcon_Record_X_Access::STATUS_REJECTED;
        }

        $record->set('status', $status);
        $record->update();

        // Get object record
        $objectAlias = 'Falcon_Record_' . ucwords_custom($record->get('right'));
        $objectRecord = new $objectAlias($record->get('id_object'));

        // Users who can access object
        $objectUsers
            = $objectRecord->getMapper()->getUsersByObject($objectRecord);

        // Send updates for object
        Falcon_Action_Update::add([
            'alias' => $record->get('right'),
            'id_user' => $objectUsers,
            'id_entity' => $objectRecord->get('id'),
            'id_operation' => Falcon_Record_X_History::OPERATION_EDIT
        ]);

        // Notify owner's firm about decision
        // Notify all who has write right
        $mxu = Falcon_Mapper_X_User::getInstance();
        $firmUsers = $mxu->getFirmUsersByRight(
            $objectRecord->get('id_firm'),
            $record->get('right'),
            Falcon_Access_Abstract::ACCESS_WRITE
        );

        // Define popup message
        $t = Zend_Registry::get('translator');
        $zt = $t['zt'];
        $message = '';
        if ($accept) {
            $message = sprintf($zt->_(
                'User has accepted your invation to share "%s"'
            ), $objectRecord->get('name'));
        } else {
            $message = sprintf($zt->_(
                'User has rejected your invation to share "%s"'
            ), $objectRecord->get('name'));
        }

        // Create confirmation popups for this users
        $mnw = Falcon_Mapper_N_Work::getInstance();
        foreach ($firmUsers as $userData) {
            $firmUser = new Falcon_Model_User($userData['id']);
            $message = '';
            if ($accept) {
                $message = sprintf($zt->_(
                    'User has accepted your invation to share "%s"',
                    $firmUser->getLocale()
                ), $objectRecord->get('name'));
            } else {
                $message = sprintf($zt->_(
                    'User has rejected your invation to share "%s"',
                    $firmUser->getLocale()
                ), $objectRecord->get('name'));
            }

            $mnw->add('popup', [
                'send_to' => $firmUser->get('id'),
                'message' => $message,
                'params' => [
                    'broadcast' => true
                ]
            ]);
        }

        // First remove all works linked to this access entry
        $shareTypeId
            = Falcon_Mapper_N_Notification_Action_Type::getInstance()
            ->getIdByType('share');
        $popups = $mnw->load([
            'id_notification_action_type = ?'
            => $shareTypeId,
            'message = ?::text' => $this->getParam('access_id'),
            'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE
        ]);

        foreach ($popups as $popup) {
            // Set state 3 for work
            $popup->trash();

            // Send update
            Falcon_Action_Update::add([
                'alias' => 'n_work',
                'id_user' => (int)$popup->get('send_to'),
                'id_entity' => $popup->get('id'),
                'id_operation' => Falcon_Record_X_History::OPERATION_DELETE
            ]);
        }

        // If share accepted notify users by email
        if ($accept) {
            $template = 'grant_' . $record->get('right');
            $record->notify($template, $work->get('id_user'));
        }

        $this->sendAnswer($answer);
    }
}

