<?php

/**
 * Class of report history table record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2011 © Maprox LLC
 * @author     sunsay <box@sunsay.ru>
 * @version    $Id: Answer.php 1277 2011-09-22 13:13:08Z agrinin $
 * @link       $HeadURL: http://vcs.maprox.net/svn/observer/Web/trunk/library/Falcon/Answer.php $
 */
class Falcon_Record_X_Report_History extends Falcon_Record_Abstract
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id_firm',
        'id_report',
        'dt',
        'username',
        'params'
    ];
}