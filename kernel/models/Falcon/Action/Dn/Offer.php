<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Dn_Offer extends Falcon_Action_Rest_Common
{
    /**
     * Actions to perform after creating instance
     * @param type $c
     */
    protected function onAfterCreate($c)
    {
        $copyId = $this->getParam('copyid');
        if ($copyId) {
            $mapper = Falcon_Mapper_Dn_Offer_Value::getInstance();
            $values = $mapper->load([
                'id_offer = ?' => $copyId,
                'id_region + id_warehouse > ?' => 0
            ], true);
            foreach ($values as &$value)
                $value['id_offer'] = $c->getId();
            $mapper->insertPack($values);
        }

        return true;
    }

    /**
     * Actions to perform after getting list
     * @return bool
     */
    protected function onAfterGetList()
    {
        $data = $this->getAnswer()->getData();
        $firmId = Falcon_Model_User::getInstance()->getFirmId();
        $otherData = [];
        $selfData = [];
        foreach ($data as $item) {
            if ($item['id_firm'] == $firmId) {
                $selfData[] = $item;
                continue;
            }
            if (!isset($otherData[$item['id_firm']]) ||
                strtotime($otherData[$item['id_firm']]['edt']) <
                strtotime($item['edt'])
            ) {
                $otherData[$item['id_firm']] = $item;
            }
        }
        $this->getAnswer()->addParam('data',
            array_merge($selfData, $otherData));

        return true;
    }

    /**
     * Before x_access entry created
     * @param type $record
     * @return boolean
     */
    protected function beforeAccessGrant(&$record)
    {
        $record->set('status', Falcon_Record_X_Access::STATUS_ACTIVE);

        return true;
    }

    /**
     * After access has been granted
     * Access not existed or was closed
     * And no other access presented
     * @param type $item
     * @param type $record
     */
    protected function afterAccessGrant($item, $record, $c)
    {
        // No need to confirm
        // Do nothing
    }
}
