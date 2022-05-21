<?php

/**
 * Packages controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */
class PackagesController extends Falcon_Controller_Action
{
    /**
     * set
     */
    public function setAction()
    {
        $data = $this->getJsonData();
        $answer = new Falcon_Message();
        // ID check
        if (!isset($data->id)) {
            return $this->sendAnswer($answer->error(4042));
        }
        // data change
        $package = new Falcon_Record_X_Package($data->id);
        $package->setProps((array)$data)->update();
        $this->sendAnswer($answer);
    }

    /**
     * remove
     */
    public function removeAction()
    {
        $data = $this->getJsonData();
        $answer = new Falcon_Message();
        // ID check
        if (!isset($data->id)) {
            return $this->sendAnswer($answer->error(4042));
        }
        $package = new Falcon_Record_X_Package($data->id);
        $package->trash();
        $this->sendAnswer($answer);
    }

    /**
     * add
     */
    public function addAction()
    {
        // input data
        $data = $this->getJsonData();
        $answer = new Falcon_Message();
        if (empty($data->name)) {
            return $this->sendAnswer($answer->error(4042));
        }
        $package = new Falcon_Record_X_Package((array)$data);
        $id = $package->insert()->getId();
        $data = [['id' => $id]];
        $answer->addParam('data', $data);
        $this->sendAnswer($answer);
    }
}