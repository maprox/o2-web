<?php

class ImagesController extends Falcon_Controller_Action
{
    /**
     * @const
     * Строка, наличие которой в html выдает сервер apache
     */
    const APACHE_STRING = "\n<address>Apache";

    /**
     * Инициализация контроллера
     */
    public function init()
    {
        parent::init();
        // TODO убрать
        $this->_skipAccessCheck = true;
    }

    /**
     * load
     */
    public function loadAction()
    {
        $this->sendAnswer($this->get());
    }

    /**
     * Получение доступных изображений
     * @return Falcon_Message Объект ответа сервера
     */
    public function get()
    {
        // объект реестра
        $config = Zend_Registry::get('config');
        // объект ответа сервера
        $answer = new Falcon_Message();

        $key = md5(serialize($config->icons) . $config->resources->static);
        $images = Falcon_Cacher::getInstance()->get('images', $key);

        if (empty($images)) {
            $images = $this->getImages($config->icons, $config->resources->static);
            Falcon_Cacher::getInstance()
                ->set($images, 'images', $key, Falcon_Cacher::DAY);
        }

        return $answer->addParam('data', $images);
    }

    /**
     * Сбор информации с сервера статики
     * @param {Zend_Config} $config
     * @param {String} $server домен сервера статики
     * @return {stdClass[]}
     */
    protected function getImages($config, $server)
    {
        $url = $server . $config->path;

        $headers = get_headers($url, true);
        if (!strpos($headers[0], '200 OK')) {
            return [];
        }

        $data = file_get_contents($url);
        $dirs = $this->getImagesLinked($data, $config->imageFile);

        $images = [];
        foreach ($dirs as $dir) {
            if (!preg_match($config->regExp, $dir)) {
                continue;
            }

            $image = new stdClass();
            $image->alias = $dir;
            $image->src = $url . $dir . '/' . $config->imageFile;

            $headers = get_headers($image->src, true);
            if (strpos($headers[0], '200 OK')) {
                $image->id = count($images) + 1;
                $images[] = $image;
            }
        }

        return $images;
    }

    /**
     * Сбор информации с сервера под апаче
     * @param {String} $html скачанный html
     * @return String[]
     */
    protected function getImagesLinked($html)
    {
        if (preg_match_all('/<a\s+href="(?P<dirs>[^"\/]+)/um', $html, $result)) {
            return $result['dirs'];
        }

        return [];
    }
}
