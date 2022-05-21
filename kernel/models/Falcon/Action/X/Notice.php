<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Notice extends Falcon_Action_Rest_Common
{
    /**
     * Need to perform check read
     * @var Boolean
     */
    protected $checkRead = false;

    /**
     * Updates x_notice settings
     * @param type $userId
     * @param type $data
     */
    public function updateSettings($userId, $data)
    {
        $m = Falcon_Mapper_X_Notice::getInstance();

        foreach ($data as $notice) {
            $noticeAlias = $notice->id;
            if ($m->aliasExists($noticeAlias)) {
                $record = new Falcon_Record_X_Notice_Importance([
                    'id_notice' => $m->getIdByAlias($noticeAlias),
                    'id_user' => $userId
                ]);

                $record->set('id_importance', $notice->value);
                if ($record->isLoaded()) {
                    $record->update();
                } else {
                    $record->insert();
                }
            }
        }
    }


    /**
     * Returns get query function for list
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryListFn($params)
    {
        $user = Falcon_Model_User::getInstance();
        if ($user->getId() == -1) {
            return;
        }

        $record = $this->getEntityRecord();
        $data = [
            'record' => $record,
            'firmId' => $params['firm'],
            'joined' => $this->getParam('$joined'),
            'quick' => $this->getParam('$quick'),
            'filter' => $this->getParam('$filter'),
            'entity_table' => $this->getParam('entity_table'),
            'id_entity' => $this->getParam('id_entity'),
            'showTrashed' => $this->getParam('$showtrashed'),
            'hasState' => $record->hasField('state'),
            'total' => isset($params['total']) ? $params['total'] : false
        ];

        $db = Zend_Db_Table::getDefaultAdapter();
        $fn = function ($sql) use ($user, $data) {
            $sql->distinct();
            $sql->joinLeft(
                ['i' => 'x_notice_importance'],
                'i.id_notice = t.id AND i.id_user = ' . $user->getId(),
                ['id_importance']
            )
                ->joinLeft(
                    ['ni' => 'x_notification_importance'],
                    'i.id_importance = ni.id',
                    ['alias_importance' => 'name']
                );

            Falcon_Odata_Filter::apply($data['filter'], $sql);
        };
        return $fn;
    }

}
