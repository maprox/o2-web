<?php

/**
 * Table "x_module"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Table_X_Module extends Falcon_Table_Common
{
    /**
     * Get available user modules
     *
     * @param Integer $idUser Users id
     * @param String $location - "index" or "admin", all if empty
     * @return {Array[]}
     */
    public function loadForUser($idUser, $location = false)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->distinct()
            ->from(
                ['m' => 'x_module'],
                ['id', 'identifier']
            )
            ->join(
                ['rlr' => 'x_right_level_link_right'],
                'rlr.id_right = m.id_right',
                []
            )
            ->join(
                ['rlu' => 'x_right_level_link_user'],
                'rlr.id_right_level = rlu.id_right_level',
                []
            )
            ->where('rlu.id_user = ?', $idUser);

        if (!empty($location)) {
            $sql
                ->join(
                    ['l' => 'x_location'],
                    'm.location = l.bitmask',
                    []
                )
                ->where('l.alias = ?', $location);
        }
        $rows = $db->query($sql)->fetchAll(Zend_Db::FETCH_ASSOC);
        return $this->tryToCastRowsToInt($rows);
    }
}
