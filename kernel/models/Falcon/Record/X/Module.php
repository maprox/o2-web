<?php

/**
 * Table "x_module" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Module extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_old',
        'id_right',
        'name',
        'identifier',
        'description',
        'actions',
        'state',
        'location'
    ];
}
