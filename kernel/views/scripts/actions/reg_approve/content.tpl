<?php
/*

	Hello, %firstname%.

	Your account has been activated by the administrator at %product%.
	To log in use [this link] and enter your username and password.

	Your login: %login%
	Your password: %password%

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Your account has been activated', $locale);

$user = $this->params['user'];
$pass = $this->params['password'];
$login = $this->params['login'];

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
	sprintf($zt->_('Your account has been activated by the ' .
		'administrator at %s', $locale),
		$zt->_($vars->product, $locale)) . '.' .
	$this->emailEOL() .
	$this->emailLink($zt->_('To log in use %sthis link%s and enter your ' .
		'username and password', $locale),
		$this->hostLink)
	. ':'
);
echo $this->emailParagraph(
	$zt->_('Your login', $locale) . ': ' .
		$this->emailFontStyle($login, array('bold')) .
	$this->emailEOL() .
	$zt->_('Your password', $locale) . ': ' .
		$this->emailFontStyle($pass, array('bold'))
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
