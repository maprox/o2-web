<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Fuel_Consumption_Report_Item
    extends Falcon_Action_Rest_Child
{
    /**
     * Parent table config for checking access
     * like "array(fieldName => tableName)"
     * @var array
     */
    public static $parentConfig = [
        'id_fuel_consumption_report' => 'mon_fuel_consumption_report'
    ];

    /**
     * Actions to perform before creating instance
     * @param type $c
     */
    protected function onBeforeUpdate($c)
    {
        parent::onBeforeUpdate($c);
        $params = $this->getParams();

        $countNorm = false;
        $countOverrun = false;
        // Consumption rate
        if (isset($params['consumption_rate'])) {
            $countNorm = true;
            $consumption_rate = $params['consumption_rate'];
        } else {
            $consumption_rate = $c->get('consumption_rate');
        }
        // Mileage waylist
        if (isset($params['mileage_waylist'])) {
            $countNorm = true;
            $mileage_waylist = $params['mileage_waylist'];
        } else {
            $mileage_waylist = $c->get('mileage_waylist');
        }

        // Consumption fact
        if (isset($params['consumption_fact'])) {
            $countOverrun = true;
            $consumption_fact = $params['consumption_fact'];
        } else {
            $consumption_fact = $c->get('consumption_fact');
        }

        // Count norm
        if ($countNorm) {
            $c->set(
                'consumption_by_norm',
                $this->countConsumptionByNorm(
                    $consumption_rate,
                    $mileage_waylist
                )
            );

            $countOverrun = true;
        }

        // Count overrun
        if ($countOverrun) {
            $c->set('overrun', $this->countOverrun(
                $consumption_fact,
                $c->get('consumption_by_norm')
            ));
        }
    }

    /**
     * Counts consumption by norm
     * @param type $rate
     * @param type $mileage
     * @return type
     */
    protected function countConsumptionByNorm($rate, $mileage)
    {
        return ($rate * $mileage) / 100;
    }

    /**
     * Counts overrun
     * @param type $fact
     * @param type $norm
     * @return type
     */
    protected function countOverrun($fact, $norm)
    {
        return $fact - $norm > 0 ? $fact - $norm : 0;
    }
}
