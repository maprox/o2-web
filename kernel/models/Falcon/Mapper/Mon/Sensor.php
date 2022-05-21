<?php

/**
 * Class of "mon_sensor" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Sensor extends Falcon_Mapper_Common
{
    /**
     * True to enable caching of the whole mapper's table (false by default).
     * @var bool
     */
    protected $caching = true;

    /**
     * Fetches sensor id by its name
     * @param {String} $name
     * @return {Number}
     */
    public function getIdByName($name)
    {
        $records = $this->load(['name = ?' => $name]);

        if (empty($records)) {
            $record = $this->newRecord(['name' => $name]);
            $record->insert();
        } else {
            $record = $records[0];
        }

        return $record->getId();
    }
}