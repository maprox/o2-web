<?php

/**
 * Class of right table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 */
class Falcon_Table_X_Right extends Falcon_Table_Common
{
    /**
     * Get users service rights mask on given access right
     *
     * @param String $alias Access alias
     * @param Integer $idUser Users id
     * @param Integer $type Type of access
     * @return Integer
     */
    public function getUserRightServiceMask($alias, $idUser, $type)
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from(['u' => 'x_right_level_link_user'], [])
            ->join(
                ['rl' => 'x_right_level_link_right'],
                'rl.id_right_level = u.id_right_level',
                []
            )
            ->join(
                ['r' => 'x_right'],
                'r.id = rl.id_right',
                ['bit_or(r.service)']
            )
            ->where('u.id_user = ?', $idUser)
            ->where('r.alias = ?', $alias)
            ->where('r.type & ? > 0', $type)
            ->group('r.alias');
        $column = $db->query($sql)->fetchColumn();
        return (int)$column;
    }
}
