<?php

/**
 * Class of response value table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Record_Dn_Response_Value extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_response',
        'id_request_value',
        'price',
        'state'
    ];
}
