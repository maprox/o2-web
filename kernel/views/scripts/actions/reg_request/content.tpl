<?php
/*

	Hello, %manager-firstname%.

	The new user has been registered at %product% and is awaiting
	for confirmation of registration of his account.
	You must activate it from the admin panel in tab [«Suppliers»].

	First name: %firstname%
	Last name: %lastname%

	Company: %company-name%
	Address: %company-address%
	INN: %company-inn%
	KPP: %company-kpp%
	OGRN: %company-ogrn%

	Sincerely, administration of %product%

 */

// init variables
$zt = $this->zt;
$vars = (object)$this->variables;
$locale = $this->locale;
$this->subject = $zt->_('New user is awaiting for registration', $locale);

$suppliersLink = $this->hostLink . '/#dn_supplier';

$user = $this->params['user'];
$userFirm = $this->params['userfirm'];
$manager = $this->params['manager'];
$managerFirm = $this->params['managerfirm'];

$firstname = $user->get('firstname');
$lastname = $user->get('lastname');

$company_name = $userFirm->get('name');
$company_address = Falcon_Action_Address::getFull(
	$userFirm->get('id_address_legal'));
$company_inn = $userFirm->get('inn');
$company_kpp = $userFirm->get('kpp');
$company_ogrn = $userFirm->get('ogrn');

// ====================================================================
//
// HEADER
//
echo $this->render('header.tpl');
//
//
// ====================================================================

echo $this->emailGreeting($manager->get('firstname'));
echo $this->emailParagraph(
	sprintf($zt->_('The new user has been registered at %s and ' .
	'is awaiting for confirmation of registration of his account', $locale),
		$zt->_($vars->product, $locale)) . '.'
);

if ($this->format == 'html') {
	echo '<div style="
			padding:0 16px;
			border:1px solid #eee;
			background:#f6f6f6;
		">';
}

echo $this->emailParagraph(
	$zt->_('First name', $locale) . ': ' .
		$this->emailFontStyle($firstname, array('bold')) .
	$this->emailEOL() .
	$zt->_('Last name', $locale) . ': ' .
		$this->emailFontStyle($lastname, array('bold'))
);

echo $this->emailParagraph(
	$zt->_('Company', $locale) . ': ' .
		$this->emailFontStyle($company_name, array('bold')) .
	$this->emailEOL() .
	$zt->_('Address', $locale) . ': ' .
		$this->emailFontStyle($company_address, array('bold')) .
	$this->emailEOL() .
	$zt->_('INN', $locale) . ': ' .
		$this->emailFontStyle($company_inn, array('bold')) .
	$this->emailEOL() .
	$zt->_('KPP', $locale) . ': ' .
		$this->emailFontStyle($company_kpp, array('bold')) .
	$this->emailEOL() .
	$zt->_('OGRN', $locale) . ': ' .
		$this->emailFontStyle($company_ogrn, array('bold'))
);

if ($this->format == 'html') {
	echo '</div>';
}

echo $this->emailParagraph(
	$this->emailLink($zt->_('You must activate it from the admin panel ' .
		'in tab %s"Suppliers"%s', $locale), $suppliersLink)
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
