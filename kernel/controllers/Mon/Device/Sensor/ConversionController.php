<?php

/**
 * Conversions controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Mon_Device_Sensor_ConversionController extends Falcon_Controller_Action
{
    /**
     * Flag of the abolition of the need to check
     * the availability of the controller for the user
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

    /**
     * check
     * Проверка значения
     */
    public function checkAction()
    {
        $answer = new Falcon_Message();
        $x = $this->getParam('x');
        $smoothing = $this->getParam('smoothing', 1);
        $conversion = json_decode($this->getParam('conversion'));
        $converter = new Falcon_Action_Device_Sensor_Conversion($conversion);
        $this->sendAnswer($answer->append($converter->check($x, $smoothing)));
    }

    /**
     * graph
     * Получение графика
     */
    public function graphAction()
    {
        $smoothing = $this->getParam('smoothing');
        $conversion = json_decode($this->getParam('conversion'));
        $converter = new Falcon_Action_Device_Sensor_Conversion($conversion);
        $converter->getImage($smoothing);
    }
}
