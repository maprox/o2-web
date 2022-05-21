<?php

/**
 * Class of "x_flag" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Flag extends Falcon_Mapper_Common
{
    /**
     * Changes flag value
     * @param {String} $entityTable
     * @param {Integer} $idEntity
     * @param {Integer} $type
     * @param {Boolean} $value
     * @param {Boolean} $createIfNotExists
     */
    public function changeFlag($entityTable, $idEntity, $type,
                               $value = FALSE, $createIfNotExists = FALSE)
    {
        $flag = new Falcon_Record_X_Flag([
            'entity_table' => $entityTable,
            'id_entity' => $idEntity,
            'type' => $type
        ]);

        if ($flag->isLoaded()) {
            $flag->set('value', $value);
            $flag->update();
        } else {
            if ($createIfNotExists) {
                $flag->insert();
            }
        }

        return $flag;
    }
}