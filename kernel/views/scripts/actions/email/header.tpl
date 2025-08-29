<?php
/*

	This is an email header mockup.
	It is applied for each email in the system.

 */

	// init variables
	$static = $this->config->resources->static;
	$zt = $this->zt;
	$vars = (object)$this->variables;
	$prefix = $vars->notifyEmailSubjectPrefix;
	$locale = $this->locale;
	$title = $zt->_($vars->title, $locale);

	if (!isset($this->subject))
	{
		$this->subject = $zt->_('Notification', $locale);
	}

	$this->clientMail
		->clearFrom()->setFrom($vars->notifyEmail)
		->clearSubject()->setSubject(($prefix ?
			'[' . $zt->_($prefix, $locale) . '] ' : '') . $this->subject);

if ($this->format == 'html'): ?>
<table
	width="100%"
	border="0"
	cellspacing="0"
	cellpadding="0"
	style="
		font-family:arial,sans-serif;
		font-size:14pt;
		background:#eee url('<?php
	echo $static . '/img/email-pattern0.png';
?>') repeat">
<tr><td>
	<table
		width="620"
		border="0"
		cellspacing="0"
		cellpadding="0"
		align="center">
	<tr><td style="
			padding:0 1.2em;
			font-family:'Trebuchet MS',arial,sans-serif;
		">
		<div style="
			padding:0.4em 0;
			font-size:26pt;
			color:#ddd"><?php echo $title; ?>
		</div>
	</td></tr>
	<tr><td style="
			padding:1.2em;
			font-size:12pt;
			border:1px solid #ccc;
			background:#fff;
		">
<?php endif;