<?php

/**
 * Journaled record trigger
 * TODO Add restore action
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Journaled extends Falcon_Record_Trigger_Abstract
{
    /**
     * Preserved original values, for journaling
     * @var array
     */
    protected $original = [];
    /**
     * Preserved changed values, for journaling
     * @var array
     */
    protected $changed = [];
    /**
     * Record instance
     * @var Falcon_Record_Abstract
     */
    protected $record = null;
    /**
     * History id
     * @var Integer
     */
    protected $idHistory = null;

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doAfterInsert($record)
    {
        $this->historyId = $this->historyWrite($record,
            Falcon_Record_X_History::OPERATION_CREATE);

        $this->record = $record;

        $data = array_filter($record->toArray());
        $primaryKey = $record->getPrimaryKey();
        foreach ($data as $key => $value) {
            if (in_array($key, $primaryKey)) {
                unset($data[$key]);
            }
        }

        $this->historyDiffWrite($data);
        if ($this->params && isset($this->params['parent'])) {
            $this->writeParent($this->params['parent'], $record);
        }
    }

    protected function doBeforeUpdate($record)
    {
        $this->original = $record->getOriginal();
        $this->changed = $record->getChanged();
    }

    protected function doAfterUpdate($record)
    {
        $this->historyId = $this->historyWrite($record,
            Falcon_Record_X_History::OPERATION_EDIT);
        $this->record = $record;
        $this->historyDiffWrite($this->changed, $this->original);
        if ($this->params && isset($this->params['parent'])) {
            $this->writeParent($this->params['parent'], $record);
        }
    }

    protected function doAfterTrash($record)
    {
        $this->historyId = $this->historyWrite($record,
            Falcon_Record_X_History::OPERATION_DELETE);
        if ($this->params && isset($this->params['parent'])) {
            $this->writeParent($this->params['parent'], $record);
        }
    }

    /**
     * @param string[] $config
     * @param Falcon_Record_Abstract $record
     */
    protected function writeParent($config, $record)
    {
        if (!isset($config['key']) || !isset($config['table'])) {
            return;
        }
        $value = $record->get($config['key']);
        if (!$value) {
            return;
        }

        $config = array_merge(['parent_key' => 'id'], $config);

        $mapper = 'Falcon_Mapper_' . ucwords_custom($config['table']);
        $parents = $mapper::getInstance()
            ->load([$config['parent_key'] . ' = ?' => $value]);
        foreach ($parents as $parent) {
            $trigger = $parent->getTrigger('journaled');
            if ($trigger) {
                $trigger->historyWrite($parent,
                    Falcon_Record_X_History::OPERATION_CHILDCHANGE,
                    json_encode(['id' => $this->historyId,
                        'name' => (string)$record]));
            }
        }
    }

    /**
     * @param $record
     * @param $action
     * @return Mixed
     */
    public function historyWrite($record, $action, $data = null)
    {
        // Make x_history entry
        $history = new Falcon_Record_X_History();
        $history->setProps([
            'id_entity' => $record->getId(),
            'id_operation' => $action,
            'entity_table' => $record->getTableName()
        ]);
        if ($data !== null) {
            $history->set('data', $data);
        }

        $history->insert();
        return $history->getId();
    }

    /**
     * @param $historyId
     * @param array $new
     * @param array $old
     */
    protected function historyDiffWrite($new, $old = [])
    {
        foreach ($new as $key => $value) {
            if (array_key_exists($key, $old)) {
                $this->historyDiffAdd($key, $value, $old[$key]);
                unset($old[$key]);
            } else {
                $this->historyDiffAdd($key, $value);
            }
        }
        foreach ($old as $key => $value) {
            $this->historyDiffAdd($key, null, $value);
        }
    }

    /**
     * @param Integer $historyId
     * @param String $key
     * @param Mixed|null $new
     * @param Mixed|null $old
     */
    protected function historyDiffAdd($key, $new, $old = null)
    {
        $idValue = Falcon_Mapper_X_History_Value::getInstance()
            ->getValueId($key);

        $history = new Falcon_Record_X_History_Diff();
        $history->setProps([
            'id_history' => $this->historyId,
            'id_value' => $idValue,
        ]);

        $types = $this->record->getColumnTypes();

        if ($this->record->haveConversionFor($key)) {
            $mapper = $this->record->getMapper();

            if ($new !== null) {
                $history->set('new_name',
                    $mapper->getConvertedNameForValue($key, $new));
            }
            if ($old !== null) {
                $history->set('prev_name',
                    $mapper->getConvertedNameForValue($key, $old));
            }
        }

        if ($new !== null) {
            $history->set('new', $new);
        }
        if ($old !== null) {
            $history->set('prev', $old);
        }
        if (isset($types[$key]) && $types[$key] == 'timestamp') {
            $history->set('is_dt', 1);
        }

        $history->insert();
    }
}