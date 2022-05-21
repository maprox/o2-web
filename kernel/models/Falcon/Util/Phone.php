<?php

/**
 * Utility for phone manipulations
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */
class Falcon_Util_Phone
{
    /**
     * Formats supplied phone to international standart
     * @param string $value
     * @return string
     */
    static public function normalize($value)
    {
        $result = preg_replace('/[^0-9]/', '', $value);
        if ((strlen($result) > 0) && ($result[0] == '8')) {
            // russian fix for first "8"
            $result[0] = '7';
        }
        return $result;
    }
}

?>
