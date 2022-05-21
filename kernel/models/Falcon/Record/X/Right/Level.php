<?php

/**
 * Class of right level table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_X_Right_Level extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'name',
        'description',
        'state',
        'id_right'
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_right_level_link_right',
            'alias' => 'rights',
            'fields' => ['id_right'],
            'simple' => true
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = [/*'logged',*/
        'journaled'];

    /**
     * Trash record in the table
     * @return Falcon_Record_Abstract
     */
    public function trash()
    {
        $logger = Falcon_Logger::getInstance();
        parent::trash();

        // Trash associated x_right
        if ($this->get('id_right')) {
            $right = new Falcon_Record_X_Right($this->get('id_right'));
            $right->trash();

            $history = new Falcon_Record_X_History([
                'id_operation'
                => Falcon_Record_X_History::OPERATION_DELETE,
                'entity_table' => 'x_right',
                'id_entity' => $this->get('id_right')
            ]);
            $history->insert();
        }

        return $this;
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $data = $this->getChanged();

        // If change state to active
        if (isset($data['state'])) {
            if ($data['state'] == Falcon_Record_Abstract::STATE_ACTIVE) {
                if ($this->get('id_right')) {
                    $right = new Falcon_Record_X_Right($this->get('id_right'));
                    $right->set('state', Falcon_Record_Abstract::STATE_ACTIVE);
                    $right->update();

                    // Add entry to x_history
                    $history = new Falcon_Record_X_History([
                        'id_operation'
                        => Falcon_Record_X_History::OPERATION_RESTORE,
                        'entity_table' => 'x_right',
                        'id_entity' => $this->get('id_right')
                    ]);
                    $history->insert();
                }
            }
        }

        parent::update();
        return $this;
    }
}
