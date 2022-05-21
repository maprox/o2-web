<?php
/*

	Hello, %firstname%.

	This letter is sent to you, because there was a request to
	reset your password at %product%.
	To reset the password, click on [this link].

		If you did not send this request, delete this letter.

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$prefix = $vars->notifyEmailSubjectPrefix;
$locale = $this->locale;
$this->subject = $zt->_('Password recovery', $locale);

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($this->owner->get('firstname'));
echo $this->emailParagraph(
	sprintf($zt->_(
		'This letter is sent to you, because there was ' .
		'a request to reset your password at %s', $locale
	), $zt->_($vars->product, $locale))
	. '.'
);
echo $this->emailParagraph(
	$this->emailLink('To reset the password, click on %sthis link%s',
		$this->owner->getRestoreLink())
	. '.'
);
echo $this->emailInline(
	$zt->_('If you did not send this request, delete this letter', $locale)
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
