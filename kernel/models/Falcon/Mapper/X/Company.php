<?php

/**
 * Class of "x_company" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Company extends Falcon_Mapper_Common
{
    /**
     * Filling table with parameters
     */
    public function fillInQuery(&$query)
    {
        $langId = Falcon_Action_Address_Utils::getLangId();
        $adapter = $this->getTable()->getAdapter();
        if ($langId) {
            $query = $adapter->quoteInto($query, $langId);
        }
    }
}