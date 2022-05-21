<?php

/**
 * @project    Maprox Observer
 * @copyright  2012, Maprox LLC <http://maprox.net>
 *
 * Rest controller
 */
class X_UserController extends Falcon_Controller_Action_Rest
{
    /**
     * url: /x_user/checklogin
     * Checks if supplied login is unique
     */
    public function checkloginAction()
    {
        $answer = new Falcon_Message(); // answer object
        $data = $this->getJsonData(); // input data
        // login check
        if (!empty($data->login)) {
            $user = new Falcon_Model_User();
            $answer->addParam('exists', $user->loginExists($data->login));
        }
        $answer->addParam('request', $data->request);
        return $answer;
    }

    /**
     * url: /x_user/generateapikey
     * Generates unique api-key
     */
    public function generateapikeyAction()
    {
        $answer = new Falcon_Message();
        $isShareKey = $this->getParam('type', 'default') == 'share_key';
        do {
            $key = $salt = false;
            if ($isShareKey) {
                Falcon_Model_User::genPw($key, $salt, 5);
                $key = strtolower($key);
                $duplicates = Falcon_Mapper_X_Firm::getInstance()->loadBy(
                    function ($sql) use ($key) {
                        $sql->where('share_key = ?', $key);
                    }
                );
            } else {
                Falcon_Model_User::genPw($key, $salt, 32);
                $duplicates = Falcon_Mapper_X_User::getInstance()->loadBy(
                    function ($sql) use ($key) {
                        $sql->where('api_key = ?', $key);
                    }
                );
            }
        } while (!empty($duplicates));
        $answer->addParam('key', $key);
        return $answer;
    }
}