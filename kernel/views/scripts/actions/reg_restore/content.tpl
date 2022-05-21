<?php
/*

	Hello, %firstname%.

	Your account has been restored by the administrator at %product%.
	To log in use [this link] and enter your login and password.

	Your login: %login%

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Your account has been restored', $locale);

$user = $this->params['user'];
$manager = $this->params['manager'];
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
	sprintf($zt->_('Your account has been restored by the ' .
		'administrator at %s', $locale),
		$zt->_($vars->product, $locale)) . '.' .
	$this->emailEOL() .
	$this->emailLink($zt->_(
		'To log in, please use %sthis link%s and enter your ' .
		'username and password', $locale),
		$this->hostLink)
	. '.'
);
echo $this->emailParagraph(
	$zt->_('Your login', $locale) . ': ' .
		$this->emailFontStyle($login, array('bold'))
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
