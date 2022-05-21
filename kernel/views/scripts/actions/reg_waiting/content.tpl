<?php
/*

	Hello, %firstname%.

	Your account is registered at %product%, but is inactive until
	it would be confirmed by our manager.

		If you have any questions about registration process you can ask
		the manager by sending him an email to %s.

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Please wait for confirmation of registration',
	$locale);

$user = $this->params['user'];
$manager = $this->params['manager'];
$managerEmail = $manager ? $manager->getEmail() : null;

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
	sprintf($zt->_('Your account is registered at %s, but is inactive ' .
		'until it would be confirmed by our manager', $locale),
		$zt->_($vars->product, $locale)) . '.'
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
