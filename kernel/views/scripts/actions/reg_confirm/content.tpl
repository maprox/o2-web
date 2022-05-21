<?php
/*

	Hello, %firstname%.

	To confirm the registration, please follow [this link].

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Registration approval', $locale);

$user = $this->params['user'];
$hash = $this->params['hash'];

$link = $this->hostLink . '/register/confirm/?id=' . $this->params['hash'];

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
	$this->emailLink($zt->_('To confirm the registration, please ' .
		'follow %sthis link%s', $locale), $link) . '.'
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
