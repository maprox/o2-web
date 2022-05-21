<?php

/**
 * Class of "mon_device_command_template" mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_Mon_Device_Command_Template extends Falcon_Mapper_Common
{
    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        if ($sql) {
            $sql->join('mon_device', 'mon_device.id = t.id_device', []);
        }
        return 'mon_device';
    }

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
        $records
            = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);

        // Get access list
        $user = Falcon_Model_User::getInstance();

        // Load last sended command
        $m = Falcon_Mapper_Mon_Device_Command::getInstance();

        foreach ($records as &$record) {
            $record['last_command'] = null;
            $recordId = $record['id'];
            $commands = $m->loadBy(function ($sql) use ($recordId) {
                $sql->where('id_command_template = ?', $recordId)
                    ->order('dt desc')
                    ->limit(1);
            });

            if (!count($commands)) {
                continue;
            }

            $record['last_command'] = $commands[0];
        }

        return $records;
    }
}