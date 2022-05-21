<?php

/**
 * Table "x_history" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_History extends Falcon_Record_Abstract
{
    // Operation values
    const
        OPERATION_CREATE = 1,
        OPERATION_EDIT = 2,
        OPERATION_DELETE = 3,
        OPERATION_RESTORE = 4,
        OPERATION_PROCESS = 6,
        OPERATION_GRANTACCESS = 7,
        OPERATION_EDITACCESS = 8,
        OPERATION_REVOKEACCESS = 9,
        OPERATION_CHILDCHANGE = 10;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'dt',
        'entity_table',
        'id_entity',
        'id_operation',
        'id_user',
        'data'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_history_operation',
            'key' => 'id_operation',
            'fields' => ['name as type']
        ],
        [
            'table' => 'x_history_diff',
            'key' => 'id',
            'alias' => 'diff'
        ],
    ];

    /**
     * Insert record to the table
     * @return instanceof Falcon_Record_Abstract
     */
    public function insert()
    {
        $idUser = $this->get('id_user');
        if (empty($idUser)) {
            $user = Falcon_Model_User::getInstance();
            $this->set('id_user', $user->getId());
        }
        $this->set('dt', $this->dbDate());
        return parent::insert();
    }
}
