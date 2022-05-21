<?php
/**
 * Enables autoload feature for tests purposes
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2013, Maprox LLC
 */

$DS = DIRECTORY_SEPARATOR;
$working_dir = __DIR__ . $DS;
$root = dirname($working_dir) . $DS;

// Load the composer autoloader
require $root . 'vendor' . $DS . 'autoload.php';

// Load the config
require $root . 'kernel' . $DS . 'config.dev.php';

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
			$config['path']['kernel']
        ],
		$libs
	)
);

// Establish paths of searching include files
// such as libraries, models and system files
set_include_path($paths);

// Load main system class
require 'boot.php';

// Set up launcher
$bootstrap = new Bootstrap();
$bootstrap->initialize($config);