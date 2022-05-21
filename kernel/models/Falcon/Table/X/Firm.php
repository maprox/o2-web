<?php

/**
 * Table "x_firm"
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2011-2013, Maprox LLC
 */
class Falcon_Table_X_Firm extends Falcon_Table_Common
{
    /**
     * Performs billing payments
     * @param int $firmId [opt.] Firm identifier
     */
    public function performBilling($firmId = null)
    {
        $this->query("select * from f_billing_writeoff(?)", $firmId);
    }

    /**
     * Performs billing payments calculation
     * @param string $dt [opt.] Debit date
     * @param int $firmId [opt.] Firm identifier
     */
    public function calculateBilling($dt = null, $firmId = null)
    {
        $this->query("select * from f_billing(?, ?)", [$firmId, $dt]);
    }

}
