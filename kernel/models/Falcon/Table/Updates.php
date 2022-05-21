<?php

/**
 * Class of updates table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Updates extends Falcon_Table_Common
{
    /**
     * Load update aliases
     * @var String
     */
    private $sqlGetAliases = 'SELECT DISTINCT alias
		FROM updates
		WHERE
			(id_firm = ? OR id_user = ?)
			AND dt > ?';

    /**
     * Load update aliases for period
     * @var String
     */
    private $sqlGetAliasesForPeriod = 'SELECT DISTINCT alias
		FROM updates
		WHERE
			(id_firm = ? OR id_user = ?)
			AND dt > ? AND dt <= ?';

    /**
     * Получение алиасов объектов, которые необходимо обновить
     * @param {Date} $sdt Дата, начиная с которой нужно проверять обновления
     * @param {Integer} $idUser Id пользователя
     * @param {Integer} $idFirm Id фирмы пользователя
     * @return String[] Массив алиасов, которые были обновлены
     */
    public function getAliases($sdt, $idUser, $idFirm)
    {
        $data = $this->query($this->sqlGetAliases, [$idFirm, $idUser, $sdt]);
        return array_map('reset', $data);
    }

    /**
     * Load aliases in specified period
     * @param {Date} $sdt start date
     * @param {Integer} $idUser User id
     * @param {Integer} $idFirm Firm id
     * @return String[] Aliases
     */
    public function getAliasesForPeriod($sdt, $edt, $idUser, $idFirm)
    {
        $data = $this->query($this->sqlGetAliasesForPeriod,
            [$idFirm, $idUser, $sdt, $edt]);
        return array_map('reset', $data);
    }

    /**
     * Returns updates
     * @param type $sdt
     * @param type $edt
     * @param type $userId
     * @param type $firmId
     * @param type $aliases
     */
    public function getUpdates($sdt, $edt, $userId, $firmId, $aliases = [])
    {
        $db = $this->_db;
        $sql = $db->select()
            ->from('updates')
            ->where(
                $db->quoteInto('id_firm = ?', $firmId)
                . ' or ' .
                $db->quoteInto('id_user = ?', $userId)
            )
            ->where('dt > ?', $sdt)
            ->where('dt <= ?', $edt)
            //->where('id_entity IS NOT NULL')
            ->order('dt ASC');

        if (!empty($aliases)) {
            $sql->where('alias IN(?)', $aliases);
        }

        $rows = $db->query($sql)->fetchAll();
        return $rows;
    }
}