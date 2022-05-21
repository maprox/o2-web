<?php
/**
 * Main page template
 * /index (eq. /)
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */

	// layout type prefix
	$prefix = ($this->deviceType === 'mobile') ? 'mobile.' : '';

	// current file version
	$hosthash = md5(GetHttpHostName());
	$obsV = getFileVersionPostfix($this->config) . $hosthash;
	$extV = getExtVersionPostfix($this->config);
	$touchV = getTouchVersionPostfix($this->config);

	$isDebug = $this->config->debug;
	$js = $this->config->url->js;
	$lang = $this->lang;

	// user specific version
	// user specific version
	$modulesHash = array();
	foreach ($this->modules as $module)
		$modulesHash[] = $module['id'];
	$vu = $obsV . '/' . md5($this->login . '_' .
		implode('_', $modulesHash) . $hosthash);

	/*
	 * CSS
	 */
	$this->headLink()
		->appendStylesheet($js . '/' . $prefix . 'application.css?' . $vu)
	;

	/*
	 * JavaScript and theming
	 */
	//$controller = $this->controllerName;

	$this->inlineScript()->appendFile($js . '/' . $prefix .
		'application.js?lang=' . $lang . '&' . $vu)
	;

	// Let's add needed scripts
	$this->headScript()
		->prependFile($this->static . '/js/socket.io.min.js');

	$theme = 'neptune';
	if (isset($this->settings['p.theme'])) {
		$theme = $this->settings['p.theme'];
	}

	if ($this->deviceType !== 'mobile') {
		if ($extV >= '4.2.0') {
			$themeName = 'maprox-theme-' . $theme;
			$this->headLink()
				->prependStylesheet($this->static . '/ext-themes/' . $extV
					. '/' . $themeName . '/resources'
					. '/' . $themeName . '-all' . ($isDebug ? '-debug' : '')
					. '.css?' . $obsV)
			;
			$this->headScript()
				->prependFile($this->static . '/ext-themes/' . $extV
					. '/' . $themeName
					. '/' . $themeName . '.js?' . $obsV)
			;
		} else {
			$this->headLink()
				->prependStylesheet($this->static . '/ext-themes/'
					. $extV . '/' . $theme . '.css?' . $obsV)
			;
		}
		$this->headScript()
			->prependFile($this->static . '/js/plupload/plupload.full.js')
			//->prependFile($this->static . '/js/highcharts/modules/canvas-tools.src.js')
			//->prependFile($this->static . '/js/highcharts/modules/annotations.src.js')
			//->prependFile($this->static . '/js/highcharts/modules/data.src.js')
			//->prependFile($this->static . '/js/highcharts/highcharts-more.src.js')
			->prependFile($this->static . '/js/highcharts/highcharts.js')
			//->prependFile($this->static . '/js/highcharts/highstock.src.js')
			->prependFile($this->static . '/js/jquery-1.7.min.js')
			->prependFile($this->static . '/bootstrap.js?' . $extV)
		;
	} else {
		$theme = 'default';
		$this->headLink()
			->prependStylesheet($this->static . '/css/mobile.css?' . $obsV)
			->prependStylesheet($this->static . '/ext-themes/st-'
				. $touchV . '/' . $theme . '.css?' . $obsV)
		;
		$this->headScript()
			->prependFile($this->static
				. '/sencha/sencha-touch-'. $touchV
				. '/sencha-touch-all-debug.js')
		;
	}

?>

<table height="100%" width="100%" id="splash">
<tr>
<td align="center" valign="middle">
	<div id="container">
		<h1 class="plt"><?php echo $this->zt->translate('Loading'); ?></h1>
		<div class="plt">
			<p><?php echo $this->zt->translate(
'Please wait while program is loading system components...'); ?></p>
		</div>
	</div>
</td>
</tr>
</table>