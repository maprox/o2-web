<?php

/**
 * Class of "dn_worker_post" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Dn_Worker_Post extends Falcon_Mapper_Common
{
    /**
     * Load records by a supplied query function
     * @param function $queryFn
     * @param array $params Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @param boolean $addLinked add linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $records = parent::loadBy($queryFn, $queryParams, $addLinkedJoined,
            $addLinked);

        // get ids
        $ids = [];
        foreach ($records as &$record) {
            $ids[] = $record['id'];
        }
        if (empty($ids)) {
            return $records;
        }
        // Load and group specializations
        $specs = $this->massLoadSpecialization($ids);
        $specMap = [];
        foreach ($specs as $spec) {
            if (!isset($specMap[$spec['id_post']])) {
                $specMap[$spec['id_post']] = [];
            }
            $specMap[$spec['id_post']][] = $spec['name'];
        }

        foreach ($records as &$record) {
            if (isset($specMap[$record['id']])) {
                $record['specialization'] = $specMap[$record['id']];
            } else {
                $record['specialization'] = [];
            }
        }
        return $records;
    }

    /**
     * Load post specializations
     * @param int $postId
     * @return string[]
     */
    function loadSpecialization($postId)
    {
        $m = Falcon_Mapper_Dn_Worker_Post_Specialization_Link::getInstance();
        $records = $m->loadBy(function ($sql) use ($postId) {
            $sql
                ->where('id_post = ?', $postId)
                ->join(
                    ['s' => 'dn_worker_specialization'],
                    's.id = t.id_specialization',
                    ['name']
                )
                ->order(['name']);
        }, ['fields' => ['']]);
        $result = [];
        foreach ($records as $spec) {
            $result[] = $spec['name'];
        }
        return $result;
    }

    /**
     * Load post specializations
     * @param int $postId
     * @return string[]
     */
    public function massLoadSpecialization($postIds)
    {
        $m = Falcon_Mapper_Dn_Worker_Post_Specialization_Link::getInstance();
        $records = $m->loadBy(function ($sql) use ($postIds) {
            $sql
                ->where('id_post IN (?)', $postIds)
                ->join(
                    ['s' => 'dn_worker_specialization'],
                    's.id = t.id_specialization',
                    ['name']
                )
                ->order(['name']);
        }, ['fields' => ['id_post']]);

        return $records;
    }

    /**
     * Set post specializations by their names
     * @param int $postId
     * @param string[] $specializationList
     */
    function setSpecialization($postId, $specializationList)
    {
        if (!$specializationList || !is_array($specializationList)) {
            return;
        }
        $specs = [];
        foreach ($specializationList as $specialization) {
            $specs[] = strtoupper($specialization);
        }

        // delete previous specializations
        $m = Falcon_Mapper_Dn_Worker_Post_Specialization_Link::getInstance();
        $m->delete(['id_post = ?' => $postId]);

        // find out specialization ids
        $ms = Falcon_Mapper_Dn_Worker_Specialization::getInstance();
        $records = $ms->loadBy(function ($sql) use ($specs) {
            $sql->where('upper(name) in (?)', $specs);
        });
        foreach ($records as $spec) {
            $m->newRecord([
                'id_post' => $postId,
                'id_specialization' => $spec['id']
            ])->insert();
        }
    }
}
