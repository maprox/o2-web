<?php

if (PHP_SAPI != 'cli') {
    die;
}

/**
 * Returns true if script is running on linux machine
 * @return bool
 */
function isLinux()
{
    return function_exists('posix_getuid');
}

/**
 * Starts command in background
 * @param string $command
 */
function startInBackground($command)
{
    if (isLinux()) {
        exec('nohup ' . $command . ' > /dev/null 2>&1 &');
    } else {
        $shell = new COM("WScript.Shell");
        $shell->run($command, 0, false);
    }
}

function parse_keys($job, $keys = null)
{
    $CLASS_NAME = 'Job_' . implode('_', array_map('ucfirst',
            explode('_', $job)));

    $abstract = WORKING_DIR . 'abstract.php';
    $class = WORKING_DIR . str_replace('_',
            DIRECTORY_SEPARATOR, $job) . '.php';

    include_once $abstract;
    include_once $class;
    $keys = $CLASS_NAME::$keys;
    return $keys;
}

