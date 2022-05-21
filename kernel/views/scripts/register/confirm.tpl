<?php
/**
 * Registration page template for observer project
 * /register/monitoring
 *
 * @project    Maprox <http://www.maprox.net>
 * @copyright  2009-2012, Maprox LLC
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
		$this->headLink()
			->prependStylesheet($this->static
				. '/ext-themes/' . $extV . '/' . $theme . '.css?' . $obsV)
		;
	}
	;
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
<?php if (empty($this->hash)) { ?>
	<div id="access_error" class="x-hidden">Ошибка доступа.</div>
<?php } elseif(!$this->valid) { ?>
	<div id="access_error" class="x-hidden">Неправильный ключ-идентификатор.</div>
<?php } else { ?>
	<div class="x-hidden">
		<input id="register-password" type="text" name="password" />
		<input id="register-password2" type="text" />
		<input id="register-login" type="text" name="login" />
	</div>
<?php } ?>
