<?php

/**
 * Action ""
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Dn_Worker_Post extends Falcon_Action_Rest_Common
{
    /**
     * Prepare input parameters
     * @param array $params
     */
    public function prepareInputParams($methodParams)
    {
        parent::prepareInputParams($methodParams);
        // specialization array
        $specialization = $this->getParam('specialization');
        if (is_string($specialization)) {
            $this->setParam('specialization', json_decode($specialization));
        }
    }

    /**
     * Applies conversion to the specified sensor
     * @param Falcon_Record_Mon_Device_Sensor $c
     */
    private function setSpecialization($c)
    {
        $specialization = $this->getParam('specialization');
        if ($specialization && is_array($specialization)) {
            $m = $this->getEntityMapper();
            $m->setSpecialization($c->getId(), $specialization);
        }
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceCreate($c)
    {
        $data = parent::instanceCreate($c);
        $this->setSpecialization($c);
        $m = $this->getEntityMapper();
        $data['specialization'] = $m->loadSpecialization($c->getId());
        return $data;
    }

    /**
     * Actions to perform before updating instance
     * @param type $c
     */
    protected function onBeforeUpdate($c)
    {
        if (parent::onBeforeUpdate($c) === false) return;
        $this->setSpecialization($c);
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        return parent::instanceUpdate($c);
    }
}
