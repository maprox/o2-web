<?php

/**
 * Хэлпер определения текущего языка интерфейса программы
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Controller_Action_Helper_Language
    extends Zend_Controller_Action_Helper_Abstract
{
    protected $_sDefaultLanguage;
    protected $_aLocales;
    protected $_ztConfig;

    /**
     * @param array $aLocales Доступные локали
     * @param array $ztConfig Дополнительные настройки хелпера,а именно
     *   - adapter    : объект адаптера переводов
     *   - path       : путь к языковым файлам
     *   - extenstion : расширение языковых файлов
     */
    public function __construct(array $aLocales, array $ztConfig)
    {
        $this->_ztConfig = $ztConfig;
        $this->_aLocales = $aLocales;
        $this->_sDefaultLanguage = key($aLocales);
    }

    /**
     * Получение массива переводчика
     * @param {string} $sLang Алиас языка
     * @return {Array}
     */
    public function getTranslator($sLang)
    {
        // устанавливаем объект перевода
        $oTranslate = new Zend_Translate([
            'adapter' => $this->_ztConfig['adapter'],
            'content' => $this->_ztConfig['path'] .
                '/en' . $this->_ztConfig['extension'],
            'locale' => 'en_GB'
        ]);

        foreach ($this->_aLocales as $lang => $locale) {
            // adding another translations
            if ($lang == 'en') continue;
            $content = $this->_ztConfig['path'] .
                '/' . $lang . $this->_ztConfig['extension'];
            $oTranslate->addTranslation([
                'content' => $content,
                'locale' => $locale
            ]);
        }

        $sLocale = $this->_aLocales[$sLang];
        $oTranslate->setLocale($sLocale);

        return [
            'locale' => $sLocale,
            'lang' => $sLang,
            'zt' => $oTranslate,
            'helper' => $this
        ];
    }

    /**
     * Выбор языка
     * @param {String} $lang
     */
    public function setLanguage($lang)
    {
        Zend_Registry::set('translator', $this->getTranslator($lang));
    }

    /**
     * Инициализация хелпера
     */
    public function init()
    {
        $request = $this->getRequest();
        // пробуем получить язык из URL
        $sLang = $request->getParam('lang') ?
            $request->getParam('lang') :
            $request->getParam('lang_default');

        if (!array_key_exists($sLang, $this->_aLocales)) {
            $sLang = $this->_sDefaultLanguage;
        }

        $login = 'default';
        if (Zend_Auth::getInstance()->hasIdentity()) {
            if (!$request->getParam('forced')) {
                $user = Falcon_Model_User::getInstance();
                $login = $user->get('name');
                $s = $user->getSettings();
                $sLang = $s['p.lng_alias'] ? $s['p.lng_alias'] : $sLang;
            }
        }

        $tr = $this->getTranslator($sLang);
        Zend_Form::setDefaultTranslator($tr['zt']); // перевод для Zend_Form

        if ($this->_actionController) {
            $this->_actionController->_locale = $tr['locale'];
            $this->_actionController->_lang = $tr['lang'];
            $this->_actionController->_zt = $tr['zt'];
        }
        Zend_Registry::set('translator', $tr);

        $r = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');
        $r->view->locale = $tr['locale'];
        $r->view->lang = $tr['lang'];
        $r->view->zt = $tr['zt'];
        $r->view->login = $login;
    }
}
