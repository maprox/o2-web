<?php

/**
 * Group class of mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
abstract class Falcon_Mapper_Group extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param function $queryFn
     * @param array $params Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @return Mixed[]
     */
    //public function loadBy($queryFn, $queryParams = array())
    //{
    //	$records = parent::loadBy($queryFn, $queryParams);
    //	if (!$this->getParam('$hideAccessGroupGrant'))
    //	{
    //		foreach ($records as &$record)
    //		{
    //			$record['$accessGroupGrant'] = $this->accessGroup($record['id']);
    //		}
    //	}
    //	return $records;
    //}

    /**
     * Sets access data
     * @param type $records
     */
    /*public function setAccessGroupData($records)
    {
        $ids =
        foreach ($records as &$record)
        {

        }
    }*/

    /**
     * Return x_access entries for given groups' ids
     * @param type $ids
     * @return type
     */
    public function massAccessGroup($ids)
    {
        $right = str_replace('falcon_mapper_', '', strtolower(get_class($this)));
        $m = Falcon_Mapper_X_Access::getInstance();

        $records = $m->getForObjects($ids, $right);
        return $records;
    }

    /**
     * Return all x_access entries for this group
     */
    public function accessGroup($id)
    {
        $right = str_replace('falcon_mapper_', '', strtolower(get_class($this)));

        $m = Falcon_Mapper_X_Access::getInstance();
        $records = $m->getForObject($id, $right);

        return $records;
    }

    /**
     * Returns groups ids for item
     * @param Integer $itemId
     * @param Integer $firmId
     */
    public function getGroupsForItem($itemId, $firmId = null)
    {
        $groups = $this->loadBy(function ($sql) use ($itemId, $firmId) {
            $sql->join(
                ['l' => 'x_group_item_link'],
                'l.id_group = t.id',
                []
            )
                ->where('l.id_item = ?', $itemId);

            if ($firmId) {
                $sql->where('t.id_firm = ?', $firmId);
            }
        });

        $ids = [];
        foreach ($groups as $group) {
            $ids[] = $group['id'];
        }

        return array_unique($ids);
    }
}
