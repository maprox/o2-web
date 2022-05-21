<?php

/**
 * Table "dn_product"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Dn_Product extends Falcon_Mapper_Common
{
    /**
     * Load list of records
     * @return Array[]
     */
    public function loadWithMeasure()
    {
        return $this->getTable()->loadWithMeasure();
    }

    /**
     * Load list of records with associated data
     * @param {String} $firmId
     * @return Array[]
     */
    public function loadWithData($articleGroup, $firmId)
    {
        return $this->getTable()->loadWithData($articleGroup, $firmId);
    }

    /**
     * Updates Product and associated tables
     * @param {Object} $params update params
     * @return Falcon_Message
     */
    public function updateProduct($params, $articleGroup, $firmId)
    {
        $answer = new Falcon_Message();

        $data = [
            'name' => $params->name,
            'fullname' => $params->fullname,
            'id_measure' => $params->id_measure,
        ];

        if ($params->id) {
            /* Обновляем запись в таблице dn_product */
            $record = new Falcon_Record_Dn_Product($params->id, 1);
            $record->setProps($data)->update();
        } else {
            $record = new Falcon_Record_Dn_Product($data);
            $record->insert();
        }

        $id = $record->getId();

        /* Обновляем связанные данные в таблице dn_article */
        $record = new Falcon_Record_Dn_Article([
            'id_product' => $id,
            'id_group' => $articleGroup,
        ], 1);
        $update = [
            'code' => $params->code,
        ];
        $record->setProps($update)->update();

        /* Обновляем связанные данные в таблице dn_product_data */

        $record = new Falcon_Record_Dn_Product_Data([
            'id_product' => $id,
            'id_firm' => $firmId,
        ], 1);
        $update = [
            'ntd' => $params->ntd,
            'shipmenttime' => $params->shipmenttime,
            'shelflife' => $params->shelflife,
        ];
        $record->setProps($update)->update();

        return $answer;
    }
}
