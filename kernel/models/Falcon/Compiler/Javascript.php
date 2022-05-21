<?php

/**
 * Javascript files compiler
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */
class Falcon_Compiler_Javascript extends Falcon_Compiler_Abstract
{
    protected $varStaticPath = 'STATIC_PATH';
    protected $varNodePath = 'NODE_PATH';
    protected $varLibVersions = 'LIB_VERSIONS';
    protected $varMapsApiKeys = 'MAPS_APIKEYS';
    protected $varUserAgentInfo = 'USERAGENT_INFO';
    protected $varVariables = 'VARIABLES';
    protected $varMigrateFlags = 'MIGRATE';
    protected $varUploadConstraints = 'UPLOAD_CONSTRAINTS';
    protected $varDebugFlag = 'ISDEBUG';


    public $staticPath;
    public $nodePath;
    protected $libVersions;
    protected $mapsApiKeys;
    protected $debugFlag;

    /**
     * Default content type for compiled files
     * @var string
     */
    protected $defaultContentType = 'application/javascript';

    /**
     * Constructor
     * @param {array} $config Configuration array
     */
    public function __construct(array $config)
    {
        parent::__construct($config);
        $globalConfig = Zend_Registry::get('config');
        $this->libVersions = json_encode($globalConfig->version->toArray());
        $this->mapsApiKeys = json_encode($globalConfig->maps->apikeys->toArray());
        $this->userAgentInfo = json_encode([
            'deviceType' => Zend_Registry::get('deviceType'),
            'deviceSize' => Zend_Registry::get('deviceSize')
        ]);
        $this->variables = json_encode(
            $this->translate($globalConfig->variables->toArray())
        );

        /*$flags = array();
        foreach (Falcon_Mapper_Z_Migrate_Flag::getInstance()->load() as $flag)
        {
            $flags[$flag->get('flag')] = true;
        }
        $this->migrateFlags = json_encode($flags);*/

        $this->debugFlag = $globalConfig->debug;
        $this->uploadConstraints = json_encode(
            $globalConfig->upload_constraints->toArray());
    }

    /**
     * Translates hashed array
     * TODO Move it from here
     * @param array $input
     */
    private function translate(array $input)
    {
        $t = Zend_Registry::get('translator');
        $result = [];
        foreach ($input as $key => $value) {
            $result[$key] = $t['zt']->_($value);
        }
        return $result;
    }

    /**
     * Loading of JS files
     * @param {string} $path Path to the loading directory
     */
    public function loadData($path)
    {
        return $this->load($path, ['include', 'modules', 'js']);
    }

    /**
     * Loading of language JS files
     * @param {string} $path Path to the loading directory
     */
    public function loadLanguage($path)
    {
        return $this->load($path, ['lang', 'modules']);
    }

    /**
     * Loading of module's JS files
     * @param {string} $module Name of the module
     */
    public function loadModuleData($module)
    {
        return $this->loadModule($module, ['include', 'modules', 'js']);
    }

    /**
     * Loading of moulde's language JS files
     * @param {string} $module Имя модуля
     */
    public function loadModuleLanguage($module)
    {
        return $this->loadModule($module, ['modules', 'lang']);
    }

    /**
     * Returns content of the compiler
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Returns additional data
     * @return string
     */
    public function getHeader()
    {
        // this is applicable only for "*kernel*" actions
        $fmt = "var %s = %s;\n";
        $content = '';
        //$content .= '(function () {"use strict"; ';
        $content .= "\n\n";
        $content .= sprintf($fmt,
            $this->varStaticPath, '"' . $this->staticPath . '"');
        $content .= sprintf($fmt,
            $this->varNodePath, '"' . $this->nodePath . '"');
        $content .= sprintf($fmt, $this->varLibVersions,
            $this->libVersions);
        $content .= sprintf($fmt, $this->varMapsApiKeys,
            $this->mapsApiKeys);
        $content .= sprintf($fmt, $this->varUserAgentInfo,
            $this->userAgentInfo);
        //$content .= sprintf($fmt, $this->varMigrateFlags,
        //	$this->migrateFlags);
        $content .= sprintf($fmt, $this->varVariables,
            $this->variables);
        $content .= sprintf($fmt, $this->varUploadConstraints,
            $this->uploadConstraints);
        $content .= sprintf($fmt, $this->varDebugFlag,
            $this->debugFlag ? 'true' : 'false');
        return $content;
    }

    /**
     * Returns additional data
     * @return string
     */
    public function getFooter()
    {
        $content = '';
        //$content .= "\n\n" . '})();';
        return $content;
    }
}
