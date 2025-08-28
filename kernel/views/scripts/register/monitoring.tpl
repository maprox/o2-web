<?php
/**
 * Registration page template for observer project
 * /register/monitoring
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2011, Maprox LLC
 */

	// layout type prefix
	$prefix = ($this->deviceType === 'mobile') ? 'mobile.' : '';

	// current file version
	$obsV = getFileVersionPostfix($this->config);
	$extV = getExtVersionPostfix($this->config);
	$touchV = getTouchVersionPostfix($this->config);

	$js = $this->config->url->js;
	$lang = $this->lang;

	// user specific version
	$vu = $obsV . '/' . md5($this->login . '_' . implode('_', (array) $this->actions));

	$theme = 'default';
	if ($this->settings['p.theme'])
		$theme = $this->settings['p.theme'];
	if ($extV < '4.1.0') {
		$this->headLink()
			->prependStylesheet($this->static
				. '/css/themes/'. $theme . '.css?' . $obsV)
		;
	} else {
    $themeName = 'maprox-theme-' . $theme;
    $this->headLink()
      ->prependStylesheet($this->static . '/ext-themes/' . $extV
        . '/' . $themeName . '/resources'
        . '/' . $themeName . '-all.css?' . $obsV)
    ;
    $this->headScript()
      ->prependFile($this->static . '/ext-themes/' . $extV
        . '/' . $themeName
        . '/' . $themeName . '.js?' . $obsV)
    ;
	}
	$this->headScript()
		->prependFile($this->static
			. "/bootstrap.js?" . $extV)
	;
	$lang = $this->lang;

	$this->headTitle($this->zt->translate('Registration'));

	$url = $this->config->url;
	$this->headScript()->appendFile($url->js . '/register.js?lang=' . $lang . '&' . $obsV);
	$this->headLink()->appendStylesheet($url->js . '/register.css?' . $obsV);
?>

<div class="x-hidden">
	<select id="register-tariff" name="tariff">
		<option value="monitoring_free"><?php
			echo $this->zt->translate('Free'); ?></option>
		<option value="monitoring_advanced"><?php
			echo $this->zt->translate('Base'); ?></option>
		<option value="monitoring_full"><?php
			echo $this->zt->translate('Business'); ?></option>
	</select>
</div>