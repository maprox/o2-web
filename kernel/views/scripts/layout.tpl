<?php
/**
 * Base layout
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
*/

// Document type
echo $this->doctype(Zend_View_Helper_Doctype::HTML5);
?>

<html>
<head>
<?php
	// link to configuration array
	$c = $this->config;

	// title
	$this->headTitle($this->zt->translate($c->variables->title) .
		' ' . $c->version->o->major .
		'.' . $c->version->o->minor .
		' ' . $c->version->o->status, 'PREPEND')
		->setSeparator(' / ');

	// locale and viewport
	$this->headMeta()
		->prependHttpEquiv('Content-Language', $this->locale)
		->prependHttpEquiv('Content-Type', 'text/html; charset=utf-8')
		->prependHttpEquiv('X-UA-Compatible', 'chrome=1')
		->appendName('viewport',
				'width=device-width, '.
				'maximum-scale=1.0, '.
				'user-scalable=no')
		->appendName('apple-mobile-web-app-capable', 'yes')
	;

	// icons
	$favicon = $this->static . '/img/logo/' .
		$c->variables->class . '/' . $this->lang . '/favicon.ico';
	$this->headLink()
		->headLink(array('rel' => 'favicon', 'href' => $favicon))
		->headLink(array('rel' => 'shortcut icon', 'href' => $favicon))
		->headLink(array('rel' => 'apple-touch-icon',
			'href' => $this->static . '/img/logo/' .
				$c->variables->class . '/' .
				$this->lang . '/ios_114.png'))
	;

	echo $this->headTitle() . PHP_EOL;
	echo $this->headMeta() . PHP_EOL;
	echo $this->headStyle() . PHP_EOL;
	echo $this->headLink() . PHP_EOL;
	echo $this->headScript() . PHP_EOL;
?>
<?php
	// header analytics code
	foreach ($c->analytics->header as $item) {
		echo $item . PHP_EOL;
	}
?>
<script type="text/javascript">
if (typeof(Ext) !== "undefined") {
	Ext.BLANK_IMAGE_URL = "<?php echo $this->config->url->BLANK_IMAGE_URL; ?>";
}
window.startTime = (new Date).getTime();
</script>
</head>
<body class="<?php echo $this->config->variables->class; ?>">
<?php echo $this->layout()->content . PHP_EOL; ?>
<?php echo $this->inlineScript() . PHP_EOL; ?>
<?php
	// footer analytics code
	foreach ($c->analytics->footer as $item) {
		echo $item . PHP_EOL;
	}
?>
</body>
</html>
