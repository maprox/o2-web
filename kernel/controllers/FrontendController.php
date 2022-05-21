<?php

/**
 * Класс вывода JavaScript/Css-файлов Frontend'а
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class FrontendController extends Falcon_Controller_Action
{
    const ERROR_MODULE = 'act/error';

    /**
     * Массив компиляторов
     * @type Falcon_Compiler_Abstract[]
     */
    private $compilers;

    /**
     * Application type.
     * o = desktop
     * m = mobile
     * @var String
     */
    private $appname = 'o';

    /**
     * Флаг отмены необходимости проверки
     * контроллера на доступность пользователю
     * @var {Boolean}
     */
    protected $_skipAccessCheck = true;

    /**
     * Disable layout
     * @var {Boolean}
     */
    protected $_disableLayout = true;

    /**
     * Массив имен экшенов контроллера, где нет необходимости
     * авторизации пользователя
     * @var {Array}
     */
    protected $_noCheckActions = [
        'register.js', 'register.css', 'lang'
    ];

    /**
     * Инициализация контроллера
     */
    public function init()
    {
        parent::init();

        // Разрешаем кеширование браузером
        Falcon_Controller_Front::getInstance()->enableCache();

        // получаем конфиг
        $config = Zend_Registry::get('config');

        // получаем массив конфига компиляторов
        $compilerConfig = $config->compiler->toArray();

        // let's determine if the useragent is mobile device
        $deviceType = Zend_Registry::get('deviceType');
        $deviceSize = Zend_Registry::get('deviceSize');
        $this->appname = ($deviceType === 'mobile') ? 'm' : 'o';

        // заполним массив настроек для компиляторов
        $language = $this->_getParam('lang') ? $this->_getParam('lang') :
            $this->_getParam('lang_default');
        $compilerParams = [
            'language' => $language,
            'application' => $this->appname,
            'action' => $this->getRequest()->getActionName(),
            'layout' => $deviceSize // small, medium, big (default)
        ];
        // массив настроек для Javascript компилятора
        $jsCompilerParams =
            array_merge($compilerParams, $compilerConfig['js']);
        // массив настроек для CSS компилятора
        $cssCompilerParams =
            array_merge($compilerParams, $compilerConfig['css']);

        // создадим компиляторы
        $this->compilers = [
            'js' => new Falcon_Compiler_Javascript([
                'path' => $config->path->js,
                'params' => $jsCompilerParams
            ]),
            'css' => new Falcon_Compiler_Css([
                'path' => $config->path->js,
                'params' => $cssCompilerParams
            ])
        ];
    }

    /**
     * Установка типа содержимого HTTP-ответа
     * в зависимости от компилятора
     * @param {string} $name
     * @return Falcon_Compiler_Abstract
     */
    private function selectCompiler($name)
    {
        if (!isset($this->compilers[$name])) {
            return null;
        }
        $compiler = $this->compilers[$name];
        // set headers
        $response = $this->getResponse();
        $response->setHeader('Content-Type', $compiler->getContentType());
        return $compiler;
    }


    /**
     * Компиляция пользовательского файла
     * @param {Falcon_Compiler_Abstract} $compiler Компилятор
     * @param {boolean} $isAdmin Админка или нет
     * @return string
     */
    private function compileUser($compiler, $isAdmin = false)
    {
        $user = Falcon_Model_User::getInstance();
        $modules = $user->getModules($isAdmin ? 'admin' : 'index');
        $loadList = [];
        foreach ($modules as $record) {
            $loadList = array_merge(
                $loadList,
                $compiler->loadModuleData($record['identifier'])
            );
        }
        $dir = $isAdmin ? 'admin' : 'app';
        $dontLoadList = $compiler->reset()->loadData(
            '/' . $this->appname . '/' . $dir . '/');


        return $compiler
            ->addFilesToNoLoadList($dontLoadList)
            ->compile($loadList);
    }

    /**
     * Компиляция ядра
     * @param {Falcon_Compiler_Abstract} $compiler Компилятор
     * @param {string} $path Путь загрузки
     * @return string
     */
    private function compileKernel($compiler, $path)
    {
        return $compiler->compile($compiler->loadData($path));

    }

    /**
     * Компиляция языкового файла
     * @param {Falcon_Compiler_Abstract} $compiler Компилятор
     * @param {string} $path путь до файлов
     * @param {boolean} $isAdmin
     * @return {string}
     */
    private function compileLang($compiler, $path, $isAdmin = false)
    {
        $langFiles = $compiler->loadLanguage($path);
        // пользовательские языковые файлы
        $user = Falcon_Model_User::getInstance();
        $modules = $user->getModules($isAdmin ? 'admin' : 'index');
        foreach ($modules as $record) {
            $langFiles = array_merge(
                $langFiles,
                $compiler->loadModuleLanguage($record['identifier'])
            );
        }
        return $compiler->compile($langFiles);
    }

    /*
     * ------------------------------------------------------
     * Desktop
     * ------------------------------------------------------
     */

    // --------------------------------
    // JS
    //

    /**
     * register.js
     */
    public function registerJsAction()
    {
        $compiler = $this->selectCompiler('js');
        $echo = $compiler->getHeader();

        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/o/register/');

        $compiler->reset();

        $echo .= PHP_EOL;
        $echo .= $compiler->compile($compiler->loadLanguage('/o/register/'));

        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();

        echo $echo;
    }

    /**
     * application.js
     * Формирование основного JS файла движка
     */
    public function applicationJsAction()
    {
        $compiler = $this->selectCompiler('js');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/o/app/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler);

        $compiler->reset();

        $echo .= PHP_EOL;
        $echo .= $this->compileLang($compiler, '/o/app/');

        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();

        echo $echo;
    }

    /**
     * application.admin.js
     * Формирование админского JS файла движка
     */
    public function applicationAdminJsAction()
    {
        $compiler = $this->selectCompiler('js');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/o/admin/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler, true);

        $compiler->reset();

        $echo .= PHP_EOL;
        $echo .= $this->compileLang($compiler, '/o/admin/', true);

        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();

        echo $echo;
    }

    // --------------------------------
    // CSS
    //

    /**
     * register.css
     */
    public function registerCssAction()
    {
        echo $this->compileKernel($this->selectCompiler('css'), '/o/register/');
    }

    /**
     * application.css
     * Формирование основного Css файла движка
     */
    public function applicationCssAction()
    {
        $compiler = $this->selectCompiler('css');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/o/app/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler);
        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();
        echo $echo;
    }

    /**
     * application.css
     * Формирование админского Css файла движка
     */
    public function applicationAdminCssAction()
    {
        $compiler = $this->selectCompiler('css');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/o/admin/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler, true);
        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();
        echo $echo;
    }

    /*
     * ------------------------------------------------------
     * MOBILE
     * ------------------------------------------------------
     */

    // --------------------------------
    // JS
    // --------------------------------


    public function mobileApplicationJsAction()
    {
        $compiler = $this->selectCompiler('js');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/m/app/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler);

        $compiler->reset();

        $echo .= PHP_EOL;
        $echo .= $this->compileLang($compiler, '/m/app/');

        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();

        echo $echo;
    }

    // --------------------------------
    // CSS
    // --------------------------------

    public function mobileApplicationCssAction()
    {
        $compiler = $this->selectCompiler('css');
        $echo = $compiler->getHeader();
        $echo .= PHP_EOL;
        $echo .= $this->compileKernel($compiler, '/m/app/');
        $echo .= PHP_EOL;
        $echo .= $this->compileUser($compiler);
        $echo .= PHP_EOL;
        $echo .= $compiler->getFooter();
        echo $echo;
    }
}
