#!/bin/bash

php etc/migrate/execute.php test
./vendor/bin/phpunit --bootstrap tests/phpunit/base.php --stderr --no-configuration tests/phpunit/tests/
