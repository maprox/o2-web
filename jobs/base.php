<?php
// Mocking request uri for some inner code.
$_SERVER['REQUEST_URI'] = '/';
$_SERVER['SERVER_PORT'] = 80;

// Load the config
require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'kernel/config.dev.php';
// Rewrite config db connection with testing one
require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'kernel/config.local.php';
// Load the composer autoloader
require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

// Prepare libs array
$libs = [];
foreach ($config['libs'] as $lib => $path) {
    $libs[] = $config['path']['downloads'] . $lib . '/' . $path;
}

// Create path array
$paths = implode(
    PATH_SEPARATOR,
    array_merge(
        [
            $config['path']['library'],
            $config['path']['kernel'],
            get_include_path()
        ],
        $libs
    )
);

// Establish paths of searching include files
// such as libraries, models and system files
set_include_path($paths);

// Load debug information
require_once 'debug.php';

// Load main system class
require 'boot.php';

// Set up launcher
$bootstrap = new Bootstrap();
$config['debug'] = false;
$config['_cli'] = true;
$bootstrap->initialize($config);

// Enable job mode
Falcon_Controller_Front::getInstance()->setCliMode();

// Init helpers
$stack = Zend_Controller_Action_HelperBroker::getStack();
foreach ($stack as $helper) {
    //$helper->setActionController();
    $helper->init();
}

require_once __DIR__ . DIRECTORY_SEPARATOR . 'abstract.php';