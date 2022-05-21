<?php

/**
 * Class of doc mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Doc extends Falcon_Mapper_Common
{
    /**
     * Load records by firm identifier
     * @param Integer $firmId Firm identifier
     * @param Boolean $toArray Export data to an array
     * @return instanceof Falcon_Record_Abstract[]/Array[]
     */
    public function loadByFirm($firmId, $toArray = true)
    {
        $path = Zend_Registry::get('config')->path->uploaded;
        $where = [
            'id_firm = ? or id_firm_for = ?' => $firmId
        ];
        $records = $this->load($where, $toArray);
        if ($toArray) {
            foreach ($records as &$record) {
                if (is_file($path . $record['hash'])) {
                    $size = filesize($path . $record['hash']);
                    $measure = 'b';
                    if ($size >= 1024) {
                        $size = round($size / 1024, 1);
                        $measure = 'kb';
                        if ($size >= 1024) {
                            $size = round($size / 1024, 1);
                            $measure = 'mb';
                            if ($size >= 1024) {
                                $size = round($size / 1024, 1);
                                $measure = 'gb';
                            }
                        }
                    }
                    $record['size'] = $size . ' ' . $measure;
                } else {
                    $record['size'] = 'none';
                }
            }
        }
        return $records;
    }
}