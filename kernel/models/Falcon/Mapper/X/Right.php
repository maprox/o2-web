<?php

/**
 * Class of right mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_X_Right extends Falcon_Mapper_Common
{
    /**
     * Indicates, whether access should be limited by firm
     * @var Boolean
     */
    protected $firmRestriction = false;

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
        return $this->getTable()->getUserRightServiceMask(
            $alias, $idUser, $type);
    }

    /**
     * Returns all user rights
     * @param int $userId User identifier
     * @return array
     */
    public function getUserRights($userId)
    {
        return $this->loadBy(function ($sql) use ($userId) {
            $sql
                ->distinct()
                ->join(
                    ['rl' => 'x_right_level_link_right'],
                    'rl.id_right = t.id',
                    []
                )
                ->join(
                    ['rlu' => 'x_right_level_link_user'],
                    'rlu.id_right_level = rl.id_right_level
						and rlu.id_user = ' . (int)$userId,
                    []
                );
        });
    }
}
