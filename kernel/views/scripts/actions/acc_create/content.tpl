<?php
/*

	Hello, %firstname%.

	User %username% has created an account for you at %s.
	To log in use [this link] and enter your username and password.

	Your login: %login%
	Your password: %password%

		If you have any questions about registration process you can ask
		the manager by sending him an email to %s.

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Account has been created for you', $locale);

$user = $this->params['user'];
$manager = $this->params['current_user'];
$managerEmail = $manager ? $manager->getEmail() : null;
$login = $this->params['login'];
$pass = $this->params['pass'];

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
	sprintf($zt->_('User %s has created an account for you at %s', $locale),
		$manager->get('firstname'), $zt->_($vars->product, $locale)) . '.' .
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

if ($managerEmail)
{
	echo $this->emailInline(
		sprintf($zt->_('If you have any questions about registration ' .
	'process you can ask the manager by sending him an email to %s', $locale),
		sprintf('<a href="mailto:%1$s">%1$s</a>', $managerEmail)) . '.'
	);
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
