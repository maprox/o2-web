<?php
/*

	There is a problem report from user at %product%.

	[info]

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
//$this->subject = $zt->_('A problem report', $locale);

$user = $this->params['user'];
$user_firstname = $user->get('firstname');
$login = $user->get('login');
$firmId = $user->getFirmId();
$company = $this->params['company'];

$message = $this->params['message'];
$phones = $this->params['phones'];
$emails = $this->params['emails'];
$guestEmail = $this->params['guestemail'];
$browserData = $this->params['browser_data'];

// set subject
$this->subject = mb_substr($message, 0, 60, 'UTF-8');
if (mb_strlen($message, 'UTF-8') > 60) {
	$this->subject .= '...';
}

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

// Set subject
$this->clientMail
		->clearSubject()->setSubject($this->subject);

echo $this->emailParagraph(
	sprintf($zt->_('There is a problem report from user at %s', $locale) . ':',
		$zt->_($vars->product, $locale))
);
echo $this->emailParagraph(
	$this->emailFontStyle($message, array('italic'))
);
if ($this->format == 'html') {
	echo '<div style="
			padding:0 16px;
			border:1px solid #eee;
			background:#f6f6f6;
		">';
}

$style = array('bold');

if ($login)
{
	echo $this->emailParagraph(
		$zt->_('Login', $locale) . ': ' . $this->emailFontStyle($login, $style) .
		$this->emailEOL() .
		$zt->_('Company', $locale) . ': ' . $this->emailFontStyle($company['name'],
			$style) .
		$this->emailEOL()
	);
}

?>
<?php if (!empty($phones)): ?>
	<?php
		echo $this->emailFontStyle($zt->_('Phones', $locale) . ':', array('italic'));
		echo $this->emailEOL();
	?>
<?php foreach($phones as $phone): ?>
	<?php
		echo $phone->get('number') . ' ' . $phone->get('note');
		echo $this->emailEOL();
	?>
<?php endforeach; ?>
<?php echo $this->emailEOL(); ?>
<?php endif; ?>
<?php if(!empty($emails)): ?>
	<?php
		echo $this->emailFontStyle($zt->_('Emails', $locale) . ':', array('italic'));
		echo $this->emailEOL();
	?>
<?php foreach($emails as $email): ?>
	<?php
		echo $email->get('address') . ' ' . $email->get('note');
		echo $this->emailEOL();
	?>
<?php endforeach; ?>
<?php endif; ?>
<?php
	if ($guestEmail)
	{
		echo $zt->_('Email', $locale) . ': ' . $guestEmail;
		echo $this->emailEOL();
	}
?>
<?php echo $this->emailEOL(); ?>
<?php echo $zt->_('URL', $locale);?>: <?php
	echo $browserData['url']; echo $this->emailEOL(); ?>
<?php echo $zt->_('Useragent', $locale);?>: <?php
	echo $browserData['useragent']; echo $this->emailEOL(); ?>
<?php echo $zt->_('Resolution', $locale);?>: <?php
	echo $browserData['screen']; echo $this->emailEOL(); ?>
<?php echo $zt->_('Cookie', $locale);?>: <?php
	echo $zt->_($browserData['cookie'] ? 'Enabled' : 'Disabled', $locale);
	echo $this->emailEOL();
?>
<?php echo $this->emailEOL();?>
	<?php
		echo $this->emailFontStyle($zt->_('Features', $locale) . ':', array('italic'));
		echo $this->emailEOL();
	?>
<?php foreach ($browserData['features'] as $name => $feature) { ?>
	<?php
		$featureFlag = $feature ?
			$zt->_('Yes', $locale) : $zt->_('No', $locale);
		echo $name . ': ' . $featureFlag;
		echo $this->emailEOL();
	?>
<?php } ?>

<?php
if ($this->format == 'html') {
	echo '</div>';
}

// ====================================================================
//
// FOOTER
//
echo $this->render('footer.tpl');
//
//
// ====================================================================

?>
