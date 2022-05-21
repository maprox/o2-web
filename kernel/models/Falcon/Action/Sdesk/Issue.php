<?php

/**
 * Class for working with service desk client firms
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Sdesk_Issue extends Falcon_Action_Rest_Common
{
    /**
     * Returns a mapper or a record to work with
     * @param array $params
     * @return mixed
     */
    public function getInstance($params)
    {
        $id = $this->getParam('id');
        switch ($params['method']) {
            case 'doGetList':
            case 'doGetItem':
                $m = Falcon_Mapper_Sdesk_View_Issue::getInstance();
                break;
            case 'doCreate':
                $m = new Falcon_Record_Sdesk_Issue();
                break;
            case 'doUpdate':
            case 'doDelete':
                $m = new Falcon_Record_Sdesk_Issue($id);
                break;
        }
        return $m;
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceCreate($c)
    {
        $firmId = $this->getFirmId();
        $userId = $this->getUserId();
        // let's create new instance
        foreach ($c->getFields(false) as $field) {
            $c->set($field, $this->getParam($field));
        }
        $c->setProps([
            'id_firm' => $firmId,
            'num' => $c->getNextNum($firmId),
            'create_id_user' => $userId
        ]);
        $c->insert();
        return $c->load()->toArray();
    }

    /**
     * Update instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        $unchangable = ['id_firm', 'num'];
        foreach ($c->getFields(false) as $field) {
            if (!in_array($field, $unchangable)) {
                $value = $this->getParam($field, $c->get($field));
                $c->set($field, $value);
            }
        }
        $c->update();
    }
}
