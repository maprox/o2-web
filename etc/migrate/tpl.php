<?php
// Mocking request uri for some inner code.
$_SERVER['REQUEST_URI'] = '/';
// Declaring ticks for later use
declare(ticks=1000);
// Load the config
require_once '../../../kernel/config.dev.php';
require_once '../../../kernel/config.local.php';

// Prepare libs array
$libs = [];
foreach ($config['libs'] as $lib => $path)
{
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

// Load the composer autoloader
require '../../../vendor/autoload.php';

require_once 'debug.php';

// Load main system class
require 'boot.php';

// Set up launcher
$bootstrap = new Bootstrap();
$bootstrap->initialize($config);

$sql = Zend_Registry::get('db');

########################################################################
#                 BELOW IS ACTUAL MIGRATION CODE                       #
########################################################################
