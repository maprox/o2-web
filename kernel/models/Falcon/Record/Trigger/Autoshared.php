<?php

/**
 * Logged record trigger
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Trigger_Autoshared extends Falcon_Record_Trigger_Abstract
{
    const DEFAULT_FIRM = 16; // Maprox LLC

    /*
     * Handlers
     * @param Falcon_Record_Abstract $record
     */
    protected function doAfterInsert($record)
    {
        if (!$record->get('id_firm')) {
            return;
        }

        $parents = [];
        $current = new Falcon_Record_X_Firm($record->get('id_firm'));
        while (true) {
            $partnerId = $current->get('id_firm');
            if (!$partnerId
                // or infinite loop may happen
                || $partnerId == $record->get('id_firm')
                || in_array($partnerId, $parents)
            ) {
                break;
            }
            $parents[] = $partnerId;
            $current = new Falcon_Record_X_Firm($partnerId);
        }

        // Add default firm
        if (empty($parents) || !in_array(self::DEFAULT_FIRM, $parents)) {
            $parents[] = self::DEFAULT_FIRM;
        }

        foreach ($parents as $parent) {
            $access = new Falcon_Record_X_Access([
                'id_object' => $record->getId(),
                'right' => $record->getTableName(),
                'id_firm' => $parent,
                'auto' => 1
            ]);
            $access->insert();
            $access->notify('grant_' . $record->getTableName());
        }
    }
}