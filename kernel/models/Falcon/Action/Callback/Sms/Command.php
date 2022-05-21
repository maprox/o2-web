<?php

/**
 * Class for sms command callback
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Action_Callback_Sms_Command extends Falcon_Action_Callback_Abstract
{

    /**
     * Обрабатывает ответ Falcon_Sender-а, выполняет необходимые действия
     * @param {Falcon_Sender_Response} $response
     */
    public function process(Falcon_Sender_Response $response)
    {
        $logger = Falcon_Logger::getInstance();
        // Get work params
        $params = json_decode($this->getWork()->get('params'), true);

        if (!isset($params['guid'])) {
            $this->setFinished();
            return;
        }

        // Data to send in command.update
        $updateData = [
            'guid' => $params['guid'],
            'status' => Falcon_Record_Mon_Device_Command::STATUS_DELIVERED,
            'data' => 'OK'
        ];

        if ($response->isDelivered() || $response->isFailure()) {
            $this->setFinished();
        }

        if ($response->isFailure()) {
            $this->processFailure($response, $updateData);
        }

        if ($response->isDelivered()) {
            $this->processDelivered($response, $updateData);
        }

        // If callback was finished send update message
        if ($this->isFinished()) {
            Falcon_Amqp::sendTo('mon.device', 'command.update', $updateData);
        }
    }

    /**
     * Action when response is failure
     * Could be overriden in parent classes
     */
    protected function processFailure($response, &$updateData)
    {
        $logger = Falcon_Logger::getInstance();
        $updateData['status'] = Falcon_Record_Mon_Device_Command::STATUS_ERROR;
        $updateData['data'] = '';

        return true;
    }

    /**
     * Action when response is delivered
     * Could be overriden in parent classes
     */
    protected function processDelivered($response, &$updateData)
    {
        $logger = Falcon_Logger::getInstance();
        // updateData is already OK - do nothing
        return true;
    }
}
