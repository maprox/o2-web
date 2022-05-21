<?php

/**
 * @project    Maprox <http://maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Rest_Helper_History extends Falcon_Action_Rest_Helper_Abstract
{
    /**
     * Writes history about granted access
     * @param {Integer} $id
     */
    public function accessGrant($id)
    {
        $history = new Falcon_Record_X_History([
            'id_operation'
            => Falcon_Record_X_History::OPERATION_GRANTACCESS,
            'entity_table' => $this->getName(),
            'id_entity' => $this->getId(),
            'data' => $id
        ]);
        $history->insert();
    }

    /**
     * Writes history about edited access
     * @param {Integer} $id
     */
    public function accessEdit($id)
    {
        $history = new Falcon_Record_X_History([
            'id_operation'
            => Falcon_Record_X_History::OPERATION_EDITACCESS,
            'entity_table' => $this->getName(),
            'id_entity' => $this->getId(),
            'data' => $id
        ]);
        $history->insert();
    }

    /**
     * Writes history about deleted access
     * @param {Integer} $idUser
     */
    public function accessRevoke($idUser)
    {
        $history = new Falcon_Record_X_History([
            'id_operation'
            => Falcon_Record_X_History::OPERATION_REVOKEACCESS,
            'entity_table' => $this->getName(),
            'id_entity' => $this->getId(),
            'data' => $idUser
        ]);
        $history->insert();
    }
}