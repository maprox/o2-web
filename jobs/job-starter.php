<?php

// --------------------------------------------------------------------------
// Try to catch PDOExceptions:
//
function exception_error_handler($errno, $errstr, $errfile, $errline)
{
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}

set_error_handler("exception_error_handler");
// --------------------------------------------------------------------------

define('WORKING_DIR', __DIR__ . '/');

$job = $argv[1];
$key = $argv[2];

$base = WORKING_DIR . 'base.php';
$abstract = WORKING_DIR . 'abstract.php';
$class = WORKING_DIR . str_replace('_', DIRECTORY_SEPARATOR, $job) . '.php';

include_once $base;
include_once $abstract;
include_once $class;

$CLASS_NAME = 'Job_' . implode('_',
        array_map('ucfirst', explode('_', $argv[1])));

$logger = Falcon_Logger::getInstance();
$logger->log('job', "Job started: $job - $key");

try {
    $obj = new $CLASS_NAME($key);
    $obj->start();
} catch (Exception $E) {
    $logger = Falcon_Logger::getInstance();
    $logger->log('crit', $E->getMessage());
}

$logger->log('job', "Job stopped: $job - $key");