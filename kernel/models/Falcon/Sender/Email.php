<?php

/**
 * Email sender class
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Sender_Email extends Falcon_Sender_Abstract
{
    /**
     * Sending an email.
     * TODO Use $this->_sendCommon to send email
     *
     * @param {Object} $owner Owner object instance used in template
     * @param {String} $email Email address
     * @param {String} $path E-mail template path
     * @param {Boolean} $html Html flag if true, then html is attached
     * @return {Falcon_Sender_Response}
     */
    public static function send($owner, $email, $path, $html = false)
    {
        $logger = Falcon_Logger::getInstance();
        // create the response object
        $response = new Falcon_Sender_Response();
        try {
            // get settings
            $config = Zend_Registry::get('config')->toArray();

            // e-mail client
            $clientMail = new Zend_Mail('utf-8');

            // get the kernel dir
            $path_kernel = $config['path']['kernel'];
            $path_library = $config['path']['library'];
            // get email content view
            $view = new Falcon_View();
            $view
                ->addHelperPath($path_library .
                    'Falcon/View/Helper/Email',
                    'Falcon_View_Helper_Email')
                ->addScriptPath($path_kernel . 'views/scripts/actions/email')
                ->addScriptPath($path_kernel . $path);

            $view->clientMail = $clientMail;
            $view->owner = $owner;
            $view->variables = $config['variables'];
            if (isset($owner) && isset($owner->locale)) {
                $view->locale = $owner->locale;
            }

            $user = $owner;
            if (isset($owner) && $owner instanceof Falcon_Record_N_Work) {
                $user = $owner->getUser();
            }

            // Set locale if user is given
            if (isset($user) && $user instanceof Falcon_Model_User) {
                $view->locale = $user->getLocale();
                $partnerAlias = $user->getPartnerAlias();
                if (!empty($partnerAlias) &&
                    isset($config['partners'][$partnerAlias]['variables'])
                ) {
                    $view->variables =
                        $config['partners'][$partnerAlias]['variables'];
                    $from = $view->variables['notifyEmail'];
                    $view->hostLink = $view->variables['hostLink'];
                    $clientMail->clearFrom()->setFrom($from);
                }
            }

            // rendering email content
            $view->format = 'text';
            $m_text = $view->render('content.tpl');
            $view->format = 'html';
            $m_html = $view->render('content.tpl');

            // Override delivery address
            if (isset($config['mail']['delivery_address'])) {
                $deliveryAddress = $config['mail']['delivery_address'];
                if ($deliveryAddress) {
                    $clientMail->addHeader('X-Falcon-To', $email);
                    $email = $deliveryAddress;
                }
            }

            $clientMail->addTo($email);
            $clientMail->setBodyText($m_text);

            if (!empty($m_html)) {
                // multipart message
                $clientMail->setBodyHtml($m_html);
            }

            // sending email
            $clientMail->send();

            // log email sending
            $logger->log('email', [
                'to' => $email,
                'path' => $path,
                'text' => $m_text,
                'html' => $m_html
            ]);
        } catch (Exception $e) {
            $logger->log('error', $e->getMessage());
            // error handling
            $response = new Falcon_Sender_Response(
                Falcon_Sender_Response::DELIVERY_ERROR,
                $e->getCode(),
                $e->getMessage()
            );
        }
        return $response;
    }

    /**
     * Sending an email
     * @param {String} $path E-mail template path
     * @param {Array} $params E-mail template additional params
     * @param {String} $from Sender E-mail address
     * @param {String} $to Reciever E-mail address
     * @param {String} $replyTo Reply-to E-mail address
     * @param {Boolean} $doNotSend True to disable email sending
     * @return {Falcon_Sender_Response}
     */
    public static function sendSimple($path, $params,
                                      $from, $to, $replyTo = null, $doNotSend = false)
    {
        $logger = Falcon_Logger::getInstance();
        // get the kernel dir
        $config = Zend_Registry::get('config')->toArray();
        // get the kernel dir
        $path_kernel = $config['path']['kernel'];
        $path_library = $config['path']['library'];

        // instantiate Zend_Mail
        $clientMail = new Zend_Mail('utf-8');

        // get email content view
        $view = new Falcon_View();
        $view
            ->addHelperPath($path_library .
                'Falcon/View/Helper/Email',
                'Falcon_View_Helper_Email')
            ->addScriptPath($path_kernel . 'views/scripts/actions/email')
            ->addScriptPath($path_kernel . $path);
        $view->clientMail = $clientMail;
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
                $from = $view->variables['notifyEmail'];
                $view->hostLink = $view->variables['hostLink'];
            }
        }

        // Add attachments
        if (isset($params['attachments'])) {
            foreach ($params['attachments'] as $attachment) {
                $attachmentUri = $attachment['url'];
                $client = new Zend_Http_Client($attachmentUri);
                $client->setMethod(Zend_Http_Client::POST);
                if (isset($attachment['params'])) {
                    $client->setParameterPost($attachment['params']);
                }
                $result = $client->request();
                if ($result->isError()) {
                    $logger->log('email', $attachmentUri,
                        'Attachment receiving error');
                    continue; // skip this attachment
                }
                $content = $result->getBody();
                $contentType = 'application/pdf';
                if (isset($attachment['content-type'])) {
                    $contentType = $attachment['content-type'];
                }
                $at = $clientMail->createAttachment(
                    $content,
                    $contentType,
                    Zend_Mime::DISPOSITION_INLINE,
                    Zend_Mime::ENCODING_BASE64
                );
                if (!empty($attachment['filename'])) {
                    $at->filename = $attachment['filename'];
                }
            }
        }

        // rendering email content
        $view->format = 'text';
        $m_text = $view->render('content.tpl');
        $view->format = 'html';
        $m_html = $view->render('content.tpl');

        $topic = $clientMail->getSubject();

        // log email sending
        $logger->log('email', [
            'to' => $to,
            'send' => !$doNotSend,
            'path' => $path,
            'text' => $m_text,
            'html' => $m_html
        ]);

        if ($doNotSend) {
            // temporarily exit (for testing);
            return [
                'html' => $m_html,
                'text' => $m_text
            ];
        }

        return self::_sendCommon($m_text, $m_html,
            $topic, $from, $to, $replyTo, $clientMail);
    }

    /**
     * Sending an email common function
     * @return {Falcon_Sender_Response}
     */
    protected static function _sendCommon($text, $html, $topic, $from, $to,
                                          $replyTo, $clientMail = null)
    {
        // create the response object
        $response = new Falcon_Sender_Response();
        try {
            // get settings
            $config = Zend_Registry::get('config')->toArray();

            // e-mail client
            if (!$clientMail) {
                $clientMail = new Zend_Mail('utf-8');
            }

            // Override delivery address
            if (isset($config['mail']['delivery_address'])) {
                $deliveryAddress = $config['mail']['delivery_address'];
                if ($deliveryAddress) {
                    $clientMail->addHeader('X-Falcon-To', $to);
                    $to = $deliveryAddress;
                }
            }

            $clientMail->addTo($to)->
            clearFrom()->setFrom($from)->
            clearSubject()->setSubject($topic);

            $clientMail->setBodyText($text);
            if (!empty($html)) {
                // multipart message
                $clientMail->setBodyHtml($html);
            }

            if (!empty($replyTo)) {
                $clientMail->setReplyTo($replyTo);
            }

            // sending email
            $clientMail->send();
        } catch (Exception $e) {
            // error handling
            $response = new Falcon_Sender_Response(
                Falcon_Sender_Response::DELIVERY_ERROR,
                $e->getCode(),
                $e->getMessage()
            );
        }
        return $response;
    }
}
