<?php
/*

	Hello, %firstname%.

	Your account has been deleted by the administrator at %product%.
	If you have questions about the reasons of your account deletion, you can
	ask the manager by sending him an email to %s.

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Your account has been deleted', $locale);

$user = $this->params['user'];
$manager = $this->params['manager'];
$managerEmail = $manager->getEmail();

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
	sprintf($zt->_('Your account has been deleted by the ' .
		'administrator at %s', $locale),
		$zt->_($vars->product, $locale)) . '.' .
	($managerEmail ?
		$this->emailEOL() .
		sprintf($zt->_('If you have questions about the reasons of your ' .
			'account deletion, you can ask the manager by sending him an ' .
			'email to %s', $locale),
			sprintf('<a href="mailto:%1$s">%1$s</a>', $managerEmail)) . '.'
		: ''
	)
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
