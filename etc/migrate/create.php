#!/usr/bin/php5
<?php

define('DS', DIRECTORY_SEPARATOR);
define('WORKING_DIR', __DIR__ . DS);

/**
 * Returns user confirmation
 * @param string $text Line, displayed before prompt
 * @param bool $default Returning value if user press only <enter> key
 * @return bool
 */
function getUserConfirm($text, $default = true)
{
	$line = getUserInput($text);
	if (strlen($line) === 0)
	{
		return $default;
	}
	return ($line === 'y' || $line === 'Y');
}

/**
 * Returns user confirmation
 * @param string $text Line, displayed before prompt
 * @return string
 */
function getUserInput($text)
{
	print $text . PHP_EOL;
	$handle = fopen('php://stdin', 'r');
	return strtolower(trim(fgets($handle)));
}

if (!empty($argv[1]) && $argv[1] == '-p')
{
	define('TYPE', 'php');
}
else
{
	define('TYPE', 'sql');
}

$data = file_get_contents(WORKING_DIR . 'current.' . TYPE);
$time = filemtime(WORKING_DIR . 'current.' . TYPE);

if (empty($data) && !getUserConfirm(
		'The current.' . TYPE . ' is empty. Conitinue? [Y/n]'))
{
	exit;
}

if ((time() - $time > 86400) && !getUserConfirm(
		'The current.' . TYPE . ' was not updated for a long time. Continue? [Y/n]'))
{
	exit;
}

$task = getUserInput('Enter task number (digits only):');
$name = getUserInput('Enter short name of the migration ' .
	'(latin characters, digits and underscores only):');
date_default_timezone_set('UTC');
$datestring = date('Y-m-d_H-i');

$filename = WORKING_DIR . TYPE .
	DS . $datestring . '.' . $task . '.' . $name . '.' . TYPE;
touch($filename);

if (TYPE == 'php')
{
	$data = file_get_contents(WORKING_DIR . 'tpl.php') .
		preg_replace('/\s*\<\?(php)?/ui', '', $data);
}

file_put_contents($filename, $data);
