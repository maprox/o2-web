<?php

/**
 * Class of package mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Mapper_N_Work extends Falcon_Mapper_Common
{
    /**
     * Process work
     * @param {Array} $data
     */
    public function processWork($data)
    {
        $logger = Falcon_Logger::getInstance();
        // Get action alias
        if (isset($data['type'])) {
            $type = $data['type'];
            unset($data['type']);
        } else {
            $type = null;
        }

        // Create new n_work entry
        $work = $this->add($type, $data);

        // Execute work
        $workRecord = new Falcon_Record_N_Work($work);
        try {
            $workRecord->execute();
        } catch (Exception $e) {
            Falcon_Logger::getInstance()
                ->log('action', $e->getMessage());
        }
    }

    /**
     * Executes works with state 2 (e.g. sended sms)
     */
    public function processPendingWorks()
    {
        $undoneWorks = Falcon_Mapper_N_Work::getInstance()->load([
            'state = ?' => Falcon_Record_Abstract::STATE_INACTIVE//,
            //'id_notification_action_type != ?' => 1 // Not "popup"
        ], false, true);
        foreach ($undoneWorks as $work) {
            try {
                $work->execute();
            } catch (Exception $e) {
                Falcon_Logger::getInstance()
                    ->log('action', $e->getMessage());
            }
        }
    }

    /**
     * Load records by a supplied query function
     * @param Callable $queryFn
     * @param array $queryParams Sort and paging params
     * @param boolean $addLinkedJoined add joined data for linked records
     * @return Mixed[]
     */
    public function loadBy($queryFn, $queryParams = [],
                           $addLinkedJoined = false, $addLinked = true)
    {
        $data = parent::loadBy($queryFn, $queryParams,
            $addLinkedJoined, $addLinked);
        $links = [];
        foreach ($data as $key => $row) {
            if (isset($row['params'])) {
                $params = json_decode($row['params']);
                if (isset($params->packetId)) {
                    $links[$params->packetId] = &$data[$key];
                }
            }
        }

        $mapper = Falcon_Mapper_Mon_Packet::getInstance();
        if (!empty($links)) {
            $ids = array_keys($links);
            $packets = $mapper->load(['id in (?)' => $ids]);
            foreach ($packets as $packet) {
                if (isset($links[$packet->getId()])) {
                    $links[$packet->getId()]['packet'] = $packet;
                }
            }
        }

        // TODO: doesn't this whole loadBy looks like spike-nail?
        $works = [];
        foreach ($data as $row) {
            $work = [
                'id' => $row['id'],
                'message' => $row['message'],
                'dt' => $row['dt'],
                'params' => $row['params']
            ];
            if (isset($row['packet'])) {
                $work['packet'] = $row['packet']->toArray();
            }
            $works[] = $work;
        }

        return $works;
    }

    /**
     * Insert custom work
     * @param string $alias
     * @param array $data
     */
    public function add($alias, array $data)
    {
        $logger = Falcon_Logger::getInstance();
        // One active work of type per user
        $isSingleton = 0;
        // Should we add an update for work
        $isFrontendSend = 0;

        $mw = Falcon_Mapper_N_Work::getInstance();

        $params = [];
        if ($alias) {
            $m = Falcon_Mapper_N_Notification_Action_Type::getInstance();
            $params = [
                'id_notification_action_type' => $m->getIdByType($alias)
            ];

            // Action type
            $actionType = $m->getRecordByType($alias);
            if ($actionType) {
                $isSingleton = $actionType->get('singleton');
                $isFrontendSend = $actionType->get('frontend_send');
            }

            // If singleton, check if user already have active work
            if ($isSingleton && !empty($data['id_user'])) {
                $idUser = $data['id_user'];
                $check = $mw->loadBy(function ($sql) use ($actionType, $idUser) {
                    $sql->where('id_notification_action_type = ?',
                        $actionType->get('id'))
                        ->where('send_to = ?::text', $idUser)
                        ->where('state = ?',
                            Falcon_Record_Abstract::STATE_ACTIVE);
                });

                if ($check) {
                    if (count($check)) {
                        return;
                    }
                }
            }
        }

        $recordParams = isset($data['params']) ? $data['params'] : [];
        if (!is_array($recordParams)) {
            $recordParams = [];
        }
        foreach ($data as $key => $value) {
            if ($value != null) {
                $params[$key] = $value;
                if (in_array($key, [
                    'subject',
                    'bin',
                    'flash'
                ])) {
                    $recordParams[$key] = $value;
                }
            }
        }
        if (!empty($recordParams)) {
            $params['params'] = $recordParams;
        }
        if (isset($params['params'])) {
            $params['params'] = @json_encode($params['params']);
        }
        $record = $this->insertRecord($this->newRecord($params));

        // If popup add entry to updates table for user
        if ($isFrontendSend) {
            Falcon_Action_Update::add([
                'alias' => 'n_work',
                'id_user' => $params['send_to'],
                'id_entity' => $record,
                'id_operation' => Falcon_Record_X_History::OPERATION_CREATE
            ]);
        }

        return $record;
    }

    /**
     * Applies joins needed to get to firm id.
     * By default, none.
     * Returns table name for query building
     * @param {Zend_Db_Select}
     */
    public function addFirmJoin($sql = null)
    {
        // Return only popups for current user
        $user = Falcon_Model_User::getInstance();
        if ($sql) {
            $sql->join('x_user', 't.send_to = x_user.id::text', [])
                //->where('t.id_notification_action_type = ?', 1)
                ->where('x_user.id = ?', $user->getId());
        }
        return 'x_user';
    }
}