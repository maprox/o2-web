<?php

/**
 * Class for working with service desk service
 *
 * @project    Maprox Observer <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Mon_Device_Sensor extends Falcon_Action_Rest_Child
{
    /**
     * Parent table config for checking access
     * like "array(fieldName => tableName)"
     * @var array
     */
    public static $parentConfig = ['id_device' => 'mon_device'];

    /**
     * Prepare input parameters
     * @param array $params
     */
    public function prepareInputParams($methodParams)
    {
        parent::prepareInputParams($methodParams);
        // conversion array
        $conversion = $this->getParam('conversion');
        if (is_string($conversion)) {
            $this->setParam('conversion', json_decode($conversion));
        }
    }

    /**
     * Applies conversion to the specified sensor
     * @param Falcon_Record_Mon_Device_Sensor $c
     */
    private function setConversion($c)
    {
        $conversion = $this->getParam('conversion');
        if ($conversion && is_array($conversion)) {
            $m = $this->getEntityMapper();
            $m->setConversion($c->getId(), $conversion);
        }
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceCreate($c)
    {
        $data = parent::instanceCreate($c);
        $this->setConversion($c);
        $m = $this->getEntityMapper();
        $data['conversion'] = $m->loadConversion($c->getId());
        return $data;
    }

    /**
     * Create instance
     * @param type $c
     */
    public function instanceUpdate($c)
    {
        parent::instanceUpdate($c);
        $this->setConversion($c);
    }
}
