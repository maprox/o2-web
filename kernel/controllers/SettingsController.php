<?php

/**
 * Класс работы с настройками
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2010, Maprox LLC
 */
class SettingsController extends Falcon_Controller_Action
{
    /**
     * set
     * Сохранение настроек пользователя
     */
    public function setAction()
    {
        $data = $this->getJsonData();
        $user = Falcon_Model_User::getInstance();
        $userId = $user->getId();

        $answer = new Falcon_Message_Composite();
        if (!empty($data)) {
            foreach ($data as $id => $param) {
                if (!isset($param->value)) {
                    unset($data[$id]);

                    $action = explode('_', $param->id);
                    $action = array_map('ucfirst', $action);
                    $action = 'Falcon_Action_' . implode('_', $action);
                    $action = new $action();

                    $result = [];

                    if (!empty($param->created)) {
                        $result['create'] =
                            $action->createSettings($userId, $param->created);
                    }

                    if (!empty($param->updated)) {
                        $result['update'] =
                            $action->updateSettings($userId, $param->updated);
                    }

                    if (!empty($param->deleted)) {
                        $result['delete'] =
                            $action->deleteSettings($userId, $param->deleted);
                    }

                    $answer->add(new Falcon_Message($result), $param->id);
                }
            }

            try {
                $s = new Falcon_Action_Settings();
                $result = $s->set($data);
            } catch (Falcon_Exception $e) {
                $answer->error($e->getCode(), (array)$e->getMessage());
                return $this->sendAnswer($answer);
            }
            $answer->add($result, 'settings');
            $answer->merge();
        }
        $this->sendAnswer($answer);
    }

    /**
     *
     * @return type
     */
    public function get()
    {
        $s = new Falcon_Action_Settings();
        return $s->load();
    }

    /**
     *
     */
    public function checkaccountAction()
    {
        $answer = new Falcon_Message();
        $data = $this->getJsonData();
        $count = Falcon_Mapper_X_Company_Bank_Account::getInstance()
            ->getCount([
                'payment_account = ?' => (string)$data->account
            ], true);
        $answer->addParam('exists', ($count > 0));
        $answer->addParam('request', $data->request);
        $this->sendAnswer($answer);
    }
}
