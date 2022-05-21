<?php
/*

	Hello, %firstname%.

	Your password at %product% is successfully reset.

	Your login: %login%
	Your new password: %password%

	To log in use [this link] and enter your username and your new password.

		Remember that you can change your password at any time
		from the administration panel. [Read more...]

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Password recovery', $locale);

$helpPasswordChange = $vars->docsLink .
	'userguide/panel-admin/settings.html#settings-authorization';

$pass = $this->params['newpassword'];
$user = $this->params['user'];
$login = $user->get('login');

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($user->get('firstname'));
echo $this->emailParagraph(
	sprintf($zt->_('Your password at %s is successfully reset', $locale
	), $zt->_($vars->product, $locale)) . '.' .
	$this->emailEOL() .
	$this->emailLink($zt->_('To log in use %sthis link%s and enter your ' .
		'username and your new password', $locale),
		$this->hostLink)
	. ':'
);
echo $this->emailParagraph(
	$zt->_('Your login', $locale) . ': ' .
		$this->emailFontStyle($login, array('bold')) .
	$this->emailEOL() .
	$zt->_('Your new password', $locale) . ': ' .
		$this->emailFontStyle($pass, array('bold'))
);
echo $this->emailInline(
	$zt->_('Remember that you can change your password at any time ' .
		'from the administration panel', $locale)
	. ". "
	. $this->emailLink('%s' . $zt->_('Read more', $locale) . '%s',
		$helpPasswordChange)
);

// ====================================================================
//
// FOOTER
//
echo $this->render('footer.tpl');
//
//
// ====================================================================

?>
