<?php

/**
 * Table "x_company" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Company extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Single
{
    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_firm',
        'id_director',
        'name',
        'fullname',
        'description',
        'id_address_physical',
        'id_address_legal',
        'inn',
        'kpp',
        'ogrn',
        'okpo',
        'okved',
        'signatory',
        'post',
        'state'
    ];

    /**
     * Required fields (not null)
     * @var String[]
     */
    public static $requiredFields = ['name'];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_person',
            'alias' => 'director',
            'key' => 'id_director',
            'fields' => ['*']
        ],
        [
            'table' => 'x_company_email',
            'alias' => 'email',
            'fields' => ['*']
        ],
        [
            'table' => 'x_company_phone',
            'alias' => 'phone',
            'fields' => ['*']
        ],
        [
            'table' => 'x_company_bank_account',
            'alias' => 'bank',
            'fields' => ['*']
        ],
    ];

    /**
     * Foreign keys array.
     * Example:
     * $foreignKeys = array(
     *   'id_vehicle' => array('mon_vehicle' => 'id')
     * )
     * @var String[]
     */
    public static $foreignKeys = [
        'id_address_legal' => [
            // access mapper config
            'a_address' => 'id_address',
            'tablealias' => 'a1',
            'queryPostfix' => 'and a1.id_lang = ?',
            'fields' => [
                'fullname'
            ]
        ],
        'id_address_physical' => [
            // access mapper config
            'a_address' => 'id_address',
            'tablealias' => 'a2',
            'queryPostfix' => 'and a2.id_lang = ?',
            'fields' => [
                'fullname'
            ]
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = ['logged', 'journaled'];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        parent::insert();
        $this->checkDirector();
        return $this;
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $this->checkDirector();
        return parent::update();
    }

    /**
     * Creates x_company if it does not exist yet
     */
    protected function checkDirector()
    {
        if (!$this->get('id_director')) {
            $director = new Falcon_Record_X_Person([
                'id_firm' => $this->getId()
            ]);
            $director->insert();
            $this->set('id_director', $director->getId());
            $this->update();
        }
    }

    /**
     * Add an email for current company
     * @param array $params
     */
    public function addEmail($params)
    {
        $params['id_company'] = $this->getId();
        $r = new Falcon_Record_X_Company_Email($params);
        $r->insert();
    }

    /**
     * Add a phone number for current company
     * @param array $params
     */
    public function addPhone($params)
    {
        $params['id_company'] = $this->getId();
        $r = new Falcon_Record_X_Company_Phone($params);
        $r->insert();
    }
}
