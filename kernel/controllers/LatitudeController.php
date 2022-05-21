<?php

/**
 * Google Latitude controller
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class LatitudeController extends Falcon_Controller_Action
{
    /**
     * index
     */
    public function indexAction()
    {
        $logger = Falcon_Logger::getInstance();
        $error = $this->getParam('error');
        if ($error) {
            // SHOW AN ERROR MESSAGE TO THE USER
            $logger->log('lat', 'Error', $error);
            return;
        }

        $config = Zend_Registry::get('config');
        $config_oauth = $config->oauth2->latitude;
        $client = new OAuth2\Client(
            $config_oauth->client_id,
            $config_oauth->client_secret
        );
        $code = $this->getParam('code');
        if (!$code) {
            $this->_redirect($client->getAuthenticationUrl(
                $config_oauth->authorization_endpoint,
                $config_oauth->redirect_uri, [
                'scope' => $config_oauth->scope,
                'access_type' => 'offline',
                'state' => '[deviceIdentifier]'
            ])
            );
        } else {
            $response = $client->getAccessToken(
                $config_oauth->token_endpoint,
                'authorization_code', [
                'code' => $code,
                'redirect_uri' => $config_oauth->redirect_uri
            ]);
            $info = $response['result'];
            $logger->log('lat', 'Info', $info);
            $client->setAccessToken($info['access_token']);
            $response = $client->fetch(
                'https://www.googleapis.com/oauth2/v1/userinfo');
            vd($response);
        }
    }
}