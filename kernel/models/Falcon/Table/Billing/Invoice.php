<?php

/**
 * Class of invoice table
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Table_Billing_Invoice extends Falcon_Table_Common
{
    /**
     * Get users by obejct
     * Returns all users who has access to given invoice
     * @param type $record
     * @return Integer[]
     */
    public function getUsersByObject($record)
    {
        $records = $this->query("
			select xu.id from x_user xu
			join billing_account ba on ba.id_firm = xu.id_firm
			join billing_invoice bi on bi.id_account = ba.id
			where bi.id = " . $record->getId()
            . " and u_user_has_right(xu.id, 'billing_manager', 1)
		");

        $result = [];
        foreach ($records as $record) {
            $result[] = $record['id'];
        }

        return $result;
    }
}
