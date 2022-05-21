<?php

/**
 * Class of "mon_waylist_route" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Waylist_Route extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $return = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);

        // Если нет связанных данных, то вычислить даты ожидания не выйдет
        if (!$addLinkedJoined) {
            return $return;
        }

        $waylists = [];
        foreach ($return as $key => $item) {
            if (empty($waylists[$item['id_waylist']])) {
                $waylists[$item['id_waylist']] = [];
            }

            $waylists[$item['id_waylist']][$item['num']] = $key;
        }

        array_walk($waylists, 'ksort');

        foreach ($waylists as $waylist) {
            $first = reset($waylist);
            $expect = strtotime($return[$first]['sdt']);
            $calculable = true;
            foreach ($waylist as $key) {
                if (empty($return[$key]['time_way'])) {
                    $calculable = false;
                }

                if ($calculable) {
                    $expect += $this->intervalToSeconds($return[$key]['time_way']);
                    $return[$key]['expect_dt'] = date(DB_DATE_FORMAT, $expect);
                    $expect += empty($return[$key]['time_stay']) ? 0 :
                        $this->intervalToSeconds($return[$key]['time_stay']);
                } else {
                    $return[$key]['expect_dt'] = null;
                }
            }
        }
        return $return;
    }

    /**
     * Fixes 'num' order when record is trashed or deleted
     * @param {Integer} $idWaylist
     */
    public function fixNumsForWaylistId($idWaylist)
    {
        $rows = $this->load(['id_waylist = ?' => $idWaylist], 'num');
        $num = 0;
        foreach ($rows as $row) {
            $num++;
            if ($row->get('num') != $num) {
                $row->set('num', $num);
                $row->update();
            }
        }
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('mon_waylist', 'mon_waylist.id = t.id_waylist',
                'mon_waylist.sdt');
        }
        return 'mon_waylist';
    }
}