<?php

/**
 * Class for workinng with addresses
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_A_Address extends Falcon_Action_Rest_Common
{
    /**
     * Need to perform check read
     * @var Boolean
     */
    protected $checkRead = false;

    /**
     * Need to perform check create
     * @var Boolean
     */
    protected $checkCreate = false;

    /**
     * Returns get query function for single item
     * @param array $params Array of params
     * @return function
     */
    protected function getQueryItemFn($params)
    {
        $record = $this->getEntityRecord();
        $data = [
            'record' => $record,
            'firmId' => $params['firm'],
            'joined' => $this->getParam('joined'),
            'primaryKey' => $this->getParam('id'),
            'primaryKeyName' => $this->getEntityRecord()->getSimpleIdName()
        ];

        $fn = function ($sql) use ($data) {
            $langId = Falcon_Action_Address_Utils::getLangId();
            $sql
                ->joinLeft(
                    ['st' => 'a_street'],
                    'st.id_street = t.id_street' .
                    ' and st.id_lang = ' . $langId,
                    ['id_city']
                )
                ->joinLeft(
                    ['ct' => 'a_city'],
                    'ct.id_city = st.id_city' .
                    ' and ct.id_lang = ' . $langId,
                    ['id_country']
                )
                ->where("t." . $data['primaryKeyName'] . ' = ?',
                    $data['primaryKey'])
                ->where('t.id_lang = ?', $langId);
            /*if ($data['joined'])
            {
                $data['record']->getMapper()->joinForeignTables($sql);
            }*/
        };
        return $fn;
    }

    /**
     * Actions to perform before updating instance
     * @param type $c
     */
    public function onBeforeCreate($c)
    {
        parent::onBeforeCreate($c);
        if ($this->getParam('id_lang')) {
            $idLang = $this->getParam('id_lang');
        } else {
            $idLang = 2;
        }
        $c->set('id_lang', $idLang);
    }
}
