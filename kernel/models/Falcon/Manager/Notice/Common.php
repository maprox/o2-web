<?php

/**
 * Abstract notice manager
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 */
class Falcon_Manager_Notice_Common extends Falcon_Manager_Notice_Abstract
{
    /**
     * Templates path
     * @var {String}
     */
    protected $tplPath = null;

    /**
     * Sends email
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function sendEmail($setting, $params)
    {
        $config = Zend_Registry::get('config');
        return Falcon_Sender_Email::sendSimple(
            $this->getEmailTplPath(),
            $params,
            $config->variables->notifyEmail,
            $setting['address'],
            null
        );
    }

    /**
     * Sends sms
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function sendSms($setting, $params)
    {
        $logger = Falcon_Logger::getInstance();
        $text = $this->renderTemplate('sms', $params);

        // Create work record
        $m = Falcon_Mapper_N_Work::getInstance();

        $workId = $m->add('sms', [
            'send_to' => $setting['address'],
            'message' => $text
        ]);

        $work = new Falcon_Record_N_Work($workId);

        Falcon_Sender_Sms::send($work);
    }

    /**
     * Sends popup
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function sendPopup($setting, $params)
    {
        $message = $this->renderTemplate('popup', $params);
        Falcon_Mapper_N_Work::getInstance()->add('popup', [
            'send_to' => $setting['id_user'],
            'message' => $message
        ]);
    }

    /**
     * Sends telegram
     * @param {Array} $setting Array with address and notification type
     * @param {Array} $params Template data
     */
    public function sendTelegram($setting, $params)
    {
        $message = $this->renderTemplate('telegram', $params);
        Falcon_Amqp::sendTo('n.work', 'telegram.send', [
            'send_to' => $setting['address'],
            'message' => $message,
        ]);
    }

    /**
     * Returns template as string
     * @param {String} $path
     */
    protected function renderTemplate($type, $params)
    {
        $config = Zend_Registry::get('config')->toArray();
        // get the kernel dir
        $path_kernel = $config['path']['kernel'];
        $path_library = $config['path']['library'];

        // get content view
        $view = new Falcon_View();
        $view
            ->addHelperPath($path_library .
                'Falcon/View/Helper/Email',
                'Falcon_View_Helper_Email')
            ->addScriptPath($path_kernel . 'views/scripts/actions/email')
            ->addScriptPath($path_kernel . $this->getTplPath());
        $view->params = $params;
        $view->variables = $config['variables'];

        // Set locale if user is given
        if (isset($params['user']) &&
            $params['user'] instanceof Falcon_Model_User
        ) {
            $view->locale = $params['user']->getLocale();
            $partnerAlias = $params['user']->getPartnerAlias();
            if (!empty($partnerAlias) &&
                isset($config['partners'][$partnerAlias]['variables'])
            ) {
                $view->variables =
                    $config['partners'][$partnerAlias]['variables'];
                $view->hostLink = $view->variables['hostLink'];
            }
        }

        // rendering content
        $view->format = 'text';
        return $view->render('content-' . $type . '.tpl');
    }

    /**
     * Returns templates path
     * @return {String}
     */
    protected function getTplPath()
    {
        return $this->tplPath;
    }

    /**
     * Returns email template path
     * @return {String}
     */
    protected function getEmailTplPath()
    {
        if (isset($this->emailTplPath)) {
            return $this->emailTplPath;
        }

        return $this->tplPath;
    }

    /**
     * Returns sms template path
     * @return {String}
     */
    protected function getSmsTplPath()
    {
        if (isset($this->smsTplPath)) {
            return $this->smsTplPath;
        }

        return $this->tplPath;
    }

    /**
     * Returns popup template path
     * @return {String}
     */
    protected function getPopupTplPath()
    {
        if (isset($this->popupTplPath)) {
            return $this->popupTplPath;
        }

        return $this->tplPath;
    }

}