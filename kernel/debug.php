<?php

$vd_timestart = microtime(true);

/**
 * Debug var dump function
 * @param mixed $var Dumped variable
 * @param bool $die Stop script
 * @param string $comment Comment for this dump
 * @param string $color Background color
 * @return null
 * @TODO Sometimes, problems with HTML-characters && the string length
 */
function vd($var = null, $die = true, $comment = null, $color = '#ffd')
{
    global $vd_timestart;
    static $i = 0;
    $screenedVar = $var;
    echo '<fieldset style="background:', $color, ';"><legend><b>Dump #', ++$i,
    '</b>';
    if ($comment !== null) {
        echo ' - ', $comment;
    }
    echo '</legend><pre>';
    if (is_string($var)) {
        $realLen = strlen($var);
        $screenedVar = htmlspecialchars($var);
        $screenedLen = strlen($screenedVar);
        if ($realLen != $screenedLen) {
            echo 'real string(', $realLen, ')<br />';
        }
    }
    var_dump($screenedVar);
    echo '</pre></fieldset>';
    echo '<b>Time from start: </b>' . (microtime(true) - $vd_timestart);

    if (class_exists_warn_off('Falcon_Logger') &&
        class_exists_warn_off('Falcon_Controller_Action_Abstract')
    ) {
        $logger = Falcon_Logger::getInstance();
        $logger->log('vd_' . $vd_timestart, 'vd', array_merge([$var],
            Falcon_Controller_Action_Abstract::getDBProfilerData()));
    }

    if ($die) {
        die();
    }
}

/**
 * Debug var dump function into variable (without exit)
 * @param mixed $var Dumped variable
 * @return string
 */
function vdv($var = null)
{
    @ob_start();
    var_dump($var);
    $content = @ob_get_contents();
    @ob_end_clean();
    return $content;
}

/**
 * Prints backtrace and dies
 */
function bt()
{
    echo '<pre>';
    debug_print_backtrace();
    echo '</pre>';
    die();
}

/**
 * Debug backtrace function into variable (without exit)
 * @return string
 */
function btv()
{
    @ob_start();
    debug_print_backtrace();
    $content = @ob_get_contents();
    @ob_end_clean();
    return $content;
}

// set_error_handler(function(){bt();});

register_shutdown_function(function () {
    $error = error_get_last();
    if (!$error) {
        return;
    }

    if (
    !($error['type'] == E_ERROR
        || $error['type'] == E_PARSE
        || $error['type'] == E_COMPILE_ERROR)
    ) {
        Falcon_Logger::getInstance()->log('warn', $error);
        return;
    }

    $memory = '';
    if (strpos($error['message'], 'Allowed memory size') === 0) {
        ini_set('memory_limit',
            (intval(ini_get('memory_limit')) + 64) . 'M');
        $memory = 'not enough memory';
    }

    $message = 'PHP Fatal:' . $memory . ' in ' .
        $error['file'] . ':' . $error['line'] . "\n\t\t" .
        'message: ' . $error['message'] . "\n\t\t" .
        'url: ' . $_SERVER['REQUEST_URI'] . "\n\t\t" .
        'post: ' . serialize($_POST) . "\n\t\t" .
        'user: ' . Falcon_Model_User::getInstance()->getId();

    Falcon_Logger::getInstance()->log('crit', $message);

    if (!Zend_Registry::isRegistered('config')) {
        return;
    }
    $config = Zend_Registry::get('config');
    if (empty($config) || $config->debug) {
        return;
    }

    ob_clean();

    try {
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $isAjax = $request->isXmlHttpRequest();
        if ($isAjax) {
            $message = new Falcon_Message();
            echo json_encode($message->error(500, [
                'line' => $error['file'] . ':' . $error['line']
            ])->toArray());
            return;
        }
    } catch (Exception $e) {
        // ...
    }

    include_once($config->path->public . 'index.w.php');
});