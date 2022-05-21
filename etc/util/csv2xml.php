#!/usr/bin/php
<?php

if (PHP_SAPI != 'cli' || count($argv) < 3) {
	die;
}

$table = $argv[1];
$lines = array_map(function($item) {
	return rtrim($item, "\n");
}, file($argv[2]));

$head = array_shift($lines);
$head = array_map(function($item) {
	return trim($item, '"');
}, explode(';', $head));

$output = '';

foreach ($lines as $line) {
	$output .= '<' . $table . ' ';

	$items = explode(';', $line);
	foreach ($items as $key => $item) {
		if (strlen($item) > 0) {
			$output .= $head[$key] . '="' . trim($item, '"') . '" ';
		}
	}

	$output .= '/>' . "\n";
}

echo $output;
