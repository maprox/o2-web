<?php
/**
 * Admin page template
 * /admin (eq. /)
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
 */

	// current file version
	$v = getFileVersionPostfix($this->config);

	// current file version
	$hosthash = md5(GetHttpHostName());
	$obsV = getFileVersionPostfix($this->config) . $hosthash;
	$extV = getExtVersionPostfix($this->config);
	$touchV = getTouchVersionPostfix($this->config);

	$isDebug = $this->config->debug;
	$js = $this->config->url->js;
	$lang = $this->lang;

	// user specific version
	$modulesHash = array();
	foreach ($this->modules as $module)
		$modulesHash[] = $module['id'];
	$vu = $obsV . '/' . md5($this->login . '_' .
		implode('_', $modulesHash). $hosthash);

	// Let's add needed scripts
	$this->headScript()
		->prependFile($this->static . '/js/socket.io.min.js');
	if ($this->deviceType !== 'mobile')
	{
		$theme = 'neptune';
		if ($this->settings['p.theme'])
			$theme = $this->settings['p.theme'];
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
			->prependFile($this->static
				. "/bootstrap.js?" . $extV)
		;
	}
	else
	{
		$theme = 'default';
		$this->headLink()
			->prependStylesheet($this->static . '/css/mobile.css?' . $obsV)
			->prependStylesheet($this->static . '/ext-themes/st-'
				. $touchV . '/' . $theme . '.css?' . $obsV);
		$this->headScript()
			->prependFile($this->static
				. '/sencha/sencha-touch-'. $touchV
				. '/sencha-touch-all-debug.js');
	}

	/*
	 * CSS
	 */
	$this->headLink()
		->appendStylesheet($js . '/application.admin.css?' . $vu)
	;
	/*
	 * JavaScript
	 */
	$this->inlineScript()
		->prependFile($js . '/application.admin.js?lang=' . $lang . '&' . $vu)
	;
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
