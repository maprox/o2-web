<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_X_History extends Falcon_Action_Rest_Readonly
{
    /**
     * Creates helper for access checking
     * @return Falcon_Action_Rest_Helper_Access
     */
    protected function createAccessHelper()
    {
        $access = new Falcon_Action_Rest_Helper_Access(
            $this->getParam('entity_table'),
            $this->getParam('id_entity', false));

        $access->setShared(false);

        return $access;
    }

    /**
     * Makes sql changes
     * @param Zend_Db_Select $sql
     * @param Mixed[] $data
     */
    public function makeQueryListSql($sql, $data)
    {
        // Не добавляем колонки в подсчет данных
        if ($data['total']) {
            $columnsPerson = [];
            $columnsFirm = [];
        } else {
            $columnsPerson = ['firstname', 'lastname'];
            $columnsFirm = ['name as firm_name'];
        }

        $entityTable = $this->getParam('entity_table');
        $idEntity = $this->getParam('id_entity');
        /*
        select
            h.dt,
            h.id_operation,
            p.firstname || ' ' || p.lastname,
            c.name
            from x_history h
            join x_user u on u.id = h.id_user
            join x_person p on p.id  = u.id_person
            join mon_device d on d.id = 10863
            join x_firm f on f.id  = d.id_firm
            join x_company c on c.id  = f.id_company
            where h.entity_table = 'mon_device'
            and h.id_entity = 10863
            order by dt
         */
        $db = Zend_Db_Table::getDefaultAdapter();
        $sql->joinLeft(
            ['u' => 'x_user'],
            'u.id = t.id_user',
            []
        )
            ->joinLeft(
                ['p' => 'x_person'],
                'p.id = u.id_person',
                $columnsPerson
            )
            ->join(
                ['e' => $entityTable],
                $db->quoteInto('e.id = ?', $idEntity),
                []
            )
            ->joinLeft(
                ['f' => 'x_firm'],
                'f.id = e.id_firm',
                []
            )
            ->joinLeft(
                ['c' => 'x_company'],
                'c.id = f.id_company',
                $columnsFirm
            )
            ->where('t.entity_table = ?', $entityTable)
            ->where('t.id_entity = ?', $idEntity);
    }

    /**
     * Processes read records before giving them away
     * @param {Mixed[]} $records
     * @return Mixed[]
     */
    protected function processRecords($records)
    {
        $records = parent::processRecords($records);

        // Json decode data field, get child ids
        $childIds = [];
        $matrix = [];
        foreach ($records as &$record) {
            if (!empty($record['data'])) {
                $record['data'] = json_decode($record['data'], true);
                if ($record['id_operation']
                    == Falcon_Record_X_History::OPERATION_CHILDCHANGE
                ) {

                    $id = (int)$record['data']['id'];
                    if (!isset($matrix[$id])) {
                        $matrix[$id] = [];
                    }
                    $matrix[$id][] = &$record;
                    $childIds[] = $id;
                }
            }
        }

        // get child records by gathered ids
        if (!empty($childIds)) {
            $mapper = Falcon_Mapper_X_History::getInstance();
            $childs = $mapper->loadBy(function ($sql) use ($childIds) {
                $sql->where('id in (?)', $childIds);
            });

            foreach ($childs as $child) {
                foreach ($matrix[$child['id']] as &$parent) {
                    $parent['data'] = array_merge($parent['data'], $child);
                }
            }
        }

        return $records;
    }
}
