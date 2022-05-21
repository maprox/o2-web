<?php

/**
 * Table "x_firm" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_X_Firm extends Falcon_Record_Abstract
{
    const
        // account types
        AT_INDIVIDUAL = 1,
        AT_BUSINESS = 0;

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_company',
        'welcome',
        'billing_disabled',
        'have_unpaid_account',
        'event_period_length',
        'product_group',
        'id_lang',
        'id_utc',
        'disable_reason',
        'disable_reason_auto',
        'individual',
        'id_contract',
        'share_key',
        'id_firm',
        'id_manager',
        'state'
    ];

    /**
     * Params for converting id to string representation
     */
    public static $nameConvertParams = [
        'field' => 'id_company',
        'convert_name' => true
    ];

    /**
     * Table fields information (types, constraints, etc.)
     * @var String[]
     */
    public static $fieldsInfo = [
        'id_company' => [
            'convert_name' => 'x_company'
        ],
    ];

    /**
     * Table names that are linked to current record
     * @var String[]
     */
    public static $linkedRecords = [
        [
            'table' => 'x_company',
            'alias' => 'company',
            'key' => 'id_company',
            'fields' => ['*']
        ],
        [
            'table' => 'dn_contract',
            'alias' => 'contract',
            'key' => 'id_contract',
            'fields' => ['*']
        ]
    ];

    /**
     * Array of record triggers
     * @var mixed
     */
    protected $triggers = [
        'logged',
        'journaled' => [
            'exclude' => [
                'onBeforeUpdate',
                'onAfterUpdate'
            ]
        ],
        'autoshared'
    ];

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        parent::insert();
        $this->checkCompany();
        $this->checkContract();
        return $this;
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $this->checkCompany();
        $this->checkContract();
        return parent::update();
    }

    /**
     * Creates x_company if it does not exist yet
     */
    protected function checkCompany()
    {
        if (!$this->get('id_company')) {
            $company = new Falcon_Record_X_Company([
                'id_firm' => $this->getId(),
                'name' => ''
            ]);
            $company->insert();
            $this->set('id_company', $company->getId());
            $this->update();
        }
    }

    /**
     * Creates dn_contract if it does not exist yet
     */
    protected function checkContract()
    {
        if (!$this->get('id_contract')) {
            $contract = new Falcon_Record_Dn_Contract([
                'id_firm' => $this->getId()
            ]);
            $contract->insert();
            $this->set('id_contract', $contract->getId());
            $this->update();
        }
    }

    /**
     * Returns a list of active clients
     * @param bool $loadFields True - load detailed data for client firm
     * @param bool $loadDeleted Load trashed
     * @return array
     */
    public function getActiveClients($loadFields = false, $loadDeleted = false)
    {
        $m = Falcon_Mapper_Dn_Account::getInstance();
        $data = $m->getClients($this->getId(), $loadDeleted);

        $list = [];
        foreach ($data as $key => $record) {
            $data[$key]['id'] = $record['id_firm_client'];

            $firm = new Falcon_Model_Firm($record['id_firm_client']);
            $company = (array)$firm->get('company');

            if (!empty($company['name'])) {
                if ($loadFields) {
                    $data[$key]['firm_client'] = $firm->getFields();
                    $data[$key]['has_docs'] = $firm->hasDocs($this->getId());
                }
                $list[] = $data[$key];
            }
        }
        return $list;
    }
}
