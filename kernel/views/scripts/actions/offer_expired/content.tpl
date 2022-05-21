<?php
/*

	Hello, %username%.

	To continue the cooperation, please update your offer at %product%.
	To do this, copy the last sended offer from the [list of you offers], and
	enter the actual price.

		For advanced information about offer creation and editing,
		visit [this] help page

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('Please update your offer', $locale);

# DIRTY! hack:
$prefix = ($this->config->db->params->dbname == 'observer_dev' ? 'it.' : '');
$offersLink = getProtocol() . '://' . $prefix . 'supply.maprox.net/#dn_offer';

$helpOffers = $vars->docsLink . 'userguide/panel-desktop/offer.html';

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
	sprintf($zt->_('To continue the cooperation, please update ' .
	'your offer at %s', $locale), $zt->_($vars->product, $locale)) . '. ' .
	$this->emailLink($zt->_('To do this, copy the last sended offer from ' .
		'the %slist of your offers%s, and enter the actual price', $locale),
		$offersLink)
	. '.'
);
echo $this->emailInline(
	$this->emailLink($zt->_('For advanced information about offer ' .
		'creation and editing, visit %sthis%s help page', $locale),
		$helpOffers)
	. '.'
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
