<?php

/**
 * Class for OSRM query
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Osrm
{
    const
        STATUS_SUCCESS = 0,
        STATUS_NO_ROUTE = 207,
        ZOOM_LEVEL = 15;

    /**
     * Answer data
     * @var array
     */
    protected $data = [];
    /**
     * Cache for coordinates
     * @var array
     */
    protected $coords = null;
    /**
     * Is successful
     * @var bool
     */
    protected $success = false;
    /**
     * Found route
     * @var bool
     */
    protected $haveRoute = false;

    /**
     * Constructs, makes query
     * @param {Float} $fromLat
     * @param {Float} $fromLon
     * @param {Float} $toLat
     * @param {Float} $toLon
     */
    public function __construct($fromLat, $fromLon, $toLat, $toLon)
    {
        // Если точки совпадают, нет смысла в запросе
        // Наши функции вернут всем нули и пустые массивы
        if ($fromLat == $toLat && $fromLon == $toLon) {
            $this->success = true;
            $this->haveRoute = true;
            return;
        }

        $query = "viaroute?loc=$fromLat,$fromLon&loc=$toLat,$toLon&z=" .
            self::ZOOM_LEVEL;
        $cacheString = md5(md5($query));
        $data = Falcon_Cacher::getInstance()->get('osrm', $cacheString);

        if (!$this->isCorrectData($data)) {
            $domains = Zend_Registry::get('config')->osrm->domain;
            $data = $this->getOsrm($domains, $query);

            if ($this->isCorrectData($data)) {
                Falcon_Cacher::getInstance()->set($data, 'osrm', $cacheString,
                    Falcon_Cacher::WEEK);
            }
        }

        if (!$this->isCorrectData($data)) {
            return;
        }

        if (
            $data['status'] == self::STATUS_SUCCESS
            || $data['status'] == self::STATUS_NO_ROUTE
        ) {
            $this->data = $data;
            $this->success = true;
            $this->haveRoute = ($data['status'] == self::STATUS_SUCCESS);
        }
    }

    /**
     * @param Zend_Config $domains
     * @param string $query
     * @return mixed
     */
    protected function getOsrm(Zend_Config $domains, $query)
    {
        $data = false;

        foreach ($domains as $domain) {
            try {
                $data = json_decode(file_get_contents($domain . $query), true);
            } catch (Exception $e) {
                Falcon_Logger::getInstance()->log('osrm', $domain . 'is down');
                $data = false;
            }
            if ($this->isCorrectData($data)) {
                break;
            }
        }

        return $data;
    }

    /**
     * @param $data
     * @return bool
     */
    protected function isCorrectData($data)
    {
        return !empty($data) && isset($data['status']);
    }

    /**
     * Is successful
     * @return bool
     */
    public function isSuccess()
    {
        return $this->success;
    }

    /**
     * Is successful and found route
     * @return bool
     */
    public function haveRoute()
    {
        return $this->success && $this->haveRoute;
    }

    /**
     * Returns route coords
     * @return Array
     */
    public function getCoords()
    {
        if ($this->coords === null) {
            $this->coords = isset($this->data['route_geometry']) ?
                $this->decodePolyline($this->data['route_geometry']) : [];
        }
        return $this->coords;
    }

    public function getDistance()
    {
        return isset($this->data['route_summary']['total_distance']) ?
            $this->data['route_summary']['total_distance'] : 0;
    }

    public function getTime()
    {
        $time = isset($this->data['route_summary']['total_time']) ?
            $this->data['route_summary']['total_time'] : 0;

        // Такое большое время однозначно обозначает переполнение буфера
        if ($time > 200000000) {
            return 0;
        }

        return $time;
    }

    /*
     * Copyright (c) 2008 Peter Chng, http://unitstep.net/
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * "Software"), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
     * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
     * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    /**
     * Decodes a polyline that was encoded using the Google Maps method.
     *
     * The encoding algorithm is detailed here:
     * http://code.google.com/apis/maps/documentation/polylinealgorithm.html
     *
     * This function is based off of Mark McClure's JavaScript polyline decoder
     * (http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/decode.js)
     * which was in turn based off Google's own implementation.
     *
     * This function assumes a validly encoded polyline.  The behaviour of this
     * function is not specified when an invalid expression is supplied.
     *
     * @param String $encoded the encoded polyline.
     * @return Array an Nx2 array with the first element of each entry containing
     *  the latitude and the second containing the longitude of the
     *  corresponding point.
     */
    protected function decodePolyline($encoded)
    {
        $length = strlen($encoded);
        $index = 0;
        $points = [];
        $lat = 0;
        $lng = 0;

        while ($index < $length) {
            // Temporary variable to hold each ASCII byte.
            $b = 0;

            // The encoded polyline consists of a latitude value followed by a
            // longitude value.  They should always come in pairs.  Read the
            // latitude value first.
            $shift = 0;
            $result = 0;
            do {
                // The `ord(substr($encoded, $index++))` statement returns the ASCII
                //  code for the character at $index.  Subtract 63 to get the original
                // value. (63 was added to ensure proper ASCII characters are displayed
                // in the encoded polyline string, which is `human` readable)
                $b = ord(substr($encoded, $index++)) - 63;

                // AND the bits of the byte with 0x1f to get the original 5-bit `chunk.
                // Then left shift the bits by the required amount, which increases
                // by 5 bits each time.
                // OR the value into $results, which sums up the individual 5-bit chunks
                // into the original value.  Since the 5-bit chunks were reversed in
                // order during encoding, reading them in this way ensures proper
                // summation.
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            }
                // Continue while the read byte is >= 0x20 since the last `chunk`
                // was not OR'd with 0x20 during the conversion process. (Signals the end)
            while ($b >= 0x20);

            // Check if negative, and convert. (All negative values have the last bit
            // set)
            $dlat = (($result & 1) ? ~($result >> 1) : ($result >> 1));

            // Compute actual latitude since value is offset from previous value.
            $lat += $dlat;

            // The next values will correspond to the longitude for this point.
            $shift = 0;
            $result = 0;
            do {
                $b = ord(substr($encoded, $index++)) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b >= 0x20);

            $dlng = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lng += $dlng;

            // The actual latitude and longitude values were multiplied by
            // 1e5 before encoding so that they could be converted to a 32-bit
            // integer representation. (With a decimal accuracy of 5 places)
            // Convert back to original values.
            $points[] = [$lat * 1e-5, $lng * 1e-5];
        }

        return $points;
    }
}