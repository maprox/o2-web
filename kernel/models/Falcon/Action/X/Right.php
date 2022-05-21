<?php

/**
 * Class for working with rights
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_Right extends Falcon_Action_Rest_Common
{
    /**
     * Returns get query function for list
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryListFn($params)
    {
        $filter = $this->getParam('$filter');
        $showTrashed = $this->getParam('$showtrashed');
        $fn = function ($sql) use ($filter, $showTrashed) {
            if (!$showTrashed) {
                $sql
                    ->where('t.state != ?', 3);
            }
            Falcon_Odata_Filter::apply($filter, $sql);
        };

        return $fn;
    }
}
