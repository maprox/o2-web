<?php

function xml2assoc($xml)
{
    $tree = null;
    while ($xml->read()) {
        switch ($xml->nodeType) {
            case XMLReader::END_ELEMENT:
                return $tree;
            case XMLReader::ELEMENT:
                $node = [
                    'tag' => $xml->name,
                    'value' => $xml->isEmptyElement ? '' : xml2assoc($xml)
                ];
                if ($xml->hasAttributes)
                    while ($xml->moveToNextAttribute())
                        $node['attributes'][$xml->name] = $xml->value;
                $tree[] = $node;
                break;
            case XMLReader::TEXT:
            case XMLReader::CDATA:
                $tree .= $xml->value;
        }
    }
    return $tree;
}

class SampleController extends Falcon_Controller_Action
{
    /**
     * Инициализация контроллера
     */
    public function init()
    {
        parent::init();
        // TODO убрать
        $this->_skipAccessCheck = true;
    }

    /**
     * index
     */
    public function indexAction()
    {
        Falcon_Action_Package_Factory::initPackage('sdesk', [
            'cleanup' => true,
            'id_firm' => 16
        ]);
        //$m = Falcon_Mapper_Mon_Packet::getInstance();
        //return $this->sendAnswer(new Falcon_Message($m->loadByUser(9876)));
        //$this->importProduct1C();
        //$this->importWarehouse1C();
    }

    public function importProduct1C()
    {
        define('TYPE_1C_PRODUCT', 'СправочникСсылка.Номенклатура');
        define('TYPE_1C_MEASURE', 'СправочникСсылка.КлассификаторЕдиницИзмерения');

        $config = Zend_Registry::get('config');
        $xmlFileName = $config->path->root . 'products.xml';

        $xml = new XMLReader();
        $xml->open($xmlFileName);
        $data = xml2assoc($xml);
        $xml->close();

        $measures = [];
        $products = [];

        $items = $data[0]['value'];
        foreach ($items as $item) {
            if ($item['tag'] != 'Объект') continue;

            $item_data = [];
            $item_data['npos'] = $item['attributes']['Нпп']; //
            $item_data['type'] = $item['attributes']['Тип']; // СправочникСсылка.Номенклатура
            $item_data['is_group'] = false;
            $item_data['code'] = null;

            foreach ($item['value'] as $record) {
                if ($record['tag'] === 'Ссылка') {
                    $record_npos = $record['attributes']['Нпп'];
                    if ($record_npos === $item_data['npos']) {
                        // check if it is a group
                        foreach ($record['value'] as $prop) {
                            $propname = $prop['attributes']['Имя'];
                            $propvalue = null;
                            foreach ($prop['value'] as $propval) {
                                if ($propval['tag'] === 'Значение') {
                                    $propvalue = $propval['value'];
                                    break;
                                }
                            }
                            switch ($propname) {
                                case 'ЭтоГруппа':
                                    $item_data['is_group'] = ($propvalue === 'true');
                                    break;
                                case 'Код':
                                    $item_data['code'] = $propvalue;
                                    break;
                            }
                        }
                    }
                } elseif ($record['tag'] === 'Свойство') {
                    $propname = $record['attributes']['Имя'];
                    $propvalue = null;
                    foreach ($record['value'] as $propval) {
                        if ($propval['tag'] === 'Значение') {
                            $propvalue = $propval['value'];
                        } elseif ($propval['tag'] === 'Ссылка') {
                            $propvalue = [];
                            foreach ($propval['value'] as $propval_item) {
                                $propval_item_name = $propval_item['attributes']['Имя'];
                                if ($propval_item_name === 'Код')
                                    $propvalue['code'] = $propval_item['value'][0]['value'];
                            }
                            $propvalue['npos'] = $propval['attributes']['Нпп'];
                        }
                    }
                    switch ($propname) {
                        case 'Наименование':
                            $item_data['name'] = $propvalue;
                            break;
                        case 'НаименованиеПолное':
                            $item_data['fullname'] = $propvalue;
                            break;
                        case 'Родитель':
                            $item_data['parent_npos'] = $propvalue['npos'];
                            $item_data['parent_code'] = $propvalue['code'];
                            break;
                        case 'БазоваяЕдиницаИзмерения':
                            if (isset($propvalue['code']))
                                $item_data['measure'] = $measures[$propvalue['code']];
                    }
                }
            }

            if ($item_data['type'] === TYPE_1C_MEASURE) {
                $measures[$item_data['code']] = $item_data;
            }
            // WTF??? DIRTY DIRTY DIRTY!!!
            if (isset($item_data['parent_code'])
                && $item_data['parent_code'] != '00000000005'
                && $item_data['parent_code'] != '00000000009'
                && $item_data['parent_code'] != '00000000010'
                && $item_data['parent_code'] != '00000000013'
                && $item_data['parent_code'] != '00000000014'
                && $item_data['parent_code'] != '00000000028'
                && $item_data['parent_code'] != '00000000150'
                && $item_data['parent_code'] != '00000000171'
                && $item_data['parent_code'] != '00000000212'
                && $item_data['parent_code'] != '00000000217'
                && $item_data['parent_code'] != '00000000238'
                && $item_data['parent_code'] != '00000000332'
            ) {
                if ($item_data['type'] === TYPE_1C_PRODUCT) {
                    $products[$item_data['code']] = $item_data;
                }
            }

        }

        /*
Array
(
    [npos] => 2
    [type] => СправочникСсылка.Номенклатура
    [is_group] => 1
    [code] => 00000000030
    [name] => Плодово-овощная
    [parent_npos] => 3
    [parent_code] => 00000000001
    [fullname] => 
)
        */
        vd('no import');
        // insert into database
        foreach ($products as $item) {
            if ($item['is_group']) continue;

            $mm = Falcon_Mapper_Dn_Measure::getInstance();
            $item['id_measure'] = $mm->getIdByName($item['measure']['name']);

            $product = new Falcon_Record_Dn_Product($item);
            $product->insert();

            $article = new Falcon_Record_Dn_Article([
                'id_group' => 1000,
                'id_product' => $product->getId(),
                'code' => $item['code']
            ]);
            $article->insert();
        }
    }

    public function importWarehouse1C()
    {
        define('TYPE_1C_WAREHOUSE', 'СправочникСсылка.Склады');

        $config = Zend_Registry::get('config');
        $xmlFileName = $config->path->root . 'warehouses.xml';

        $xml = new XMLReader();
        $xml->open($xmlFileName);
        $data = xml2assoc($xml);
        $xml->close();

        $warehouses = [];

        $items = $data[0]['value'];
        foreach ($items as $item) {
            if ($item['tag'] != 'Объект') continue;

            $item_data = [];
            $item_data['npos'] = $item['attributes']['Нпп']; //
            $item_data['type'] = $item['attributes']['Тип']; // СправочникСсылка.Номенклатура
            $item_data['is_group'] = false;
            $item_data['code'] = null;

            foreach ($item['value'] as $record) {
                if ($record['tag'] === 'Ссылка') {
                    $record_npos = $record['attributes']['Нпп'];
                    if ($record_npos === $item_data['npos']) {
                        // check if it is a group
                        foreach ($record['value'] as $prop) {
                            $propname = $prop['attributes']['Имя'];
                            $propvalue = null;
                            foreach ($prop['value'] as $propval) {
                                if ($propval['tag'] === 'Значение') {
                                    $propvalue = $propval['value'];
                                    break;
                                }
                            }
                            switch ($propname) {
                                case 'ЭтоГруппа':
                                    $item_data['is_group'] = ($propvalue === 'true');
                                    break;
                                case 'Код':
                                    $item_data['code'] = $propvalue;
                                    break;
                            }
                        }
                    }
                } elseif ($record['tag'] === 'Свойство') {
                    $propname = $record['attributes']['Имя'];
                    $propvalue = null;
                    foreach ($record['value'] as $propval) {
                        if ($propval['tag'] === 'Значение') {
                            $propvalue = $propval['value'];
                        } elseif ($propval['tag'] === 'Ссылка') {
                            $propvalue = [];
                            foreach ($propval['value'] as $propval_item) {
                                $propval_item_name = $propval_item['attributes']['Имя'];
                                if ($propval_item_name === 'Код')
                                    $propvalue['code'] = $propval_item['value'][0]['value'];
                            }
                            $propvalue['npos'] = $propval['attributes']['Нпп'];
                        }
                    }
                    switch ($propname) {
                        case 'Наименование':
                            $item_data['name'] = $propvalue;
                            break;
                        case 'Комментарий':
                            $item_data['address'] = $propvalue;
                            break;
                        case 'НаименованиеПолное':
                            $item_data['fullname'] = $propvalue;
                            break;
                        case 'Родитель':
                            $item_data['parent_npos'] = $propvalue['npos'];
                            $item_data['parent_code'] = $propvalue['code'];
                            break;
                    }
                }
            }

            if ($item_data['type'] === TYPE_1C_WAREHOUSE) {
                $warehouses[$item_data['code']] = $item_data;
            }

        }

        // insert into database
        foreach ($warehouses as $item) {
            if ($item['is_group']) continue;

            $warehouse = new Falcon_Record_Dn_Warehouse([
                'id_firm' => 171983,
                'name' => $item['name'],
                'address' => $item['address']
            ]);
            $warehouse->insert();
        }
    }

}