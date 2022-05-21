<?php

/**
 * Class of address country mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Mapper_A_Country extends Falcon_Mapper_Common
{

    /**
     * Load list of records
     * @param Mixed[] $where Condition
     * @param String $sortBy Sort by field. Can be omitted
     * @param Boolean $toArray Export record data to array
     * @param Boolean $loadDeleted Load deleted
     * @return instanceof Falcon_Record_Abstract[]/Array[]
     */
    public function load(Array $where = null, $sortBy = null,
                         $toArray = false, $loadDeleted = false)
    {
        $data = parent::load($where, $sortBy, $toArray, $loadDeleted);

        if ($toArray == true) {
            foreach ($data as &$item) {
                $item['id'] = $item['id_country'];

                unset($item['id_lang']);
                unset($item['id_country']);
                unset($item['state']);
            }
        }

        return $data;
    }
}
