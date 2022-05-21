<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Fuel_Consumption_Report extends Falcon_Action_Rest_Common
{
    /**
     * Create instance
     * @param {Falcon_Record_Abstract} $c
     */
    public function instanceCreate($c)
    {
        // Get params
        $params = $this->getParams();
        $idDivision = $params['id_division'];
        $date = $params['dt'];

        // Check date
        if (!$date) {
            return [
                'success' => false,
                'error' => 'empty_date'
            ];
        }
        $m = Falcon_Mapper_Mon_Fuel_Consumption_Report::getInstance();
        $reports = $m->loadBy(function ($sql) use ($date, $idDivision) {
            $sql->where('dt = ?', $date);
            if ($idDivision) {
                $sql->where('id_division = ?', $idDivision);
            } else {
                $sql->where('id_division = 0 OR id_division IS NULL');
            }
            $sql->where('status = 1')
                ->where('state = 1');
        });

        if (!empty($reports)) {
            return [
                'error' => 'existing_report',
                'success' => false
            ];
        }

        // Create report
        $data = parent::instanceCreate($c);

        // Let's create report items
        // Query vehicles
        $a = new Falcon_Action_Mon_Vehicle([
            '$joined' => 1,
            '$filter' => 'state EQ 1 AND id_division EQ ' . $idDivision
        ]);
        $vehicles = $a->doGetList(false);

        $mt = Falcon_Mapper_Mon_Track::getInstance();

        foreach ($vehicles as $n => $vehicle) {
            // Skip vehicles with no device
            if (empty($vehicle['id_device'])) {
                continue;
            }

            // Count maprox mileage
            $edt = date(
                DB_DATE_FORMAT,
                strtotime('+1 month -1 second', strtotime($date))
            );

            $summary = $mt->getMovingSummary(
                $vehicle['id_device'],
                $date,
                $edt
            );
            $mileageTrack = 0;
            if (!empty($summary)) {
                $mileageTrack = floatval($summary[0]['odometer']);
            }

            $record
                = new Falcon_Record_Mon_Fuel_Consumption_Report_Item([
                'id_fuel_consumption_report' => $data['id'],
                'num' => $n + 1,
                'id_vehicle' => $vehicle['id'],
                'id_responsible_person' => $vehicle['id_responsible'],
                'consumption_rate' => $vehicle['fuel_expense'],
                //'consumption_limit' => 0,
                //'mileage_waylist' => 0,
                'mileage_track' => $mileageTrack,
                //'consumption_by_norm' => 0,
                //'consumption_fact' => 0,
                //'previous_month_remainder' => 0,
                //'received' => 0,
                //'next_month_remainder' => 0,
                //'overrun' => 0
            ]);

            $record->insert();

        }

        return $data;
    }

}
