<?php

/**
 * Table "mon_device_setting" record class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Record_Mon_Device_Setting extends Falcon_Record_Abstract
    implements Falcon_Record_Interface_Link_Multiple
{
    const
        IDENTIFIER = 'identifier',
        VERSION = 'version',
        PHONE = 'phone',
        PHONE_NORMALIZED = 'phone_normalized',
        RAW = 'raw';

    /**
     * Table fields
     * @var String[]
     */
    public static $fields = [
        'id',
        'id_device',
        'id_protocol',
        'option',
        'value',
        'state',
    ];

    public static $parentFieldLink = 'id_device';

    /**
     * Insert record to the table
     * @return Falcon_Record_Abstract
     */
    public function insert()
    {
        $this->normalizePhone();
        return parent::insert();
    }

    /**
     * Update record in the table
     * @return Falcon_Record_Abstract
     */
    public function update()
    {
        $this->normalizePhone();
        return parent::update();
    }

    /**
     * Phone normalization
     */
    private function normalizePhone()
    {
        $value = $this->get('value');
        if ($this->get('option') == self::PHONE) {
            // check if normalized phone record already exists
            $newOption = Falcon_Record_Mon_Device_Setting::PHONE_NORMALIZED;
            $record = $this->getMapper()->load([
                'id_device = ?' => $this->get('id_device'),
                'id_protocol = ?' => $this->get('id_protocol'),
                'state = ?' => Falcon_Record_Abstract::STATE_ACTIVE,
                'option = ?' => $newOption
            ]);
            if (!$record) {
                // prepare data for inserting new record
                $data = $this->toArray();
                $data['option'] = $newOption;
                unset($data['id']);
                // create new setting record
                $record = new Falcon_Record_Mon_Device_Setting($data);
                $record->insert();
            }
            if ($record instanceof Falcon_Record_Mon_Device_Setting) {
                $record->set('value', Falcon_Util_Phone::normalize($value));
                $record->update();
            }
        }
    }

}
