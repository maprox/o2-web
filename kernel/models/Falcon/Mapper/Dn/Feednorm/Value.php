<?php

/**
 * Table "dn_feednorm_value"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011, Maprox LLC
 */
class Falcon_Mapper_Dn_Feednorm_Value extends Falcon_Mapper_Common
{
    public function loadByFeednorm($feednormId)
    {
        $result = [];
        $records = $this->getTable()->loadByFeednorm($feednormId);
        $i = 0;
        foreach ($records as $record) {
            $ids = implode(',', [
                $record['id_feednorm'],
                $record['id_product'],
                $record['id_region'],
                $record['id_warehouse']
            ]);
            $record['id'] = ++$i;
            if (!array_key_exists($ids, $result)) {
                $result[$ids] = $record;
            }
        }
        return array_values($result);
    }
}