<?php

/**
 * Class of history record
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2010-2012, Maprox LLC
 */
class Falcon_Record_Billing_History extends Falcon_Record_Abstract
{
    const SUCCESS_MESSAGE = 'Account refill';

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_account',
        'id_invoice',
        'dt',
        'balance',
        'sum',
        'note',
        'debitdt',
        'state'
    ];

    protected $limitTemplatesPermanent = [
        2 => 'Изменение минимального порога отключения. Было %d руб. Стало %d руб.',
        1 => 'Balance limit changed. Was %d rub. Became %d rub.'
    ];

    protected $limitTemplatesTemp = [
        2 => 'Изменение минимального порога отключения на %d руб. до %s',
        1 => 'Balance limit changed to %d rub. for %s'
    ];

    /**
     * Returns template for history of changing limit
     */
    public function getLimitTemplate($langId, $permanent)
    {
        return $permanent ?
            $this->limitTemplatesPermanent[$langId] :
            $this->limitTemplatesTemp[$langId];
    }
}
