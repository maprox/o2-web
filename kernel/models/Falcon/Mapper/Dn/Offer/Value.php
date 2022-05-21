<?php

/**
 * Offer value mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012 Maprox LLC
 */
class Falcon_Mapper_Dn_Offer_Value extends Falcon_Mapper_Common
{
    /**
     * Insert set of records
     * @param Mixed[] $data
     * @return Falcon_Mapper_Dn_Offer_Value
     */
    public function insertPack(Array $data)
    {
        $insert = [];
        foreach ($data as $item) {
            $insert[] = [
                $item['id_offer'],
                $item['id_warehouse'],
                $item['id_region'],
                $item['id_product'],
                $item['price'],
                1
            ];
        }
        if (count($insert)) {
            $this->getTable()->queryInsert($insert);
        }
        return $this;
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join(
                'dn_offer',
                'dn_offer.id = t.id_offer',
                []
            );
        }
        return 'dn_offer';
    }
}