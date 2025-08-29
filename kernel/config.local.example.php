<?php
/**
 * Local configuration overrides
 * Copy this file to config.local.php and modify for your environment
 */

$local_config = [
    // Database connection - production settings
    'db' => [
        'params' => [
            'host' => 'your-postgres-host',
            'dbname' => 'your-database-name',
            'username' => 'your-db-username',
            'password' => 'your-secure-password',
            // Additional timeout settings for production
            'options' => [
                PDO::ATTR_TIMEOUT => 15,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => false, // Disable persistent connections if causing issues
            ],
            'driver_options' => [
                'connect_timeout' => 15,
                'statement_timeout' => 60000, // 60 seconds
            ]
        ],
    ],
    
    // Environment settings
    'environment' => 'production',
    
    // Debug flag - MUST be false in production
    'debug' => false,
    
    // Session settings - reduce lifetime if needed
    'session' => [
        'lifeTime' => 24 * 60 * 60, // 1 day instead of 1 week
        'maxInactiveTime' => 60 * 30, // 30 minutes
    ],
    
    // Caching - enable Redis in production if available
    'cache' => [
        'type' => 'redis', // or 'files' if Redis unavailable
        'host' => 'redis-host',
        'port' => 6379,
    ],
];
