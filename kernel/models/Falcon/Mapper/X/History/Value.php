<?php

/**
 * Class of "x_history_value" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_History_Value extends Falcon_Mapper_Common
{
    /**
     * @param $name
     * @return Mixed
     */
    public function getValueId($name)
    {
        $data = $this->load(['name = ?' => $name]);
        if (!empty($data)) {
            return $data[0]->getId();
        }

        $record = $this->newRecord(['name' => $name]);
        $record->insert();
        return $record->getId();
    }
}