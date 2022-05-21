<?php

/**
 * Table "x_company_email" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Company_Email extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Multiple
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_company',
        'address',
        'note',
        'isprimary',
        'state'
    ];

    public static $parentFieldLink = 'id_company';
}
