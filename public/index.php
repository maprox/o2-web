<?php
/**
 * Entry point
 *
 * File to which all requests are redirected.
 * Loads the core of the site and starts the application
 *
 * 2009-2013, Maprox LLC
 */

//require 'index.w.php';

// Declaring ticks for later use
declare(ticks=1000);

// gd2 imageantialias() fix
if (!function_exists('imageantialias'))
{
	function imageantialias()
	{
		return true;
	}
}

// Needed because register tick function can't work with die directly
function dieOnLock() { die; }

// Load the config
require '../kernel/config.dev.php';

// Load the composer autoloader
require '../vendor/autoload.php';

// Prepare libs array
$libs = [
    '../vendor/zendframework/zendframework1/library',
];
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
			$config['path']['kernel']
        ],
		$libs
	)
);

// Establish paths of searching include files
// such as libraries, models and system files
set_include_path($paths);

require_once 'debug.php';

// Load main system class
require 'boot.php';

// Launch the application
$bootstrap = new Bootstrap();
$bootstrap->run($config);
