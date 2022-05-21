<?php

/**
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2012, Maprox LLC
 *
 * Utility functions used in a project.
 */

/**
 * ucwords function with custom separator.
 * @param string $str String to modify
 * @param string $sep Separator pattern
 * @return string Modified string
 */
function ucwords_custom($str, $sep = '_')
{
    return implode($sep, array_map('ucfirst', explode($sep, $str)));
}

/**
 * Returns a class name for specified tablename and prefix.
 * Example:
 * print getFalconClassName('Falcon_Mapper', 'mon_waylist');
 * // prints Falcon_Mapper_Mon_Waylist
 * @param string $prefix
 * @param string $tablename
 * @return string
 */
function getFalconClassName($prefix, $tablename)
{
    return $prefix . ucwords_custom(strtolower($tablename), '_');
}

/**
 * Returns current environment
 * @return string
 */
function getEnvironment()
{
    static $environment = null;
    if ($environment === null) {
        $config = Zend_Registry::get('config');
        $environment = $config->environment ?: '';
    }
    return $environment;
}

/**
 * Returns prefix for current enviroment
 * @return string
 */
function getEnvironmentPrefix()
{
    $environment = getEnvironment();
    return $environment ? $environment . '_' : '';
}

/**
 * Returns false if class does not exist without any warnings
 * @param string $className
 * @return bool
 */
function class_exists_warn_off($className)
{
    set_error_handler(function () {
    }, E_WARNING);
    $exists = class_exists($className);
    restore_error_handler();
    return $exists;
}

/**
 * Transforms array keys to specified values
 * according to supplied rules.
 * Example:
 * <pre>
 *   $arr = array(
 *     'sample' => 'WORLD',
 *     'value' => 'REAL',
 *     'of' => 33,
 *     'array' => null
 *   );
 *   $rules = array(
 *     'sample' => 'HELLO',
 *     'value' => 'LIFE IS',
 *     'Of' => 3399393
 *   );
 *   $result = array_rename_keys($arr, $rules);
 *   // Returns: array(
 *   //   'HELLO' => 'WORLD',
 *   //   'LIFE IS' => 'REAL',
 *   //   'of' => 33, // not changed, because fn is case sensitive
 *   //   'array' => null
 *   // );
 * </pre>
 * @param array $arr
 * @param array $rules
 * @return array
 */
function array_rename_keys(array $arr, array $rules)
{
    foreach ($rules as $key => $value) {
        if (array_key_exists($key, $arr)) {
            $arr[$value] = $arr[$key];
            unset($arr[$key]);
        }
    }
    return $arr;
}

/**
 * Returns array value by the key, and checks if it exists.
 * If the key is not in the array, than returns value $default
 * @param array $array
 * @param string $item
 * @return mixed $defaultValue
 */
function f_isset(array $array, $item, $defaultValue = null)
{
    if (array_key_exists($item, $array)) {
        return $array[$item];
    }
    return $defaultValue;
}

