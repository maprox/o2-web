#!/usr/bin/php5
<?php

define('WORKING_DIR', __DIR__ . '/');

require_once dirname(WORKING_DIR) . DIRECTORY_SEPARATOR .
    'kernel' . DIRECTORY_SEPARATOR . 'config.dev.php';

/**
 * Returns true if script is running on linux machine
 * @return bool
 */
function isLinux()
{
    return function_exists('posix_getuid');
}

/**
 * Arguments parsing
 * @param array $argv
 * @return array
 */
function arguments($argv)
{
    $_ARG = ['input' => []];
    // First param is this scripts name..
    $_ARG['name'] = array_shift($argv);
    foreach ($argv as $arg) {
        if (preg_match('#^-{1,2}([a-zA-Z0-9]*)=?(.*)$#', $arg, $matches)) {
            $key = $matches[1];
            switch ($matches[2]) {
                case '':
                case 'true':
                    $arg = true;
                    break;
                case 'false':
                    $arg = false;
                    break;
                default:
                    $arg = $matches[2];
            }
            $_ARG[$key] = $arg;
        } else {
            $_ARG['input'][] = $arg;
        }
    }
    return $_ARG;
}

/**
 * Starts command in background
 * @param string $command
 */
function startInBackground($command)
{
    if (isLinux()) {
        exec("nohup $command > /dev/null 2>&1 &");
    } else {
        $shell = new COM("WScript.Shell");
        $shell->run($command, 0, false);
    }

}

/**
 * Finds all avaiable jobs
 * @return String[]
 */
function getAllJobs()
{
    $return = glob(WORKING_DIR . "*/*.php");
    foreach ($return as &$file) {
        $file = str_replace(WORKING_DIR, '', $file);
        $file = str_replace('/', '_', $file);
        $file = str_replace('.php', '', $file);
    }
    return $return;
}

/**
 * Filters inputted jobs
 * @param {String[]} $jobs
 * @return String[]
 */
function filterInput($jobs)
{
    foreach ($jobs as $id => $job) {
        $file = getFileNameForJob($job);
        if (!file_exists($file) || !is_readable($file)) {
            print "Error! Job $job does not exist!\n";
            unset($jobs[$id]);
        } else {
            $jobs[$id] = "$job";
        }
    }
    return array_values($jobs);
}

/**
 * Transforms job name into file
 * @param {String} $job
 * @return String
 */
function getFileNameForJob($job)
{
    $file = str_replace('_', '/', $job);
    $file = WORKING_DIR . $file . '.php';
    return $file;
}

/**
 * Performs installation of service
 */
function doInstall($postfix)
{
    shell_exec('sudo ln -s ' . __FILE__ . ' /etc/init.d/job-server' . $postfix);
    shell_exec('sudo chmod +x ' . __FILE__);
    shell_exec('sudo update-rc.d job-server' . $postfix . ' defaults');
    print "Installation complete\n";
}

/**
 * Process starter
 * @param {String[]} $jobs
 */
function jobStart($jobs)
{
    foreach ($jobs as $job) {
        $file = WORKING_DIR . 'starter.php';
        print "\nStarting process for job $job... ";
        if (isLinux()) {
            startInBackground("su -c 'php $file $job' www-data");
        } else {
            startInBackground("php $file $job");
        }
        print "[OK]\n";
    }
}

/**
 * Kills processes
 * @param {String[]} $jobs
 */
function jobStop($jobs)
{
    if (!isLinux()) {
        print "\nStopping all jobs ...";
        startInBackground("taskkill /IM php.exe");
        print "[OK]\n";
        return;
    }
    /*
        foreach ($jobs as $job) {
            $job = explode(':', $job);
            print "\nStopping process for job $job[0]:$job[1] ..." ;
            startInBackground('sudo kill `ps ax | grep -i ' .
                $job[0].' | awk \'{ print $1 }\'`');
            //startInBackground(getControlString($job[0], $job[1], 'stop'));
            print "[OK]\n";
        }
    */
    print "\nStopping jobs...";
    startInBackground('sudo pkill php');
    //startInBackground(getControlString($job[0], $job[1], 'stop'));
    print "[OK]\n";
}

/**
 * Restart processes
 * @param {String[]} $jobs
 */
function jobRestart($jobs)
{
    jobStop($jobs);
    jobStart($jobs);
}

/**
 * Tests if processes already running, and restart, if they are not
 * @param {String[]} $jobs
 */
function jobRestartIfNotRunning($jobs)
{
    print "[Failure]: Temporarily disabled!\n";
}

/**
 * Tests if processes already running
 * @param {String[]} $jobs
 */
function jobTest($jobs)
{
    print "[Failure]: Temporarily disabled!\n";
}

// ----------------------------------------------------------------------

print "Job-server Starter v3.0\n";

// read input arguments
$command = '';
$params = arguments($argv);
if (is_array($params['input']) && !empty($params['input'][0])) {
    $command = array_shift($params['input']);
}
if ($command != 'install') {
    $input = empty($params['input']) ?
        getAllJobs() : filterInput($params['input']);
} else {
    $postfix = '';
    if (is_array($params['input']) && !empty($params['input'][0])) {
        $postfix = '-' . array_shift($params['input']);
    }
}

// ----------------------------------------------------------------------

switch ($command) {
    case 'install':
        doInstall($postfix);
        break;
    case 'start':
        jobStart($input);
        break;
    case 'stop':
        jobStop($input);
        break;
    case 'restart':
    case 'force-reload':
        jobRestart($input);
        break;
    case 'reload':
        jobRestartIfNotRunning($input);
        break;
    case 'status':
        jobTest($input);
        break;
    default:
        $file = basename(__FILE__, '.php');
        print "Usage: service $file " .
            "{start|stop|restart|reload|force-reload|status}" .
            " [%JOB_1%] [%JOB_2%] ... [%JOB_N%]\n" .
            "Install: php " . $params['name'] . " install\n";
}
