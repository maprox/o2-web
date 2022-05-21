<?php

/**
 * Class for sms configuration
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Callback_Sms_Configure extends Falcon_Action_Callback_Abstract
{
    /**
     * @var {Falcon_Model_Device}
     */
    protected $device;

    // Defined for future use
    public function __construct($objectId)
    {
        $this->device = new Falcon_Model_Device($objectId);

        parent::__construct($objectId);
    }

    /**
     * Обрабатывает ответ Falcon_Sender-а, выполняет необходимые действия
     * @param {Falcon_Sender_Response} $response
     */
    public function process(Falcon_Sender_Response $response)
    {
        if ($response->isDelivered() || $response->isFailure()) {
            $this->setFinished();
        }

        if ($response->isFailure()) {
            Falcon_Action_Device_Configure::setStatus($this->device,
                Falcon_Action_Device_Configure::STATUS_SMS_FAILED);
        }

        if ($response->isDelivered()) {
            Falcon_Action_Device_Configure::setStatus($this->device,
                Falcon_Action_Device_Configure::STATUS_SMS_RECIEVED);
        }
    }
}
