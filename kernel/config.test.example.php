<?php

// To use this file, copy it to config.test.php, then edit

if (basename(__FILE__) !== 'config.test.php') {
    throw new Exception('You can\'t include example config. Rename, then use it');
}

// Local config array, will overwrite global config
// For more information, see config.dev.php
$test_config = [
    // Database connection
    'db' => [
        'params' => [
            // database name
            'dbname' => 'observer_test'
        ]
    ],
    'debug' => true
];

$config = array_replace_recursive($config, $test_config);
