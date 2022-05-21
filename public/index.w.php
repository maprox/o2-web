<?php
/**
 * SERVER WORKS Entry point
 *
 * File to which all requests are redirected.
 * Loads the core of the site and starts the application
 *
 * 2009-2012, Maprox LLC
 */

// Try to determine accepted language
global $lang, $translations;

$langHeader = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
$langArray = preg_split('/[;,]/', $langHeader);
$lang = 'en';
foreach ($langArray as $l)
{
	if ($l === 'en' || $l === 'en_US') { $lang = 'en'; break; }
	if ($l === 'ru' || $l === 'ru_RU' || $l === 'ru_ru') { $lang = 'ru'; break; }
}

// Translations array
$translations = [
	'ru' => [
		'The server is temporarily not available' =>
				'Сервер временно недоступен',
		'Technical works are underway. ' .
			'We bring our apologies, the system will be restored soon.' =>
				'В настоящее время ведутся технические работы. ' .
				'Приносим свои извенения, работа системы будет ' .
				'восстановлена в ближайшее время.'
    ]
];

/**
 * Translates $text to the current language
 */
function translate($text)
{
	global $lang, $translations;
	if (isset($translations[$lang]) &&
	    isset($translations[$lang][$text]))
		return $translations[$lang][$text];
	return $text;
}

/**
	Url for static content
 */
$staticurl = 'http://static.maprox.net/';

?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<link href="favicon.ico" rel="favicon" />
	<link href="favicon.ico" rel="shortcut icon" />
	<title><?php echo translate('The server is temporarily not available'); ?></title>
	<link href="<?php echo $staticurl . 'css/common.css';?>" media="screen" rel="stylesheet" type="text/css" >
</head>
<body>
	<table height="100%" width="100%">
		<tr>
			<td align="center" valign="middle">
				<div id="container">
						<h1 class="plt">
							<?php echo translate(
								'The server is temporarily not available'); ?>
						</h1>
						<div class="plt">
							<p>
								<?php echo translate('Technical works are underway. ' .
									'We bring our apologies, the system will be restored soon.'); ?>
							</p>
						</div>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>

<?php die();
