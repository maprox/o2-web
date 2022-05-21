<?php

/**
 * Notfication settings mapper
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Mapper_X_Notification_Setting extends Falcon_Mapper_Common
{
    protected $importanceNames = [];

    /**
     * Loads all settings
     * @param Integer $userId users Id
     * @return Array request data
     */
    public function loadByUser($userId, $importance = null)
    {
        $settings = $this->getTable()->loadWithImportance($userId, $importance);
        $importanceNames = $this->getImportance();
        foreach ($settings as &$setting) {
            $importanceIds = $setting['importance'];
            $importanceIds = trim($importanceIds, '{}');
            $importanceIds = explode(',', $importanceIds);
            foreach ($importanceIds as $id) {
                if (isset($importanceNames[$id])) {
                    $setting[$importanceNames[$id]] = true;
                }
            }

            unset($setting['importance']);
        }
        unset($setting);
        return $settings;
    }

    public function createWithImportance($data)
    {
        $importanceIds = $this->getImportance(true);

        $record = new Falcon_Record_X_Notification_Setting($data, false, false);
        $record->insert();

        foreach ($data as $key => $value) {
            if (!empty($value) && array_key_exists($key, $importanceIds)) {
                $importance = new Falcon_Record_X_Notification_Setting_Importance([
                    'id_setting' => $record->getId(),
                    'id_importance' => $importanceIds[$key],
                    'state' => 1
                ]);
                $importance->insert();
            }
        }

        return $record->getId();
    }

    public function updateWithImportance($data)
    {
        $importanceIds = $this->getImportance(true);

        $record = new Falcon_Record_X_Notification_Setting($data['id']);
        foreach ($data as $key => $value) {
            if (array_key_exists($key, $importanceIds)) {
                $importanceId = [
                    'id_setting' => $record->getId(),
                    'id_importance' => $importanceIds[$key]
                ];
                $importance = new Falcon_Record_X_Notification_Setting_Importance($importanceId);
                $importanceExist = ($importance->get('state') == 1);
                if ((bool)$value != $importanceExist) {
                    if ($importanceExist == false) {
                        $importance->setProps($importanceId)
                            ->setProps(['state' => 1])->insert();
                    } else {
                        $importance->delete();
                    }
                }
            } elseif (in_array($key, $record->getFields())) {
                $record->set($key, $value);
            }
        }
        $record->update();
    }

    public function deleteWithImportance($data)
    {
        $importanceIds = $this->getImportance(true);

        $record = new Falcon_Record_X_Notification_Setting($data['id']);
        $idSetting = $record->getId();
        $record->trash();

        $importance = Falcon_Mapper_X_Notification_Setting_Importance::getInstance();
        $importance->delete(['id_setting = ?' => $idSetting]);
    }

    protected function getImportance($reverse = false)
    {
        if (empty($this->importanceNames)) {
            $importanceList = Falcon_Mapper_X_Notification_Importance::getInstance()
                ->load(null, true);

            foreach ($importanceList as $importance) {
                $this->importanceNames[$importance['id']] =
                    strtolower($importance['name']);
            }
        }

        if ($reverse) {
            return array_flip($this->importanceNames);
        } else {
            return $this->importanceNames;
        }
    }
}
