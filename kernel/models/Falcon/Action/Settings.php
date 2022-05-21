<?php

/**
 * @project    Maprox <http://www.maprox.net>
 *
 * Settings model
 */
class Falcon_Action_Settings extends Falcon_Action_Abstract
{
    /**
     * Load settings for specified user
     * @param int $userId
     * @return Falcon_Message
     */
    public function loadForUser($userId = null)
    {
        // Do not request current user data again
        $currentUser = Falcon_Model_User::getInstance();
        if ($currentUser->getId() != $userId) {
            $currentUser = new Falcon_Model_User($userId);
        }

        // Проверяем нет ли кеша настроек
        $id = $currentUser->getId();
        if (is_numeric($id) && $id > 0) {
            $cachedAnswer = $this->getCached($id);
        }

        // Если есть, возвращаем из кеша
        if (!empty($cachedAnswer) && $cachedAnswer instanceOf Falcon_Message) {
            return $cachedAnswer;
        }

        // If not from cache reload user
        $user = new Falcon_Model_User($userId);

        // запрашиваем общие настройки пользователя
        $answer = Falcon_Mapper_X_User::getInstance()->loadSettingsFor($id);
        if ($answer->isFailure()) {
            return $answer;
        }

        // заправшиваем список прав пользователя
        $rightList = [];
        foreach ($user->getRights() as $right) {
            $rightList[] = [
                'id' => (int)$right['id'],
                'name' => $right['alias'],
                'fullname' => $right['name'],
                'type' => $right['type']
            ];
        }
        $data = $answer->getData();
        $data[] = [
            'id' => 'rights',
            'value' => $rightList
        ];

        // loading of tariff options
        $firm = new Falcon_Model_Firm($user->getFirmId());
        $ids = $firm->getTariffIds();
        if (!empty($ids)) {
            foreach ($ids as $tariffId) {
                if ($tariffId == null) {
                    continue;
                }
                $t = Falcon_Mapper_X_Tariff::getInstance();
                $options = $t->getOptions($tariffId);
                foreach ($options as $option) {
                    $data[] = [
                        'id' => 't.' . $option['identifier'],
                        'value' => $option['value']
                    ];
                }
            }
        }

        foreach ($data as $item) {
            if ($item['id'] == 'p.lng_alias') {
                $lngAlias = $item['value'];
                break;
            }
        }

        foreach ($data as &$item) {
            if ($item['id'] == 'f.addresslegal' ||
                $item['id'] == 'f.addressactual'
            ) {
                // Address ids
                $newItem = [];
                $newItem['id'] = $item['id'] . '_id';
                $newItem['value'] = $item['value'];
                $newItem['type'] = 'int';
                $data[] = $newItem;

                $item['value'] =
                    Falcon_Action_Address::getFull($item['value'], $lngAlias);
                $item['type'] = 'string';
            }
        }
        unset($item);

        $person = (array)$user->get('person');
        $data[] = [
            'id' => 'email',
            'value' => empty($person['email']) ? [] : $person['email']
        ];
        $data[] = [
            'id' => 'phone',
            'value' => empty($person['phone']) ? [] : $person['phone']
        ];

        // Share key
        if ($user->hasRight('view_access_list')) {
            $data[] = [
                'id' => 'share_key',
                'value' => $firm->get('share_key'),
                'type' => 'string'
            ];
        }

        // User's api key
        $data[] = [
            'id' => 'api_key',
            'value' => $user->get('api_key'),
            'type' => 'string'
        ];

        /*$d = $user->getUserInfo()->getData();
        $tariffs = array();
        if (is_array($d) && isset($d[0]['firmid']))
        {
            $firm = new Falcon_Model_Firm($d[0]['firmid']);
            $tariffs = $firm->getTariffs();
        }
        $data[] = array(
            'id' => 'tariffs',
            'value' => $tariffs
        );*/

        $answer->addParam('data', $data);
        // Перед успешным возвращением настроек пишем в кеш
        if (is_numeric($userId) && $userId > 0) {
            $this->setCached($answer, $userId);
        }
        return $answer;
    }

    /**
     * Функция загрузки всех настроек пользователя
     * А так же списка идентификаторов прав
     */
    public function doGetList()
    {
        return $this->loadForUser(Falcon_Model_User::getInstance()->getId());
    }

    /**
     * Функция загрузки всех настроек пользователя
     * А так же списка идентификаторов прав
     */
    public function load()
    {
        return $this->doGetList();
    }

    /**
     * Apply types of options
     * @param {Falcon_Message} $answer
     * @return Falcon_Message
     */
    public function applyTypes($answer)
    {
        if (!$answer->isSuccess()) {
            return $answer;
        }
        $data = $answer->getData();
        foreach ($data as $id => $record) {
            $value = $record['value'];
            switch ($record['type']) {
                case 'int':
                    $data[$id]['value'] = (int)$value;
                    break;
                case 'float':
                    $data[$id]['value'] = (float)$value;
                    break;
            }
        }
        return $answer->addParam('data', $data);
    }


    /**
     * Перевод настроек пользователя из базы данных в "удобоваримый" php-массив
     * для внутренних нужд сервера
     * @param {Array} $data массив данных с сервера
     * @return {Array}
     */
    public function toArray($data)
    {
        $res = [];
        foreach ($data as $item) {
            $res[$item['id']] = $item['value'];
        }
        return $res;
    }

    /**
     * Password changing
     * @param string[] $list
     * @param string $password
     * @param Falcon_Model_User $user
     * @return Falcon_Message
     * @throws Falcon_Exception
     */
    protected function changePassword($list, $password, $user)
    {
        $password_new = "";
        $password_confirm = "";
        foreach ($list as $option) {
            if ($option->id == "p.password_new") {
                $password_new = $option->value;
            }
            if ($option->id == "p.password_confirm") {
                $password_confirm = $option->value;
            }
        }
        if ($password_new != "" && $password_confirm != "" && $password != "") {
            return $user->changePassword(
                $password_new, $password_confirm, $password);
        } else {
            $t = Zend_Registry::get('translator');
            $zt = $t['zt'];
            throw new Falcon_Exception(
                $zt->translate('All fields are required'), 4043);
        }
    }

    /**
     * Сохранение переданных настроек в базу данных.
     * @param {Number[]} $list Массив измененных настроек
     */
    public function set($list)
    {
        $user = Falcon_Model_User::getInstance();
        $userId = $user->getId();
        $firmId = $user->getFirmId();
        $firm = new Falcon_Model_Firm($firmId);
        $answer = new Falcon_Message();

        foreach ($list as $option) {
            if ($option->id == "p.password") {
                $answer->append(
                    $this->changePassword($list, $option->value, $user));
            }
            if ($option->id == 'email') {
                $mapper = Falcon_Mapper_X_Person_Email::getInstance();
                $this->setAdditionalData($option->value, $mapper,
                    $user->get('id_person'));
            }
            if ($option->id == 'phone') {
                $mapper = Falcon_Mapper_X_Person_Phone::getInstance();
                $this->setAdditionalData($option->value, $mapper,
                    $user->get('id_person'));
            }
            if ($option->id == 'share_key'
                && $user->hasRight('view_access_list')
            ) {
                $record = $firm->getRecord(false);
                $record->set('share_key', $option->value);
                $record->update();
            }
            if (!$user->isDemo() && $option->id == 'api_key') {
                $record = $user->getRecord(false);
                $record->set('api_key', $option->value);
                $record->update();
            }

            $answer_opt = Falcon_Mapper_X_User::getInstance()
                ->saveSettingFor($userId, $option->id, (string)$option->value);

            if ($answer_opt->isFailure()) {
                Falcon_Logger::getInstance()->log('settings', 'save',
                    [$userId, $option->id, (string)$option->value]);
                $t = Zend_Registry::get('translator');
                $zt = $t['zt'];
                throw new Falcon_Exception(
                    $zt->translate('Error while saving settings'), 4058);
            } else {
                $code = $answer_opt->getParam('code');
                if ($code < 0) {
                    $answer->error(-$code, [
                        $option->id,
                        $option->value
                    ]);
                }
            }
        }

        $users = $firm->getFirmUsers();
        if (!empty($firmId)) {
            foreach ($users as $user) {
                $this->dropCached($user->getId());
            }
        }

        $settings = $this->load();

        // Get firm users and update setting for them
        foreach ($users as $user) {
            Falcon_Action_Update::add([
                'alias' => 'settings',
                'id_user' => $user->getId()
            ]);
        }

        return $settings;
    }

    /**
     *
     * @param type $data
     * @param type $mapper
     * @param type $idPerson
     */
    protected function setAdditionalData($data, $mapper, $idPerson)
    {
        $mapper->delete(['id_person = ?' => $idPerson]);
        foreach ($data as $item) {
            $item = (array)$item;
            $item['id_person'] = $idPerson;
            $record = $mapper->newRecord($item);
            $record->insert();
        }
    }
}
