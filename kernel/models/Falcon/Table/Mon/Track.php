<?php

/**
 * Table "mon_track"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_Mon_Track extends Falcon_Table_Common
{
    protected $sqlBuildTrack =
        'select * from st_geographyfromtext(?)';

    protected $sqlConvertTrack =
        'select * from st_astext(?)';

    protected $sqlCalculateOdometer = 'UPDATE mon_track
		SET odometer = st_length(track)
		WHERE odometer IS NULL
		  AND track IS NOT NULL';

    protected $sqlCheckDistance =
        'select * from st_length(st_geographyfromtext(?))';

    protected $sqlCalculateActualOdometer =
        'UPDATE mon_track
			SET actual_odometer = CASE
				WHEN prev.odometer IS NOT NULL THEN curr.odometer + prev.odometer
				ELSE curr.odometer
			END
		FROM mon_track curr
			LEFT JOIN mon_track prev
				ON curr.sdt = prev.edt
				AND prev.type = \'sleep\'
				AND prev.odometer > 0
		WHERE mon_track.id = curr.id
			AND mon_track.type = \'moving\'
			AND mon_track.id_device = ?
			AND mon_track.actual_odometer IS NULL';

    protected $sqlMovingSummary =
        "select * from r_moving_summary(?, ?, ?, ?, ?)";

    /**
     * Returns last track edt for device
     * @param int $deviceId
     * @return {String}
     */
    public function getEdtForDevice($deviceId)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('mon_track', ['edt'])
            ->where('id_device = ?', $deviceId)
            ->where('state != ?', Falcon_Record_Abstract::STATE_DELETED)
            ->order('edt desc')
            ->limit(1);

        return $db->query($sql)->fetchColumn();
    }

    /**
     * Get moving summary
     * @param type $idDevice
     * @param type $sdt
     * @param type $idUser
     * @param string $edt
     * @param type $shift
     * @return type
     */
    public function getMovingSummary($idDevice, $sdt, $edt, $idUser = null, $shift = null)
    {
        return $this->query($this->sqlMovingSummary, [
            $idUser,
            (string)$idDevice,
            $sdt,
            $edt,
            $shift
        ]);
    }

    /**
     * Создает строчку для объекта geography
     * @param {Float[][]} $matrix Матрица lng/lat точек пути
     * @return {String}
     */
    protected function buildLineString($matrix)
    {
        $lineString = 'SRID=4326;';

        if (count($matrix) == 0) {
            return false;
        }

        if (count($matrix) == 1) {
            $lineString .= 'POINT(';
        } else {
            $lineString .= 'LINESTRING(';
        }

        foreach ($matrix as $item) {
            $lineString .= rtrim($item['lng'], 0) . ' ' .
                rtrim($item['lat'], 0) . ',';
        }

        return rtrim($lineString, ', ') . ')';
    }

    /**
     * Создает объект geography при использовании Postgis
     * @param {Float[][]} $matrix Матрица lng/lat точек пути
     * @return {String}
     */
    public function buildTrack($matrix)
    {
        $lineString = $this->buildLineString($matrix);

        if (empty($lineString)) {
            return;
        }

        return $this->queryCell($this->sqlBuildTrack, $lineString);
    }

    /**
     * Создает объект geography для стоянки при использовании Postgis
     * @param {Float[][]} $matrix Матрица lng/lat точек пути
     * @return {String}
     */
    public function buildSleepTrack($matrix)
    {
        $config = Zend_Registry::get('config');
        $config = $config->tracks;

        if (count($matrix) == 1) {
            $point = reset($matrix);
            $lng = $point['lng'];
            $lat = $point['lat'];
        } else {
            $start = array_shift($matrix);
            $end = array_pop($matrix);
            $edge = max(1, count($matrix));
            $lng = $start['lng'] * $edge / 2 + $end['lng'] * $edge / 2;
            $lat = $start['lat'] * $edge / 2 + $end['lat'] * $edge / 2;
            foreach ($matrix as $item) {
                $lng += $item['lng'];
                $lat += $item['lat'];
            }
            $lng = round($lng / ($edge + count($matrix)), 6);
            $lat = round($lat / ($edge + count($matrix)), 6);

            $lineString = $this->buildLineString(
                [$start, ['lng' => $lng, 'lat' => $lat]]);
            $checkLength = $this->queryCell($this->sqlCheckDistance,
                $lineString);

            if (
                $checkLength > $config->max_stop_fluctuation
                || count($matrix) == 0
            ) {
                $lng = $start['lng'];
                $lat = $start['lat'];
            }
        }

        return $this->buildTrack([['lng' => $lng, 'lat' => $lat]]);
    }

    /**
     * Обновляет пустые одометры, вычисляя их из трека
     */
    public function calculateOdometer()
    {
        $this->query($this->sqlCalculateOdometer);
    }

    /**
     * Конвертирует трек из формата Postgis в массив координат
     * @param {String} $track
     * @return {Float[][]}
     */
    public function convertTrack($track)
    {
        if (empty($track)) {
            return '';
        }

        return $this->queryCell($this->sqlConvertTrack, $track);
    }

    /**
     * Recalculates actual odometer field
     */
    public function recalculateActualOdometer($deviceId)
    {
        $this->query($this->sqlCalculateActualOdometer, $deviceId);
    }
}
