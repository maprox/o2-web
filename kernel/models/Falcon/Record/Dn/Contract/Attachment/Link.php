<?php

/**
 * Table "dn_contract_attachment_link" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Dn_Contract_Attachment_Link extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        id_contract,
        id_attachment
    ];
}
