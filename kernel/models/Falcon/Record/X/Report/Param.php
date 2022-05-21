<?php

/**
 * Class of report param table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Record_X_Report_Param extends Falcon_Record_Abstract implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'alias',
        'param_type'
    ];

    /**
     * Parent key link
     * @var type
     */
    public static $parentFieldLink = 'id';
}
