#!/usr/bin/php5
<?php

define('DS', DIRECTORY_SEPARATOR);
define('WORKING_DIR', __DIR__ . DS);
define('ROOT_DIR', dirname(dirname(WORKING_DIR)) . DS);

require_once ROOT_DIR . 'kernel' . DS . 'config.dev.php';
if (isset($argv[1]) && $argv[1] == 'test') {
	require_once ROOT_DIR . 'kernel' . DS . 'config.test.php';
}
// Load the composer autoloader
require_once ROOT_DIR . 'vendor' . DS . 'autoload.php';

function toTime ($string)
{
	$string = str_replace('_', ' ', $string) . ':00';
	$string = preg_replace('/^(.*)-/uis', '$1:', $string);

	return strtotime($string);
}

$logText = '';
$errorText = '';

function addError($text)
{
	global $errorText;
	$errorText .= $text;
	addLog($text);
}
function addLog($text)
{
	global $logText;
	$logText .= $text;
	print $text;
}
function shutdown()
{
	global $errorText, $logText;

	date_default_timezone_set('UTC');
	$datestring = date('Y-m-d_H-i-s', $_SERVER['REQUEST_TIME']);

	if (!empty($logText))
	{
		file_put_contents(WORKING_DIR . 'logs' .
				DS . $datestring . '.log', $logText);
	}
	if (!empty($errorText))
	{
		file_put_contents(WORKING_DIR . 'errors' .
				DS . $datestring . '.log', $errorText);
	}
}
register_shutdown_function('shutdown');

function rmBOM($string)
{
	if (substr($string, 0,3) == pack("CCC", 0xef, 0xbb, 0xbf))
	{
		$string = substr($string, 3);
	}
	return $string;
}
// Connection to database
$host = $config['db']['params']['host'];
$base = $config['db']['params']['dbname'];
$user = $config['db']['params']['username'];
$password = $config['db']['params']['password'];

$dsn = 'pgsql:dbname=' . $base . ';host=' . $host;

if (isset($config['db']['params']['port']))
{
	$dsn .= ';port=' . $config['db']['params']['port'];
}

try
{
	$db = new PDO($dsn, $user, $password);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
}
catch (PDOException $e)
{
	addError('Connection failed: ' . $e->getMessage() . PHP_EOL);
	exit;
}


// Query all migrations
$result = $db->query('select * from z_migrate');

// Already executed migrations
$executed = [];
if (!empty($result))
{
	foreach ($result as $row)
	{
		$executed[$row['filename']] = '';
	}
}

$data = [];
$lastExt = false;

// Get migration files
$migrations = array_merge(glob(WORKING_DIR . 'php' . DS . '*.php'),
	glob(WORKING_DIR . 'sql' . DS . '*.sql'));
foreach ($migrations as &$migration)
{
	$migration = basename($migration);
}
unset($migration);
natsort($migrations);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

$count = 0;
foreach ($migrations as $name)
{
	// Checking whether migration has been executed
	if(isset($executed[$name])) {
		continue;
	}

	$count++;
	$db->beginTransaction();
	try {
		if (pathinfo($name, PATHINFO_EXTENSION) == 'sql') {
			$query = rmBOM(file_get_contents(WORKING_DIR . 'sql' . DS . $name));
			$test = trim(preg_replace('/^\s*\-{2}.*$/uim', '', $query));
			if (strlen($test) != 0) {
				$db->query($query);
			} else {
				addLog(PHP_EOL . 'Warning: empty sql in '. $name . ', skipping.' . PHP_EOL);
			}
		} else {
			$output = trim(shell_exec('cd ' . WORKING_DIR . 'php' . DS .
				' && php ' . $name . ' && echo "done"'));
			if ($output !== 'done' && $output !== '"done"') {
				addError('Execution error in php file ' . $name . ': ' . $output . PHP_EOL);
				exit;
			}
		}
		$db->query('INSERT INTO z_migrate values(\''.$name.'\');');
		$db->commit();
		addLog(PHP_EOL . 'Successfully executed '. $name . '.' . PHP_EOL);
	} catch (Exception $e) {
		addError('Execution error in ' . $name . ': ' . $e->getMessage() . PHP_EOL);
		$db->rollBack();
		exit;
	}
}

if (!$count)
{
	addLog(PHP_EOL . 'No migrations to execute.'. PHP_EOL);
	exit;
}

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
			$config['path']['kernel']
        ],
		$libs
	)
);

// Establish paths of searching include files
// such as libraries, models and system files
set_include_path($paths);

// If there was migrations - clear cache, because of Zend caching schema
// Load main system class
require_once 'boot.php';
// Set up launcher
$bootstrap = new Bootstrap();
$bootstrap->setConfig($config);
$bootstrap->setLoader();

Falcon_Cacher::getInstance()->clean();
