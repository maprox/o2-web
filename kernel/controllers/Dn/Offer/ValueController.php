<?php

/**
 * Dn Offer Value controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Dn_Offer_ValueController extends Falcon_Controller_Action_Rest
{
    /**
     * Получение списка значений коммерческих предложений
     */
    public function batchAction()
    {
        $params = $this->getParams();

        if (empty($params['data']) || empty($params['id']) ||
            !is_numeric($params['id']) || !is_array($params['data'])
        ) {
            return new Falcon_Message(null, false);
        }

        $mapper = Falcon_Mapper_Dn_Offer_Value::getInstance();
        $mapper->delete(['id_offer = ?' => $params['id']]);

        foreach ($params['data'] as &$item) {
            $item['id_offer'] = $params['id'];
        }
        $mapper->insertPack($params['data']);

        return new Falcon_Message();
    }
}
