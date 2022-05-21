<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class X_PersonController extends Falcon_Controller_Attachment
{
    /**
     * Actions before attachment record will be inserted
     */
    protected function onBeforeInsertAttachment()
    {
        // x_person have only one attachment - user's photo
        // remove all existing attachments for given id person before continue
        $entityId = $this->getParam('id_entity');

        $m = Falcon_Mapper_X_Person_Attachment_Link::getInstance();
        $attachments = $m->loadBy(function ($sql) use ($entityId) {
            $sql->where('id_x_person = ?', $entityId);
        });

        // Delete records and files
        foreach ($attachments as $attachment) {
            $attachmentId = $attachment['id_x_attachment'];

            $record = new Falcon_Record_X_Attachment($attachmentId);
            $hash = $record->get('hash');

            // Delete record
            $record->delete();

            // Delete file
            $this->deleteFileByHash($hash);
        }

        return;
    }

    /**
     * Add entity updates
     */
    protected function addEntityUpdates()
    {
        $entityId = $this->getParam('id_entity');

        // Write update for entity and id_entity
        // X_access table
        $accessTable = new Falcon_Table_X_Access();

        // Check if there is associated dn_worker
        $mw = Falcon_Mapper_Dn_Worker::getInstance();
        $workers = $mw->load(['id_person = ?' => $entityId]);
        if (count($workers)) {
            $worker = $workers[0];
            $objectUsers = $accessTable->getUsersByObject($worker);

            Falcon_Action_Update::add([
                'alias' => 'dn_worker',
                'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                'id_entity' => $entityId,
                'id_user' => $objectUsers
            ]);
        }

        // Check if there is associated x_user
        $mu = Falcon_Mapper_X_User::getInstance();
        $users = $mu->load(['id_person = ?' => $entityId]);
        if (count($users)) {

            $user = $users[0];

            $objectUsers = $accessTable->getUsersByObject($user);

            Falcon_Action_Update::add([
                'alias' => 'x_user',
                'id_operation' => Falcon_Record_X_History::OPERATION_EDIT,
                'id_entity' => $user->get('id'),
                'id_user' => $objectUsers
            ]);
        }
    }

    /**
     * Save file on disk
     * @param type $tmpName
     */
    protected function saveFile($tmpName, $newName)
    {
        // Save resized file
        $img = $this->longSideResize($tmpName, 256);
        $img->writeImage($newName);
        $img->destroy();
    }

    /**
     * Creates image thumb
     * @param String $imagePath Image path
     */
    protected function createImageThumb($imagePath)
    {
        // Don't create image thumb
        // TODO: may be better use class param?
        return;
    }
}