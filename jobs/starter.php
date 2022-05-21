<?php

define('WORKING_DIR', __DIR__ . '/');
define('DELAY_BETWEEN_JOB_START', 10000);
include_once WORKING_DIR . 'cli.php';

$job = $argv[1];

$starter = WORKING_DIR . 'job-starter.php';
$abstract = WORKING_DIR . 'abstract.php';
$class = WORKING_DIR . str_replace('_', DIRECTORY_SEPARATOR, $job) . '.php';

include_once $abstract;
include_once $class;

$keys = parse_keys($job);

if (isLinux()) {
    exec('id -u www-data', $output);
    if (posix_getuid() != $output[0]) {
        posix_setuid($output[0]);
    }
}

$CLASS_NAME = 'Job_' .
    implode('_', array_map('ucfirst', explode('_', $job)));

foreach ($keys as $key) {
    $threadCount = $CLASS_NAME::$listenerCount;
    if (isset($CLASS_NAME::$keysThreadsCount[$key])) {
        $threadCount = $CLASS_NAME::$keysThreadsCount[$key];
    }

    for ($i = 0; $i < $threadCount; $i++) {
        startInBackground("php $starter $job $key");
        usleep(DELAY_BETWEEN_JOB_START);
    }
}