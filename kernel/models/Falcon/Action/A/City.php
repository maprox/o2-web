<?php

/**
 * Class for workinng with cities
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_A_City extends Falcon_Action_Rest_Common
{

    /**
     * Need to perform check read
     * @var Boolean
     */
    protected $checkRead = false;

    /**
     * Need to perform check create
     * @var Boolean
     */
    protected $checkCreate = false;

    /**
     * Actions to perform before updating instance
     * @param type $c
     */
    public function onBeforeCreate($c)
    {
        parent::onBeforeCreate($c);
        if ($this->getParam('id_lang')) {
            $idLang = $this->getParam('id_lang');
        } else {
            $idLang = 2;
        }
        $c->set('id_lang', $idLang);
    }

    /**
     * Returns get query function for list
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryListFn($params)
    {
        // Method redefined for removing access check
        $record = $this->getEntityRecord();

        $data = [
            'record' => $record,
            'firmId' => $params['firm'],
            'joined' => $this->getParam('joined'),
            'filter' => $this->getParam('$filter'),
            'showTrashed' => $this->getParam('$showtrashed'),
            'hasState' => $record->hasField('state'),
            'total' => isset($params['total']) ? $params['total'] : false
        ];

        $fn = function ($sql) use ($data) {
            if ($data['hasState'] && !$data['showTrashed']) {
                $sql
                    ->where('t.state != ?',
                        Falcon_Record_Abstract::STATE_DELETED);
            }
            if ($data['joined'] && !$data['total']) {
                $data['record']->getMapper()->joinForeignTables($sql);
            }
            Falcon_Odata_Filter::apply($data['filter'], $sql);
            /*Falcon_Access::addAccessSql($sql, $data['firmId'], array(
                'addfields' => !$data['total']
            ));*/
        };
        return $fn;
    }
}