#!/usr/bin/php5
<?php

define('DS', DIRECTORY_SEPARATOR);
define('WORKING_DIR', __DIR__ . DS);
define('ROOT_DIR', dirname(WORKING_DIR) . DS);

require WORKING_DIR . 'test-boot.php';
require ROOT_DIR . 'etc' . DS . 'test-jslint.config.php';

$cfgFileNameLocal = ROOT_DIR . 'etc' . DS . 'test-jslint.config.local.php';
if (file_exists($cfgFileNameLocal)) {
	require $cfgFileNameLocal;
}

require ROOT_DIR . 'tests' . DS . 'jslint' . DS . 'base.php';

$obj = new Tests_Jslint_Base($config);
$obj->run();